/**
 * More / settings tab — bank connection management, settings, sign-out.
 */

import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import Card from "../../components/Card";
import PrimaryButton from "../../components/PrimaryButton";
import ScreenHeader from "../../components/ScreenHeader";
import {
  clearBankCredentials,
  getCurrentUser,
  isBankConnected,
  logout,
  MasroofiUser,
} from "../../utils/auth";
import { theme } from "../../utils/theme";

export default function More() {
  const router = useRouter();
  const [user, setUser] = useState<MasroofiUser | null>(null);
  const [connected, setConnected] = useState(false);
  const [biometrics, setBiometrics] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const refresh = useCallback(async () => {
    setUser(await getCurrentUser());
    setConnected(await isBankConnected());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const confirmDisconnect = () => {
    Alert.alert(
      "Disconnect bank?",
      "Masroofi will stop receiving data from Bank Dhofar. You can reconnect at any time.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Disconnect",
          style: "destructive",
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(
              () => {},
            );
            await clearBankCredentials();
            await refresh();
          },
        },
      ],
    );
  };

  const confirmSignout = () => {
    Alert.alert("Sign out?", "You\u2019ll need to sign in again to view your data.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/welcome");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <ScreenHeader title="More" subtitle="Account, bank link and app settings." />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(user?.name || "M").charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{user?.name || "Masroofi user"}</Text>
              <Text style={styles.email}>{user?.email || ""}</Text>
            </View>
          </View>
        </Card>

        <Card style={{ marginTop: 14 }}>
          <Text style={styles.sectionLabel}>Bank connection</Text>
          {connected ? (
            <View style={styles.bankRow}>
              <View style={[styles.bankDot, { backgroundColor: theme.colors.income }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.bankName}>Bank Dhofar</Text>
                <Text style={styles.bankSub}>Connected via Open Banking</Text>
              </View>
              <PrimaryButton
                label="Disconnect"
                variant="ghost"
                onPress={confirmDisconnect}
                style={{ paddingHorizontal: 14 }}
              />
            </View>
          ) : (
            <View style={styles.bankRow}>
              <View style={[styles.bankDot, { backgroundColor: theme.colors.warn }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.bankName}>Not connected</Text>
                <Text style={styles.bankSub}>Link your bank to see your data.</Text>
              </View>
              <PrimaryButton
                label="Connect"
                onPress={() => router.push("/connect")}
                style={{ paddingHorizontal: 14 }}
              />
            </View>
          )}
        </Card>

        <Card style={{ marginTop: 14 }}>
          <Text style={styles.sectionLabel}>Preferences</Text>
          <SettingRow
            icon="finger-print-outline"
            title="Biometric unlock"
            desc="Protect Masroofi with Face ID / fingerprint."
            value={biometrics}
            onToggle={setBiometrics}
          />
          <SettingRow
            icon="notifications-outline"
            title="Notifications"
            desc="Get alerts on unusual spending."
            value={notifications}
            onToggle={setNotifications}
          />
        </Card>

        <Card style={{ marginTop: 14 }}>
          <LinkRow icon="shield-checkmark-outline" title="Privacy policy" />
          <LinkRow icon="document-text-outline" title="Terms of service" />
          <LinkRow icon="help-circle-outline" title="Help & support" />
          <LinkRow
            icon="information-circle-outline"
            title="About Masroofi"
            desc="Version 1.0.0"
          />
        </Card>

        <PrimaryButton
          label="Sign out"
          variant="ghost"
          iconLeft="log-out-outline"
          onPress={confirmSignout}
          style={{ marginTop: 18 }}
        />

        <Text style={styles.footer}>
          Masroofi is powered by Bank Dhofar Open Banking.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingRow({
  icon,
  title,
  desc,
  value,
  onToggle,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  desc: string;
  value: boolean;
  onToggle: (v: boolean) => void;
}) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingIcon}>
        <Ionicons name={icon} size={18} color={theme.colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDesc}>{desc}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={(v) => {
          Haptics.selectionAsync().catch(() => {});
          onToggle(v);
        }}
        trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
      />
    </View>
  );
}

function LinkRow({
  icon,
  title,
  desc,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  desc?: string;
}) {
  return (
    <Pressable
      onPress={() => {}}
      style={({ pressed }) => [
        styles.linkRow,
        pressed && { backgroundColor: theme.colors.surfaceMuted },
      ]}
    >
      <View style={styles.settingIcon}>
        <Ionicons name={icon} size={18} color={theme.colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.settingTitle}>{title}</Text>
        {desc ? <Text style={styles.settingDesc}>{desc}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
  scroll: { padding: 20, paddingBottom: 40 },
  profileRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#FFF", fontWeight: "800", fontSize: 20 },
  name: { fontSize: 17, fontWeight: "800", color: theme.colors.textPrimary },
  email: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 2 },
  sectionLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    color: theme.colors.textMuted,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 10,
  },
  bankRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  bankDot: { width: 10, height: 10, borderRadius: 5 },
  bankName: { fontSize: 14, fontWeight: "700", color: theme.colors.textPrimary },
  bankSub: { fontSize: 12, color: theme.colors.textMuted, marginTop: 2 },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  settingIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: theme.colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
  settingDesc: { fontSize: 12, color: theme.colors.textMuted, marginTop: 2 },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
    paddingHorizontal: 2,
  },
  footer: {
    textAlign: "center",
    color: theme.colors.textMuted,
    fontSize: 11,
    marginTop: 22,
  },
});
