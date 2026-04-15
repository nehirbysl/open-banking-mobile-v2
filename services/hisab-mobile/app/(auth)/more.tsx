/**
 * More / settings screen — profile, bank connection, sign out.
 */

import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";

import { getCurrentUser, HisabUser, logout } from "../../utils/auth";
import { disconnectBank, isBankConnected } from "../../utils/consent";
import { colors, radius, spacing } from "../../utils/theme";
import { initials } from "../../utils/analytics";

export default function MoreScreen() {
  const router = useRouter();
  const [user, setUser] = useState<HisabUser | null>(null);
  const [connected, setConnected] = useState(false);

  const load = useCallback(async () => {
    const u = await getCurrentUser();
    setUser(u);
    setConnected(await isBankConnected());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onSignOut = () => {
    Alert.alert("Sign out?", "You'll need to sign in again to access your data.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(public)/welcome");
        },
      },
    ]);
  };

  const onDisconnect = () => {
    if (!user) return;
    Alert.alert(
      "Disconnect bank?",
      "Hisab will stop showing your data until you reconnect.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Disconnect",
          style: "destructive",
          onPress: async () => {
            await disconnectBank(user.email);
            setConnected(false);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl }}>
        <Text style={styles.title}>More</Text>

        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user ? initials(user.name) : "?"}
            </Text>
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.name} numberOfLines={1}>
              {user?.name || "Hisab user"}
            </Text>
            <Text style={styles.email} numberOfLines={1}>
              {user?.email}
            </Text>
          </View>
          <View style={[styles.badge, connected ? styles.badgeConnected : styles.badgeDisconnected]}>
            <View style={[styles.badgeDot, { backgroundColor: connected ? colors.success : colors.textMuted }]} />
            <Text style={[styles.badgeText, { color: connected ? colors.success : colors.textMuted }]}>
              {connected ? "Connected" : "Not connected"}
            </Text>
          </View>
        </View>

        {/* Bank section */}
        <SectionHeader label="Bank connection" />
        {connected ? (
          <Row
            icon="link"
            title="Disconnect Bank Dhofar"
            subtitle="Revoke the consent and clear cached data."
            onPress={onDisconnect}
            destructive
          />
        ) : (
          <Row
            icon="add-circle-outline"
            title="Connect Bank Dhofar"
            subtitle="Authorise read-only access to your business accounts."
            onPress={() => router.push("/(public)/connect")}
          />
        )}

        {/* App section */}
        <SectionHeader label="App" />
        <Row icon="notifications-outline" title="Notifications" subtitle="Daily revenue digest, large-transaction alerts." />
        <Row icon="shield-checkmark-outline" title="Privacy & security" subtitle="Biometric unlock, session timeout." />
        <Row icon="help-circle-outline" title="Help & support" subtitle="FAQ, contact support, report a bug." />
        <Row icon="information-circle-outline" title="About Hisab" subtitle="Version 1.0.0" />

        {/* Sign out */}
        <Pressable style={styles.signOut} onPress={onSignOut}>
          <Ionicons name="log-out-outline" size={18} color={colors.danger} />
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionHeader({ label }: { label: string }) {
  return <Text style={styles.sectionLabel}>{label}</Text>;
}

interface RowProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  destructive?: boolean;
}

function Row({ icon, title, subtitle, onPress, destructive }: RowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
    >
      <View style={[styles.rowIcon, destructive && { backgroundColor: colors.dangerBg }]}>
        <Ionicons name={icon} size={18} color={destructive ? colors.danger : colors.primary} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={[styles.rowTitle, destructive && { color: colors.danger }]}>{title}</Text>
        {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  title: { fontSize: 28, fontWeight: "800", color: colors.text, letterSpacing: -0.3 },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: `${colors.primary}18`,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 18, fontWeight: "800", color: colors.primary, letterSpacing: 0.5 },
  name: { fontSize: 16, fontWeight: "800", color: colors.text },
  email: { marginTop: 2, fontSize: 13, color: colors.textSecondary },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  badgeConnected: { backgroundColor: colors.successBg },
  badgeDisconnected: { backgroundColor: colors.surfaceAlt },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: 11, fontWeight: "800", letterSpacing: 0.3 },
  sectionLabel: {
    marginTop: spacing.sm,
    fontSize: 12,
    fontWeight: "700",
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: `${colors.primary}14`,
    alignItems: "center",
    justifyContent: "center",
  },
  rowTitle: { fontSize: 14, fontWeight: "700", color: colors.text },
  rowSubtitle: { marginTop: 2, fontSize: 12, color: colors.textSecondary },
  signOut: {
    marginTop: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    backgroundColor: colors.dangerBg,
    borderRadius: radius.md,
  },
  signOutText: { color: colors.danger, fontSize: 14, fontWeight: "800", letterSpacing: 0.3 },
});
