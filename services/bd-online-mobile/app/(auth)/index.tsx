/**
 * Home — hero balance card with animated count-up,
 * horizontal account carousel, recent transactions, quick actions.
 */

import React, { useCallback, useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import {
  fetchCustomerAccounts,
  fetchRecentTransactions,
  getStoredUser,
  type BankAccount,
  type BankUser,
  type Transaction,
} from "../../utils/api";
import { colors, gradients, radius, shadow, spacing } from "../../utils/theme";
import AnimatedNumber from "../../components/AnimatedNumber";
import AccountCard from "../../components/AccountCard";
import TransactionRow from "../../components/TransactionRow";
import SectionHeader from "../../components/SectionHeader";
import Skeleton from "../../components/Skeleton";
import Sparkline from "../../components/Sparkline";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [user, setUser] = useState<BankUser | null>(null);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [recent, setRecent] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const u = await getStoredUser();
    if (!u) return;
    setUser(u);
    const [accts, txs] = await Promise.all([
      fetchCustomerAccounts(u.customer_id),
      fetchRecentTransactions(u.customer_id, 6),
    ]);
    setAccounts(accts);
    setRecent(txs);
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

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
  const firstName = user?.first_name || "Customer";

  // Derive a fake (deterministic) trend so the sparkline is meaningful even
  // when the API doesn't return one. Real trends should come from the backend.
  const trend = deriveTrend(totalBalance, accounts.length || 1);

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
      {/* Greeting */}
      <View style={styles.greetRow}>
        <View style={styles.flex}>
          <Text style={styles.greetSmall}>{greeting()}</Text>
          <Text style={styles.greetName}>{firstName}</Text>
        </View>
        <View style={styles.bellWrap}>
          <Ionicons name="notifications-outline" size={22} color={colors.text} />
          <View style={styles.bellDot} />
        </View>
      </View>

      {/* Hero balance card */}
      <LinearGradient
        colors={gradients.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.heroCard, shadow.hero]}
      >
        <View style={styles.heroTopRow}>
          <Text style={styles.heroLabel}>Total Balance</Text>
          <View style={styles.heroBadge}>
            <Ionicons name="trending-up" size={12} color={colors.white} />
            <Text style={styles.heroBadgeText}>+ live</Text>
          </View>
        </View>

        {loading ? (
          <Skeleton width="60%" height={32} style={{ marginTop: 12, backgroundColor: "rgba(255,255,255,0.2)" }} />
        ) : (
          <AnimatedNumber
            value={totalBalance}
            prefix="OMR "
            decimals={3}
            duration={1100}
            style={styles.heroAmount}
          />
        )}

        <View style={styles.heroSparkRow}>
          <Sparkline data={trend} width={180} height={36} color={colors.white} fill={false} />
          <Text style={styles.heroSparkLabel}>Last 7 days</Text>
        </View>

        <View style={styles.heroActions}>
          <HeroAction
            icon="swap-horizontal"
            label="Transfer"
            onPress={() => router.push("/(auth)/transfer")}
          />
          <HeroAction
            icon="qr-code-outline"
            label="Scan"
            onPress={() => router.push("/(auth)/loan/scan")}
          />
          <HeroAction
            icon="add-circle-outline"
            label="Top Up"
            onPress={() => router.push("/(auth)/transfer")}
          />
          <HeroAction
            icon="document-text-outline"
            label="Statements"
            onPress={() => router.push("/(auth)/more")}
          />
        </View>
      </LinearGradient>

      {/* Accounts */}
      <View style={styles.section}>
        <SectionHeader
          title="Your Accounts"
          action={accounts.length > 0 ? { label: "View all", onPress: () => router.push("/(auth)/more") } : undefined}
        />
        {loading ? (
          <View style={{ gap: spacing.md }}>
            <Skeleton height={84} borderRadius={radius.lg} />
            <Skeleton height={84} borderRadius={radius.lg} />
          </View>
        ) : accounts.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="wallet-outline" size={28} color={colors.textFaint} />
            <Text style={styles.emptyText}>No accounts found.</Text>
          </View>
        ) : (
          <View style={{ gap: spacing.md }}>
            {accounts.map((a) => (
              <AccountCard
                key={a.accountId}
                account={a}
                onPress={() => router.push(`/(auth)/accounts/${a.accountId}`)}
                trend={deriveTrend(a.balance, accounts.indexOf(a) + 2)}
              />
            ))}
          </View>
        )}
      </View>

      {/* Recent transactions */}
      <View style={styles.section}>
        <SectionHeader
          title="Recent Activity"
          action={
            recent.length > 0 && accounts[0]
              ? {
                  label: "See all",
                  onPress: () => router.push(`/(auth)/accounts/${accounts[0].accountId}`),
                }
              : undefined
          }
        />
        {loading ? (
          <View style={{ gap: spacing.sm }}>
            <Skeleton height={48} />
            <Skeleton height={48} />
            <Skeleton height={48} />
          </View>
        ) : recent.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="receipt-outline" size={28} color={colors.textFaint} />
            <Text style={styles.emptyText}>No recent transactions.</Text>
          </View>
        ) : (
          <View style={styles.txCard}>
            {recent.map((t, idx) => (
              <View key={t.transaction_id || idx}>
                <TransactionRow transaction={t} />
                {idx < recent.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={{ height: spacing.xl }} />
    </ScrollView>
  );
}

function HeroAction({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      <View
        style={styles.heroActionWrap}
        onTouchEnd={() => {
          Haptics.selectionAsync().catch(() => undefined);
          onPress();
        }}
      >
        <Ionicons name={icon} size={20} color={colors.white} />
      </View>
      <Text style={styles.heroActionLabel}>{label}</Text>
    </View>
  );
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function deriveTrend(seed: number, length: number): number[] {
  // Simple deterministic pseudo-trend so the sparkline is visually rich.
  const points = 10;
  const base = Math.max(seed, 1);
  return Array.from({ length: points }, (_, i) => {
    const wave = Math.sin((i + length) * 0.7) * (base * 0.05);
    const slope = (i / (points - 1)) * (base * 0.04);
    return base * 0.95 + wave + slope;
  });
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  greetRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  flex: { flex: 1 },
  greetSmall: {
    fontSize: 13,
    color: colors.textMuted,
  },
  greetName: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: -0.3,
    marginTop: 2,
  },
  bellWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.card,
  },
  bellDot: {
    position: "absolute",
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
    borderWidth: 1,
    borderColor: colors.surface,
  },
  heroCard: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    overflow: "hidden",
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroLabel: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  heroBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  heroAmount: {
    color: colors.white,
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginTop: spacing.sm,
  },
  heroSparkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginTop: spacing.md,
  },
  heroSparkLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  heroActions: {
    flexDirection: "row",
    marginTop: spacing.lg,
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  heroActionWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  heroActionLabel: {
    color: "rgba(255,255,255,0.95)",
    fontSize: 11,
    fontWeight: "600",
  },
  section: { marginTop: spacing.xl },
  emptyCard: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: radius.lg,
    alignItems: "center",
    gap: spacing.sm,
    ...shadow.card,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  txCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    ...shadow.card,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
});
