/**
 * Deep-link callback handler.
 *
 * Most connect flows complete inside WebBrowser.openAuthSessionAsync in
 * utils/consent.ts, but this screen exists as a fallback for systems that
 * push the user back to the app via its scheme instead.
 */

import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { exchangeAuthCode, storeCredentials, validateState } from "../../utils/consent";
import { getCurrentUser } from "../../utils/auth";
import { colors, radius, spacing } from "../../utils/theme";

export default function CallbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ code?: string; state?: string; error?: string }>();
  const [status, setStatus] = useState<"working" | "ok" | "error">("working");
  const [message, setMessage] = useState("Finalising connection…");

  useEffect(() => {
    (async () => {
      const code = typeof params.code === "string" ? params.code : null;
      const state = typeof params.state === "string" ? params.state : null;
      const err = typeof params.error === "string" ? params.error : null;

      if (err) {
        setStatus("error");
        setMessage(`Bank Dhofar returned: ${err}`);
        return;
      }
      if (!code || !state) {
        setStatus("error");
        setMessage("Authorization code missing from callback.");
        return;
      }
      const stateOk = await validateState(state);
      if (!stateOk) {
        setStatus("error");
        setMessage("State mismatch — possible CSRF.");
        return;
      }

      try {
        const ex = await exchangeAuthCode(code);
        const user = await getCurrentUser();
        await storeCredentials(user?.email || "", ex.access_token, ex.consent_id);
        setStatus("ok");
        setMessage("Connected — opening dashboard…");
        setTimeout(() => router.replace("/(auth)"), 500);
      } catch (e) {
        setStatus("error");
        setMessage(e instanceof Error ? e.message : "Token exchange failed.");
      }
    })();
  }, [params.code, params.error, params.state, router]);

  return (
    <View style={styles.wrap}>
      {status === "working" && (
        <>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.text}>{message}</Text>
        </>
      )}
      {status === "ok" && (
        <>
          <View style={[styles.badge, { backgroundColor: colors.successBg }]}>
            <Ionicons name="checkmark" size={28} color={colors.success} />
          </View>
          <Text style={styles.text}>{message}</Text>
        </>
      )}
      {status === "error" && (
        <>
          <View style={[styles.badge, { backgroundColor: colors.dangerBg }]}>
            <Ionicons name="alert" size={28} color={colors.danger} />
          </View>
          <Text style={styles.text}>{message}</Text>
          <Text style={styles.sub} onPress={() => router.replace("/(public)/connect")}>
            Try again
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    gap: spacing.md,
    backgroundColor: colors.bg,
  },
  badge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  text: { fontSize: 14, color: colors.textSecondary, textAlign: "center" },
  sub: {
    marginTop: spacing.sm,
    fontSize: 14,
    color: colors.primary,
    fontWeight: "700",
  },
});
