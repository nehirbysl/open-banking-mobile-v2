/**
 * Dashboard — the main landing tab once the user is signed in.
 *
 * Shows:
 *   - Hero summary (total balance, income vs spending this month)
 *   - Savings rate
 *   - Top categories with mini sparklines
 *   - Recent transactions
 */

import React, { useCallback, useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import AccountCard from "../../components/AccountCard";
import Card from "../../components/Card";
import EmptyState from "../../components/EmptyState";
import ScreenHeader from "../../components/ScreenHeader";
import Skeleton from "../../components/Skeleton";
import Sparkline from "../../components/Sparkline";
import TransactionRow from "../../components/TransactionRow";
import {
  buildCategorySparkline,
  buildSpendingSummary,
  SpendingSummary,
} from "../../utils/categories";
import { formatAmount } from "../../utils/format";
import type { OBAccount, OBBalance, OBTransaction } from "../../utils/api";
import { getAccounts, getAllBalances, getAllTransactions } from "../../utils/api";
import { getCurrentUser, isBankConnected } from "../../utils/auth";
import { theme } from "../../utils/theme";

interface DashboardData {
  accounts: OBAccount[];
  balances: OBBalance[];
  transactions: OBTransaction[];
}

function monthRange(monthsBack: number): [Date, Date] {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - monthsBack, 1);
  const end = new Date(now.getFullYear(), now.getMonth() - monthsBack + 1, 0, 23, 59, 59);
  return [start, end];
}

function inMonth(tx: OBTransaction, monthsBack: number): boolean {
  const [start, end] = monthRange(monthsBack);
  const d = new Date(tx.BookingDateTime);
  return d >= start && d <= end;
}

function computeTotalBalance(balances: OBBalance[]): { total: number; currency: string } {
  let total = 0;
  let currency = "OMR";
  for (const b of balances) {
    const amt = parseFloat(b.Amount.Amount);
    if (b.CreditDebitIndicator === "Debit") total -= amt;
    else total += amt;
    currency = b.Amount.Currency || currency;
  }
  return { total, currency };
}

