/**
 * Dashboard screen — the hero of the app.
 *
 * - Top hero card with live revenue counter + delta vs last month
 * - KPI strip: today, MTD, txn count, avg ticket (each with a sparkline)
 * - Recent transactions (up to 10)
 */

import React, { useMemo } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { useBankData } from "../../utils/useBankData";
import {
  averageTransactionValue,
  countTransactions,
  formatOMR,
  getDailyRevenue,
  getLastMonthTransactions,
  getThisMonthTransactions,
  getTodayTransactions,
  percentageChange,
  sumCredits,
} from "../../utils/analytics";
import KpiCard from "../../components/KpiCard";
import RevenueCounter from "../../components/RevenueCounter";
import TransactionRow from "../../components/TransactionRow";
import EmptyState from "../../components/EmptyState";
import Skeleton from "../../components/Skeleton";
import { colors, radius, spacing } from "../../utils/theme";

export default function DashboardScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const data = useBankData();

  const insights = useMemo(() => computeInsights(data.transactions), [data.transactions]);

  if (!data.connected && !data.loading) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.topbar}>
            <Text style={styles.topbarTitle}>Dashboard</Text>
          </View>
          <EmptyState
            icon="link-outline"
            title="Connect your bank"
            description="Link your Bank Dhofar account to see revenue, customers and transactions in real time."
            ctaLabel="Connect Bank Dhofar"
            onCtaPress={() => router.push("/(public)/connect")}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  const cardWidth = (width - spacing.lg * 2 - spacing.sm) / 2;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={data.refreshing}
            onRefresh={data.refresh}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.topbar}>
          <View>
            <Text style={styles.greeting}>Welcome back</Text>
            <Text style={styles.topbarTitle}>Dashboard</Text>
          </View>
          <Pressable
            onPress={() => router.push("/(auth)/more")}
            style={styles.avatar}
            hitSlop={8}
          >
            <Ionicons name="person-outline" size={18} color={colors.primary} />
          </Pressable>
        </View>

        {/* Hero revenue card */}
        <View style={styles.hero}>
          <View style={styles.heroOrb1} />
          <View style={styles.heroOrb2} />

          <View style={styles.heroTopRow}>
            <View style={styles.liveDotWrap}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE · Revenue this month</Text>
            </View>
            <Text style={styles.heroAccounts}>
              {data.accounts.length} account{data.accounts.length === 1 ? "" : "s"}
            </Text>
          </View>

          {data.loading ? (
            <Skeleton height={44} width="70%" style={{ marginTop: 12 }} />
          ) : (
            <RevenueCounter amount={insights.mtdRevenue} />
          )}

          <View style={styles.heroFooter}>
            {insights.mtdDelta !== null && !data.loading ? (
              <View style={styles.deltaPill}>
                <Ionicons
                  name={insights.mtdDelta >= 0 ? "trending-up" : "trending-down"}
                  size={12}
                  color="#FFF"
                />
                <Text style={styles.deltaPillText}>
                  {Math.abs(insights.mtdDelta).toFixed(1)}% vs last month
                </Text>
              </View>
            ) : (
              <View />
            )}
            <Pressable onPress={() => router.push("/(auth)/analytics")} hitSlop={8}>
              <Text style={styles.heroLink}>View analytics →</Text>
            </Pressable>
          </View>
        </View>

        {/* KPI strip (2×2 grid) */}
        <View style={styles.kpiGrid}>
          <KpiCard
            title="Today"
            value={data.loading ? "—" : formatOMR(insights.todayRevenue)}
            sparkline={insights.todaySparkline}
            icon="sunny-outline"
            accent={colors.primary}
            loading={data.loading}
            style={{ width: cardWidth }}
          />
          <KpiCard
            title="Transactions"
            value={data.loading ? "—" : insights.mtdCount.toString()}
            sparkline={insights.countSparkline}
            icon="swap-horizontal-outline"
            accent={colors.accent}
            delta={insights.countDelta}
            loading={data.loading}
            style={{ width: cardWidth }}
          />
          <KpiCard
            title="Avg ticket"
            value={data.loading ? "—" : formatOMR(insights.avgTicket)}
            sparkline={insights.avgSparkline}
            icon="receipt-outline"
            accent="#6C5CE7"
            delta={insights.avgDelta}
            loading={data.loading}
            style={{ width: cardWidth }}
          />
          <KpiCard
            title="Today txns"
            value={data.loading ? "—" : insights.todayCount.toString()}
            sparkline={insights.countSparkline}
            icon="flash-outline"
            accent="#0984E3"
            loading={data.loading}
            style={{ width: cardWidth }}
          />
        </View>

        {/* Recent transactions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent transactions</Text>
          <Pressable onPress={() => router.push("/(auth)/transactions")} hitSlop={8}>
            <Text style={styles.sectionLink}>See all →</Text>
          </Pressable>
        </View>

        <View style={styles.listCard}>
          {data.loading ? (
            <View style={{ padding: spacing.md, gap: spacing.sm }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} height={40} />
              ))}
            </View>
          ) : insights.recent.length === 0 ? (
            <View style={styles.emptyInline}>
              <Ionicons name="sparkles-outline" size={24} color={colors.textMuted} />
              <Text style={styles.emptyInlineText}>No transactions yet</Text>
            </View>
          ) : (
            insights.recent.map((tx, idx) => (
              <View key={tx.TransactionId}>
                <TransactionRow transaction={tx} />
                {idx < insights.recent.length - 1 ? <View style={styles.divider} /> : null}
              </View>
            ))
          )}
        </View>

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function computeInsights(transactions: ReturnType<typeof useBankData>["transactions"]) {
  const mtd = getThisMonthTransactions(transactions);
  const last = getLastMonthTransactions(transactions);
  const today = getTodayTransactions(transactions);
  const daily = getDailyRevenue(transactions, 7);

  const mtdRevenue = sumCredits(mtd);
  const lastRevenue = sumCredits(last);
  const mtdDelta = lastRevenue === 0 && mtdRevenue === 0 ? null : percentageChange(mtdRevenue, lastRevenue);

  const mtdCount = countTransactions(mtd);
  const lastCount = countTransactions(last);
  const countDelta = lastCount === 0 && mtdCount === 0 ? null : percentageChange(mtdCount, lastCount);

  const avgTicket = averageTransactionValue(mtd);
  const lastAvg = averageTransactionValue(last);
  const avgDelta = lastAvg === 0 && avgTicket === 0 ? null : percentageChange(avgTicket, lastAvg);

  const todayRevenue = sumCredits(today);
  const todayCount = countTransactions(today);

  const recent = [...transactions]
    .sort((a, b) => new Date(b.BookingDateTime).getTime() - new Date(a.BookingDateTime).getTime())
    .slice(0, 10);

  return {
    mtdRevenue,
    mtdDelta,
    mtdCount,
    countDelta,
    avgTicket,
    avgDelta,
    todayRevenue,
    todayCount,
    recent,
    todaySparkline: daily.map((d) => d.revenue),
    countSparkline: daily.map((d) => d.count),
    avgSparkline: daily.map((d) => (d.count > 0 ? d.revenue / d.count : 0)),
  };
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, gap: spacing.md },
  topbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  greeting: { fontSize: 12, color: colors.textMuted, fontWeight: "600", letterSpacing: 0.3 },
  topbarTitle: { fontSize: 28, fontWeight: "800", color: colors.text, letterSpacing: -0.3 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}18`,
    alignItems: "center",
    justifyContent: "center",
  },
  hero: {
    borderRadius: radius.xl,
    padding: spacing.lg,
    backgroundColor: colors.primary,
    position: "relative",
    overflow: "hidden",
    minHeight: 170,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 4,
  },
  heroOrb1: {
    position: "absolute",
    top: -50,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  heroOrb2: {
    position: "absolute",
    bottom: -40,
    left: -40,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  liveDotWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFF",
  },
  liveText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  heroAccounts: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    fontWeight: "700",
  },
  heroFooter: {
    marginTop: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  deltaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  deltaPillText: { color: "#FFF", fontSize: 12, fontWeight: "700" },
  heroLink: { color: "#FFF", fontSize: 13, fontWeight: "700" },
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  sectionHeader: {
    marginTop: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: colors.text },
  sectionLink: { fontSize: 13, fontWeight: "700", color: colors.primary },
  listCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  divider: { height: 1, backgroundColor: colors.border, marginLeft: 68 },
  emptyInline: {
    alignItems: "center",
    gap: 8,
    paddingVertical: spacing.xl,
  },
  emptyInlineText: { fontSize: 13, color: colors.textMuted },
});
