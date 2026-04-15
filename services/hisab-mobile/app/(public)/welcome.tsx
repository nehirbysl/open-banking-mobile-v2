/**
 * Welcome / landing screen for unauthenticated users.
 */

import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, radius, spacing } from "../../utils/theme";

const FEATURES: Array<{
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
}> = [
  {
    icon: "stats-chart-outline",
    title: "Live revenue analytics",
    body: "See today's revenue, MTD trends and sparklines at a glance.",
  },
  {
    icon: "people-outline",
    title: "Know your top customers",
    body: "Rank buyers by spend, frequency and recency.",
  },
  {
    icon: "pulse-outline",
    title: "Categorised cash flow",
    body: "Automatic merchant categorisation for every transaction.",
  },
  {
    icon: "shield-checkmark-outline",
    title: "Bank-grade consent",
    body: "Read-only access via OBIE consents you can revoke any time.",
  },
];

export default function Welcome() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
          <View style={styles.logoWrap}>
            <Ionicons name="trending-up" size={34} color="#FFF" />
          </View>
          <Text style={styles.brand}>Hisab</Text>
          <Text style={styles.tagline}>
            Real-time revenue intelligence for your business.
          </Text>
          <Text style={styles.poweredBy}>Powered by Bank Dhofar Open Banking</Text>
        </View>

        <View style={styles.features}>
          {FEATURES.map((f) => (
            <View key={f.title} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Ionicons name={f.icon} size={18} color={colors.primary} />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureBody}>{f.body}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.ctas}>
          <Pressable
            style={[styles.primaryBtn]}
            onPress={() => router.push("/(public)/signup")}
          >
            <Text style={styles.primaryBtnText}>Create account</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFF" />
          </Pressable>
          <Pressable
            style={styles.secondaryBtn}
            onPress={() => router.push("/(public)/login")}
          >
            <Text style={styles.secondaryBtnText}>I already have an account</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingBottom: spacing.xxl },
  hero: {
    alignItems: "center",
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  logoWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 5,
  },
  brand: {
    marginTop: spacing.md,
    fontSize: 40,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: -1,
  },
  tagline: {
    marginTop: 8,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    maxWidth: 320,
    lineHeight: 22,
  },
  poweredBy: {
    marginTop: spacing.sm,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  features: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureRow: { flexDirection: "row", gap: spacing.sm, alignItems: "flex-start" },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: `${colors.primary}14`,
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: { flex: 1, minWidth: 0 },
  featureTitle: { fontSize: 15, fontWeight: "700", color: colors.text },
  featureBody: {
    marginTop: 2,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  ctas: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
    gap: spacing.sm,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: radius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryBtnText: { color: "#FFF", fontWeight: "800", fontSize: 16, letterSpacing: 0.3 },
  secondaryBtn: {
    height: 48,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnText: {
    color: colors.textSecondary,
    fontWeight: "600",
    fontSize: 14,
  },
});
