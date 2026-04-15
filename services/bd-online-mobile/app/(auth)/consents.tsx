/**
 * Consents — list of OAuth consents grouped by tab (All / Active / Pending / Past).
 */

import React, { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import {
  getStoredUser,
  getTPP,
  listConsents,
  type Consent,
  type TPP,
} from "../../utils/api";
import { colors, radius, shadow, spacing } from "../../utils/theme";
import ConsentCard from "../../components/ConsentCard";
import Skeleton from "../../components/Skeleton";

type Tab = "all" | "active" | "pending" | "past";

const TABS: { key: Tab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "pending", label: "Pending" },
  { key: "past", label: "Past" },
];

export default function ConsentsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [consents, setConsents] = useState<Consent[]>([]);
  const [tppMap, setTppMap] = useState<Record<string, TPP>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<Tab>("all");

  const load = useCallback(async () => {
    const u = await getStoredUser();
    if (!u) return;
    try {
      const data = await listConsents(u.customer_id);
      setConsents(data);
      const tppIds = Array.from(new Set(data.map((c) => c.tpp_id)));
      const map: Record<string, TPP> = {};
      await Promise.all(
        tppIds.map(async (id) => {
          const t = await getTPP(id);
          if (t) map[id] = t;
        }),
      );
      setTppMap(map);
    } catch {
      setConsents([]);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await load();
      setLoading(false);
    })();
  }, [load]);

  const onRefresh = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const filtered = consents.filter((c) => {
    if (tab === "active") return c.status === "Authorised";
    if (tab === "pending") return c.status === "AwaitingAuthorisation";
    if (tab === "past")
      return ["Revoked", "Rejected", "Expired", "Consumed"].includes(c.status);
    return true;
  });

  const counts = {
    all: consents.length,
    active: consents.filter((c) => c.status === "Authorised").length,
    pending: consents.filter((c) => c.status === "AwaitingAuthorisation").length,
    past: consents.filter((c) =>
      ["Revoked", "Rejected", "Expired", "Consumed"].includes(c.status),
    ).length,
  };

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.md }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
        />
      }
    >
      <Text style={styles.title}>Open Banking</Text>
      <Text style={styles.subtitle}>
        Manage which third-parties can access your accounts.
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsScroll}
        contentContainerStyle={styles.tabs}
      >
        {TABS.map((t) => {
          const active = t.key === tab;
          const count = counts[t.key];
          return (
            <Pressable
              key={t.key}
              onPress={() => {
                Haptics.selectionAsync().catch(() => undefined);
                setTab(t.key);
              }}
              style={[styles.tab, active && styles.tabActive]}
            >
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                {t.label}
              </Text>
              <View style={[styles.tabBadge, active && styles.tabBadgeActive]}>
                <Text style={[styles.tabBadgeText, active && styles.tabBadgeTextActive]}>
                  {count}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {loading ? (
        <View style={{ gap: spacing.md, marginTop: spacing.md }}>
          <Skeleton height={120} borderRadius={radius.lg} />
          <Skeleton height={120} borderRadius={radius.lg} />
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="shield-outline" size={36} color={colors.textFaint} />
          <Text style={styles.emptyTitle}>No consents</Text>
          <Text style={styles.emptyText}>
            When a service requests access to your accounts, it will appear here.
          </Text>
        </View>
      ) : (
        <View style={{ gap: spacing.md, marginTop: spacing.md }}>
          {filtered.map((c) => (
            <ConsentCard
              key={c.consent_id}
              consent={c}
              tppName={tppMap[c.tpp_id]?.tpp_name}
              onPress={() => router.push(`/(auth)/consents/${c.consent_id}`)}
            />
          ))}
        </View>
      )}

      <View style={{ height: spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  tabsScroll: { marginBottom: spacing.sm },
  tabs: { gap: spacing.sm, paddingRight: spacing.lg },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: spacing.lg,
    paddingVertical: 8,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    ...shadow.card,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
  },
  tabLabelActive: { color: colors.white },
  tabBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
    backgroundColor: colors.surfaceMuted,
  },
  tabBadgeActive: { backgroundColor: "rgba(255,255,255,0.25)" },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.textMuted,
  },
  tabBadgeTextActive: { color: colors.white },
  emptyCard: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: radius.lg,
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.md,
    ...shadow.card,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: "center",
  },
});
