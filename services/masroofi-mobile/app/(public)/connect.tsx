/**
 * Connect your Bank Dhofar account via Open Banking consent.
 *
 * Flow:
 *   1. Create an account-access consent via /api/consent.
 *   2. Launch BD Online's consent page through `bdonline://consent/approve?...`
 *      (falls back to the web consent page in the system browser).
 *   3. BD Online redirects back to `masroofi://callback?code=...&state=...`,
 *      which is routed into the dedicated /(public)/callback screen by
 *      the root layout.
 */

import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import PrimaryButton from "../../components/PrimaryButton";
import { createConsent, openBankConsent } from "../../utils/consent";
import { isBankConnected } from "../../utils/auth";
import { theme } from "../../utils/theme";

const PERMISSIONS: { icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { icon: "card-outline", label: "View account details" },
  { icon: "eye-outline", label: "View balances" },
  { icon: "receipt-outline", label: "View transaction history" },
];

export default function ConnectBank() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  const handleConnect = async () => {
    setLoading(true);
    setStep(1);
    try {
      if (await isBankConnected()) {
        Alert.alert("Already connected", "Your bank account is already linked.");
        router.replace("/");
        return;
      }

      const consent = await createConsent();
      setStep(2);

      const launchedUrl = await openBankConsent(consent.consent_id);
      setStep(3);
      // Do not redirect automatically: the deep-link callback will bring us
      // into /(public)/callback when the user finishes in BD Online.
      // Keep the connect screen visible so returning from the browser shows
      // a helpful message instead of a blank stack.
      console.log("[masroofi] launched consent flow via:", launchedUrl);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to start bank connection";
      Alert.alert("Connection failed", msg);
      setStep(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={22} color={theme.colors.textPrimary} />
        </Pressable>

        <Text style={styles.title}>Connect Bank Dhofar</Text>
        <Text style={styles.subtitle}>
          We\u2019ll request read-only access to the accounts you select.
        </Text>

        <LinearGradient
          colors={["#6C5CE7", "#4834d4"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.bankRow}>
            <View style={styles.bankLogo}>
              <Ionicons name="business" size={24} color="#FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.bankName}>Bank Dhofar</Text>
              <Text style={styles.bankTag}>Open Banking \u00b7 Powered by CBO</Text>
            </View>
            <View style={styles.bankBadge}>
              <Text style={styles.bankBadgeText}>Secure</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.permissions}>
          <Text style={styles.sectionTitle}>Masroofi will request permission to</Text>
          {PERMISSIONS.map((p) => (
            <View key={p.label} style={styles.permRow}>
              <View style={styles.permIcon}>
                <Ionicons name={p.icon} size={16} color={theme.colors.primary} />
              </View>
              <Text style={styles.permLabel}>{p.label}</Text>
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={theme.colors.income}
              />
            </View>
          ))}
        </View>

        {loading ? (
          <View style={styles.stepper}>
            <StepDot active={step >= 1} label="Creating consent" />
            <StepLine active={step >= 2} />
            <StepDot active={step >= 2} label="Prepared" />
            <StepLine active={step >= 3} />
            <StepDot active={step >= 3} label="Opening BD Online" />
          </View>
        ) : null}

        <PrimaryButton
          label={loading ? "Opening BD Online..." : "Continue to BD Online"}
          iconLeft="lock-closed-outline"
          iconRight="open-outline"
          loading={loading}
          onPress={handleConnect}
          style={{ marginTop: 24 }}
        />

        <View style={styles.safety}>
          <Ionicons
            name="shield-checkmark"
            size={18}
            color={theme.colors.income}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.safetyTitle}>Your data stays at the bank</Text>
            <Text style={styles.safetyDesc}>
              We never see your bank login. Access is read-only and you can
              revoke it at any time.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StepDot({ active, label }: { active: boolean; label: string }) {
  return (
    <View style={styles.stepBlock}>
      <View
        style={[
          styles.stepDot,
          active && { backgroundColor: theme.colors.primary },
        ]}
      >
        {active ? <Ionicons name="checkmark" size={12} color="#FFF" /> : null}
      </View>
      <Text
        style={[
          styles.stepLabel,
          active && { color: theme.colors.primary, fontWeight: "700" },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

function StepLine({ active }: { active: boolean }) {
  return (
    <View
      style={[
        styles.stepLine,
        active && { backgroundColor: theme.colors.primary },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
  scroll: { padding: 20, paddingBottom: 40 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    ...theme.shadow.sm,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: theme.colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 6,
    marginBottom: 18,
  },
  hero: {
    borderRadius: theme.radii.lg,
    padding: 18,
    ...theme.shadow.md,
  },
  bankRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  bankLogo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  bankName: { color: "#FFF", fontSize: 18, fontWeight: "800" },
  bankTag: { color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 2 },
  bankBadge: {
    backgroundColor: "rgba(255,255,255,0.22)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radii.pill,
  },
  bankBadgeText: { color: "#FFF", fontWeight: "700", fontSize: 11 },
  permissions: {
    marginTop: 22,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    padding: 16,
    ...theme.shadow.sm,
  },
  sectionTitle: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: theme.colors.textMuted,
    fontWeight: "700",
    marginBottom: 10,
  },
  permRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  permIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  permLabel: { flex: 1, fontSize: 14, color: theme.colors.textPrimary },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    padding: 12,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.primarySoft,
  },
  stepBlock: { alignItems: "center", flex: 1 },
  stepDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stepLabel: {
    fontSize: 10,
    color: theme.colors.textMuted,
    marginTop: 4,
    textAlign: "center",
  },
  stepLine: {
    width: 24,
    height: 2,
    backgroundColor: theme.colors.border,
    marginHorizontal: -4,
    marginBottom: 14,
  },
  safety: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#E8F8F2",
    padding: 14,
    borderRadius: theme.radii.md,
    marginTop: 22,
  },
  safetyTitle: { color: theme.colors.income, fontWeight: "700", fontSize: 13 },
  safetyDesc: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
    lineHeight: 17,
  },
});
