/**
 * Bank connection screen — kicks off the OBIE OAuth flow.
 *
 * Even though this screen lives under (public) for routing convenience, it is
 * reachable only from an authenticated state. The connect flow opens an in-app
 * browser pointed at BD Online; approval comes back via `hisab://callback`.
 */

import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { connectBank } from "../../utils/consent";
import { getCurrentUser } from "../../utils/auth";
import { colors, radius, spacing } from "../../utils/theme";

const PERMISSIONS: Array<{ label: string; detail: string }> = [
  { label: "Account details", detail: "Account numbers, types and nicknames." },
  { label: "Balances", detail: "Current and available balances for each account." },
  { label: "Transactions", detail: "90 days of transaction history (read-only)." },
];

export default function ConnectScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleConnect() {
    setError("");
    const user = await getCurrentUser();
    if (!user) {
      setError("Please sign in first");
      return;
    }
    setLoading(true);
    const result = await connectBank(user.email);
    setLoading(false);
    if (result.ok) {
      router.replace("/(auth)");
    } else {
      setError(result.error || "Could not connect — please try again");
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>

        <View style={styles.header}>
          <View style={styles.logoWrap}>
            <Ionicons name="link" size={26} color="#FFF" />
          </View>
          <Text style={styles.title}>Connect Bank Dhofar</Text>
          <Text style={styles.subtitle}>
            We use OBIE read-only consent. You stay in control and can revoke any time.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>What Hisab will see</Text>
          {PERMISSIONS.map((p) => (
            <View key={p.label} style={styles.permRow}>
              <View style={styles.check}>
                <Ionicons name="checkmark" size={14} color={colors.primary} />
              </View>
              <View style={styles.permBody}>
                <Text style={styles.permLabel}>{p.label}</Text>
                <Text style={styles.permDetail}>{p.detail}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>What Hisab will NOT do</Text>
          {[
            "Move money — we have no payment initiation scope.",
            "Share your data — it stays on Hisab and your device.",
            "Use your credentials — approval happens on BD Online.",
          ].map((item) => (
            <View key={item} style={styles.permRow}>
              <View style={[styles.check, styles.checkX]}>
                <Ionicons name="close" size={14} color={colors.danger} />
              </View>
              <View style={styles.permBody}>
                <Text style={[styles.permLabel, { fontWeight: "600" }]}>{item}</Text>
              </View>
            </View>
          ))}
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={16} color={colors.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <Pressable
          style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
          onPress={handleConnect}
          disabled={loading}
        >
          <Text style={styles.primaryBtnText}>
            {loading ? "Opening BD Online…" : "Continue to BD Online"}
          </Text>
          <Ionicons name="open-outline" size={16} color="#FFF" />
        </Pressable>
        <Text style={styles.small}>
          You will be redirected to Bank Dhofar to approve this consent.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.md },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: { alignItems: "center", marginVertical: spacing.lg },
  logoWrap: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginTop: spacing.md,
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    maxWidth: 320,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  permRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.successBg,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkX: { backgroundColor: colors.dangerBg },
  permBody: { flex: 1, minWidth: 0 },
  permLabel: { fontSize: 14, fontWeight: "700", color: colors.text },
  permDetail: { marginTop: 2, fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.dangerBg,
    padding: 12,
    borderRadius: radius.md,
  },
  errorText: { flex: 1, fontSize: 13, color: colors.danger, fontWeight: "600" },
  primaryBtn: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  primaryBtnDisabled: { opacity: 0.7 },
  primaryBtnText: { color: "#FFF", fontSize: 16, fontWeight: "800", letterSpacing: 0.3 },
  small: {
    textAlign: "center",
    fontSize: 12,
    color: colors.textMuted,
  },
});
