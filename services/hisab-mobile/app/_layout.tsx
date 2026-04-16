/**
 * Root layout — Stack navigator with auth gating.
 *
 * Routes:
 *   (public)/* — welcome / login / signup / connect / callback — unauthenticated
 *   (auth)/*   — main tabbed app — requires a signed-in Hisab user
 *
 * When the user isn't signed in, we redirect to /welcome. Once signed in we
 * redirect to /(auth) (the dashboard).
 */

import React, { useCallback, useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { getCurrentUser, HisabUser } from "../utils/auth";
import { colors } from "../utils/theme";

export default function RootLayout() {
  const [user, setUser] = useState<HisabUser | null | undefined>(undefined);
  const segments = useSegments();
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    const u = await getCurrentUser();
    setUser(u);
  }, []);

  // Re-check AsyncStorage on every route change. Signup / login write the
  // session asynchronously and then navigate — this effect picks up the
  // fresh session instead of using the stale null from initial mount
  // (which would otherwise redirect straight back to /welcome).
  useEffect(() => {
    checkAuth();
  }, [checkAuth, segments]);

  useEffect(() => {
    if (user === undefined) return; // loading

    const top = segments[0];
    const inPublic = top === "(public)";
    const inAuth = top === "(auth)";

    if (!user && inAuth) {
      router.replace("/welcome");
    } else if (user && inPublic) {
      // Allow the connect / callback screens even when authed
      const sub = segments[1];
      if (sub !== "connect" && sub !== "callback") {
        router.replace("/");
      }
    } else if (!user && !inPublic && !inAuth) {
      // Cold start, no explicit route yet
      router.replace("/welcome");
    }
  }, [user, segments, router]);

  if (user === undefined) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
        <StatusBar style="dark" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.bg },
          headerShown: false,
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bg,
  },
});