export default function Dashboard() {
  const router = useRouter();
  const [connected, setConnected] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const isConn = await isBankConnected();
    setConnected(isConn);
    const u = await getCurrentUser();
    setUser(u);
    if (!isConn) {
      setData(null);
      setLoading(false);
      return;
    }
    try {
      const [accounts, balances, transactions] = await Promise.all([
        getAccounts(),
        getAllBalances(),
        getAllTransactions(),
      ]);
      setData({ accounts, balances, transactions });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <ScreenHeader
        title={`Hi ${user?.name?.split(" ")[0] || "there"}`}
        subtitle="Here\u2019s your money, at a glance."
        trailing={
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.name || "M").charAt(0).toUpperCase()}
            </Text>
          </View>
        }
      />
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        {!connected ? (
          <Card padded>
            <EmptyState
              icon="link-outline"
              title="Connect your bank"
              description="Link your Bank Dhofar account to see balances, spending and trends."
              ctaLabel="Connect Bank Dhofar"
              onCta={() => router.push("/connect")}
            />
          </Card>
        ) : (
          <DashboardBody
            data={data}
            loading={loading}
            error={error}
            onViewAll={() => router.push("/transactions")}
            onViewSpending={() => router.push("/spending")}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function DashboardBody({
  data,
  loading,
  error,
  onViewAll,
  onViewSpending,
}: {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  onViewAll: () => void;
  onViewSpending: () => void;
}) {
  if (error) {
    return (
      <Card>
        <Ionicons name="alert-circle" size={20} color={theme.colors.danger} />
        <Text style={styles.errorText}>{error}</Text>
      </Card>
    );
  }

  if (loading || !data) {
    return (
      <View style={{ gap: 16 }}>
        <Skeleton height={160} radius={theme.radii.lg} />
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Skeleton height={80} radius={theme.radii.md} style={{ flex: 1 }} />
          <Skeleton height={80} radius={theme.radii.md} style={{ flex: 1 }} />
        </View>
        <Skeleton height={140} radius={theme.radii.lg} />
        <Skeleton height={280} radius={theme.radii.lg} />
      </View>
    );
  }

  const { accounts, balances, transactions } = data;
  const { total: totalBalance, currency } = computeTotalBalance(balances);

  const thisMonthTx = transactions.filter((t) => inMonth(t, 0));
  const income = thisMonthTx
    .filter((t) => t.CreditDebitIndicator === "Credit")
    .reduce((s, t) => s + parseFloat(t.Amount.Amount), 0);
  const spending = thisMonthTx
    .filter((t) => t.CreditDebitIndicator === "Debit")
    .reduce((s, t) => s + parseFloat(t.Amount.Amount), 0);

  const savingsRate = income > 0 ? Math.max(0, Math.min(1, (income - spending) / income)) : 0;
  const spendingSummary = buildSpendingSummary(thisMonthTx).slice(0, 4);

  const recent = [...transactions]
    .sort(
      (a, b) => new Date(b.BookingDateTime).getTime() - new Date(a.BookingDateTime).getTime(),
    )
    .slice(0, 5);

  const balanceByAccount = new Map<string, OBBalance>();
  for (const b of balances) if (!balanceByAccount.has(b.AccountId)) balanceByAccount.set(b.AccountId, b);

  return (
    <View style={{ gap: 18 }}>
      {/* Hero */}
      <LinearGradient
        colors={["#6C5CE7", "#4834d4"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <Text style={styles.heroLabel}>Total Balance</Text>
        <Text style={styles.heroAmount}>{formatAmount(totalBalance, currency)}</Text>
        <View style={styles.heroRow}>
          <HeroStat
            icon="arrow-down"
            color="#55efc4"
            label="Income"
            value={`+${formatAmount(income, currency)}`}
          />
          <HeroStat
            icon="arrow-up"
            color="#ff7675"
            label="Spend"
            value={`-${formatAmount(spending, currency)}`}
          />
        </View>
        <View style={styles.blobA} />
      </LinearGradient>

      {/* Savings rate */}
      <Card>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View style={styles.savingsDial}>
            <Text style={styles.savingsDialText}>
              {Math.round(savingsRate * 100)}%
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Savings rate</Text>
            <Text style={styles.cardDesc}>
              {savingsRate >= 0.2
                ? "Great work \u2014 keeping more than 20% this month."
                : savingsRate > 0
                  ? "You\u2019re saving some. Small wins add up."
                  : "Spending equals income. Let\u2019s find a few easy wins."}
            </Text>
            <View style={styles.savingsBar}>
              <View
                style={[
                  styles.savingsBarFill,
                  { width: `${Math.round(savingsRate * 100)}%` },
                ]}
              />
            </View>
          </View>
        </View>
      </Card>

      {/* Accounts */}
      <View style={{ gap: 12 }}>
        <Text style={styles.sectionHeading}>Your accounts</Text>
        {accounts.length === 0 ? (
          <Card><Text style={styles.cardDesc}>No accounts found on this consent.</Text></Card>
        ) : (
          accounts.map((a) => (
            <AccountCard
              key={a.AccountId}
              account={a}
              balance={balanceByAccount.get(a.AccountId)}
            />
          ))
        )}
      </View>

      {/* Top categories with sparklines */}
      <Card>
        <View style={styles.rowBetween}>
          <Text style={styles.cardTitle}>Top categories</Text>
          <Text onPress={onViewSpending} style={styles.link}>
            See all
          </Text>
        </View>
        {spendingSummary.length === 0 ? (
          <Text style={styles.cardDesc}>No spending yet this month.</Text>
        ) : (
          <View style={{ gap: 12, marginTop: 8 }}>
            {spendingSummary.map((s) => (
              <CategorySparkRow
                key={s.category.id}
                summary={s}
                spark={buildCategorySparkline(thisMonthTx, s.category.id, 30)}
                currency={currency}
              />
            ))}
          </View>
        )}
      </Card>

      {/* Recent transactions */}
      <Card padded={false}>
        <View style={[styles.rowBetween, { padding: 16 }]}>
          <Text style={styles.cardTitle}>Recent activity</Text>
          <Text onPress={onViewAll} style={styles.link}>
            View all
          </Text>
        </View>
        {recent.length === 0 ? (
          <View style={{ padding: 16 }}>
            <Text style={styles.cardDesc}>No transactions yet.</Text>
          </View>
        ) : (
          <View style={{ paddingHorizontal: 12, paddingBottom: 8 }}>
            {recent.map((tx, i) => (
              <TransactionRow key={tx.TransactionId} transaction={tx} index={i} />
            ))}
          </View>
        )}
      </Card>
    </View>
  );
}

function HeroStat({
  icon,
  color,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.heroStat}>
      <View style={[styles.heroStatIcon, { backgroundColor: `${color}33` }]}>
        <Ionicons name={icon} size={14} color={color} />
      </View>
      <View>
        <Text style={styles.heroStatLabel}>{label}</Text>
        <Text style={styles.heroStatValue}>{value}</Text>
      </View>
    </View>
  );
}

function CategorySparkRow({
  summary,
  spark,
  currency,
}: {
  summary: SpendingSummary;
  spark: number[];
  currency: string;
}) {
  return (
    <View style={styles.sparkRow}>
      <View style={[styles.sparkIcon, { backgroundColor: `${summary.category.color}22` }]}>
        <Ionicons
          name={summary.category.icon as keyof typeof Ionicons.glyphMap}
          size={16}
          color={summary.category.color}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.sparkLabel}>{summary.category.name}</Text>
        <Text style={styles.sparkMeta}>
          {summary.count} transaction{summary.count === 1 ? "" : "s"} \u00b7{" "}
          {summary.percentage.toFixed(0)}%
        </Text>
      </View>
      <Sparkline data={spark} width={80} height={28} color={summary.category.color} />
      <View style={{ marginLeft: 10, alignItems: "flex-end" }}>
        <Text style={styles.sparkAmount}>{formatAmount(summary.total, currency)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
  scroll: { padding: 20, paddingBottom: 40 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontWeight: "800", fontSize: 16 },

  hero: {
    padding: 20,
    borderRadius: theme.radii.lg,
    overflow: "hidden",
    ...theme.shadow.md,
  },
  heroLabel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    fontWeight: "700",
  },
  heroAmount: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "900",
    marginTop: 6,
    fontVariant: ["tabular-nums"],
    letterSpacing: -0.5,
  },
  heroRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 16,
  },
  heroStat: { flexDirection: "row", alignItems: "center", gap: 8 },
  heroStatIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  heroStatLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  heroStatValue: {
    color: "#fff",
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  blobA: {
    position: "absolute",
    top: -60,
    right: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.1)",
  },

  cardTitle: { fontSize: 15, fontWeight: "700", color: theme.colors.textPrimary },
  cardDesc: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 6,
    lineHeight: 18,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  link: { color: theme.colors.primary, fontWeight: "700", fontSize: 13 },

  savingsDial: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  savingsDialText: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.colors.primary,
  },
  savingsBar: {
    marginTop: 8,
    height: 6,
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: 3,
    overflow: "hidden",
  },
  savingsBarFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },

  sparkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sparkIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  sparkLabel: { fontSize: 13, fontWeight: "600", color: theme.colors.textPrimary },
  sparkMeta: { fontSize: 11, color: theme.colors.textMuted, marginTop: 2 },
  sparkAmount: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    fontVariant: ["tabular-nums"],
  },

  errorText: { color: theme.colors.danger, marginTop: 6 },
});
