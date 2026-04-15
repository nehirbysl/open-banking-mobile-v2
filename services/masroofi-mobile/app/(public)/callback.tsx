/**
 * Deep-link callback from BD Online.
 *
 * URL shape: masroofi://callback?code=...&state=...
 *
 * We exchange the code for an access token via /api/auth-codes/exchange,
 * persist the bank credentials securely on-device + on the server, and
 * then route the user into the authenticated app.
 */

import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import PrimaryButton from "../../components/PrimaryButton";
import { exchangeAuthCode, validateState } from "../../utils/consent";
import { theme } from "../../utils/theme";

type CallbackPhase = "processing" | "success" | "error";

export default function Callback() {
  const router = useRouter();
  const params = useLocalSearchParams<{ code?: string; state?: string; error?: string; error_description?: string }>();
  const [phase, setPhase] = useState<CallbackPhase>("processing");
  const [error, setError] = useState("");

  useEffect(() => {
    const process = async () => {
      try {
        const code = typeof params.code === "string" ? params.code : null;
        const stateParam = typeof params.state === "string" ? params.state : null;

        if (!code) {
          if (params.error) {
            throw new Error(
              typeof params.error_description === "string"
                ? params.error_description
                : String(params.error),
            );
          }
          throw new Error("Missing authorization code in callback");
        }

        if (stateParam) {
          const valid = await validateState(stateParam);
          if (!valid) {
            throw new Error("Invalid state parameter. Please try connecting again.");
          }
        }

        await exchangeAuthCode(code);
        setPhase("success");

        setTimeout(() => {
          router.replace("/");
        }, 1200);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to complete bank connection";
        setError(msg);
        setPhase("error");
      }
    };
    process();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.card}>
        {phase === "processing" && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.title}>Connecting to Bank Dhofar</Text>
            <Text style={styles.desc}>
              Exchanging the authorisation and setting up your account...
            </Text>
          </View>
        )}

        {phase === "success" && (
          <View style={styles.center}>
            <View style={[styles.iconBadge, { backgroundColor: "#DCF8EC" }]}>
              <Ionicons name="checkmark" size={36} color={theme.colors.income} />
            </View>
            <Text style={styles.title}>Connected!</Text>
            <Text style={styles.desc}>Your Bank Dhofar account is now linked.</Text>
          </View>
        )}

        {phase === "error" && (
          <View style={styles.center}>
            <View style={[styles.iconBadge, { backgroundColor: "#FFE5E5" }]}>
              <Ionicons
                name="alert-circle"
                size={36}
                color={theme.colors.danger}
              />
            </View>
            <Text style={styles.title}>Connection failed</Text>
            <Text style={styles.desc}>{error}</Text>
            <PrimaryButton
              label="Try again"
              onPress={() => router.replace("/connect")}
              style={{ marginTop: 18, alignSelf: "stretch" }}
            />
            <PrimaryButton
              label="Back to Masroofi"
              variant="ghost"
              onPress={() => router.replace("/welcome")}
              style={{ marginTop: 8, alignSelf: "stretch" }}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    padding: 28,
    ...theme.shadow.md,
  },
  center: { alignItems: "center" },
  iconBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.colors.textPrimary,
    marginTop: 14,
    textAlign: "center",
  },
  desc: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 6,
    textAlign: "center",
    lineHeight: 20,
  },
});
