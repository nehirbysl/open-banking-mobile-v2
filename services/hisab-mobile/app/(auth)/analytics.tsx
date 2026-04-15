/**
 * Analytics screen — revenue trend, category donut, day-of-week cohort,
 * with a date-range picker.
 */

import React, { useMemo, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { useBankData } from "../../utils/useBankData";
import {
  daysAgo,
  endOfDay,
  formatCompact,
  formatOMR,
  getCategoryBreakdown,
  getTransactionsInRange,
  sumCredits,
  sumDebits,
} from "../../utils/analytics";
import DateRangePicker, { DateRangeKey, rangeToDays } from "../../components/DateRangePicker";
import AreaChart, { AreaPoint } from "../../components/AreaChart";
import DonutChart, { paletteFor } from "../../components/DonutChart";
import BarChart, { BarDatum } from "../../components/BarChart";
import EmptyState from "../../components/EmptyState";
import Skeleton from "../../components/Skeleton";
import { colors, radius, spacing } from "../../utils/theme";

export default function AnalyticsScreen() {
  const router = useRouter();
  const data = useBankData();
  const { width } = useWindowDimensions();
  const [range, setRange] = useState<DateRangeKey>("30d");

  const days = rangeToDays(range);

  const series = useMemo<AreaPoint[]>(() => {
    const result: AreaPoint[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const start = daysAgo(i);
      const end = endOfDay(start);
      const tx = getTransactionsInRange(data.transactions, start, end);
      const revenue = sumCredits(tx);
      const label = days > 60
        ? `${start.toLocaleString("en-US", { month: "short" })} ${start.getDate()}`
        : `${start.getDate()}/${start.getMonth() + 1}`;
      result.push({ label, value: revenue });
    }
    return result;
  }, [data.transactions, days]);

  const windowStart = daysAgo(days - 1);
  const windowEnd = endOfDay(new Date());
  const windowTx = useMemo(
    () => getTransactionsInRange(data.transactions, windowStart, windowEnd),
    [data.transactions, windowStart, windowEnd]
  );

  const revenue = sumCredits(windowTx);
  const spend = sumDebits(windowTx);
  const net = revenue - spend;

  const categorySlices = useMemo(() => {
    const raw = getCategoryBreakdown(windowTx.filter((t) => t.CreditDebitIndicator === "Debit"));
    return raw.slice(0, 6).map((s, i) => ({
      label: s.label,
      value: s.amount,
      color: paletteFor(i),
    }));
  }, [windowTx]);

  const dayOfWeek = useMemo<BarDatum[]>(() => {
    const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const buckets = names.map(() => 0);
    for (const tx of windowTx) {
      if (tx.CreditDebitIndicator !== "Credit") continue;
      const d = new Date(tx.BookingDateTime).getDay();
      buckets[d] += parseFloat(tx.Amount.Amount);
    }
    return names.map((name, idx) => ({ label: name, value: buckets[idx] }));
  }, [windowTx]);

  if (!data.connected && !data.loading) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <View style={styles.topbar}><Text style={styles.title}>Analytics</Text></View>
        <EmptyState
          icon="bar-chart-outline"
          title="Connect your bank"
          description="Revenue trends and customer cohorts unlock once your bank is linked."
          ctaLabel="Connect Bank Dhofar"
          onCtaPress={() => router.push("/(public)/connect")}
        />
      </SafeAreaView>
    );
  }

  const chartW = width - spacing.lg * 2 - spacing.md * 2;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl }}
        refreshControl={
          <RefreshControl refreshing={data.refreshing} onRefresh={data.refresh} tintColor={colors.primary} />
        }
      >
        <View style={styles.topbar}>
          <Text style={styles.title}>Analytics</Text>
          <DateRangePicker value={range} onChange={setRange} />
        </View>

        {/* Summary row */}
        <View style={styles.summaryRow}>
          <SummaryStat label="Revenue" value={formatOMR(revenue)} color={colors.success} loading={data.loading} />
          <SummaryStat label="Spend" value={formatOMR(spend)} color={colors.debit} loading={data.loading} />
          <SummaryStat
            label="Net"
            value={`${net >= 0 ? "+" : ""}${formatOMR(Math.abs(net))}`}
            color={net >= 0 ? colors.success : colors.danger}
            loading={data.loading}
          />
        </View>

        {/* Revenue trend */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Revenue trend</Text>
          <Text style={styles.cardSubtitle}>Last {days} days</Text>
          {data.loading ? (
            <Skeleton height={200} style={{ marginTop: spacing.sm }} />
          ) : (
            <View style={{ marginTop: spacing.sm }}>
              <AreaChart data={series} width={chartW} height={200} />
            </View>
          )}
        </View>

        {/* Category donut */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Spend by category</Text>
          <Text style={styles.cardSubtitle}>Last {days} days</Text>
          {data.loading ? (
            <Skeleton height={180} style={{ marginTop: spacing.sm }} />
          ) : categorySlices.length === 0 ? (
            <Text style={styles.emptyInline}>No spend in this range</Text>
          ) : (
            <View style={styles.donutRow}>
              <DonutChart
                data={categorySlices}
                size={160}
                thickness={22}
                centerLabel="TOTAL"
                centerValue={formatCompact(spend)}
              />
              <View style={styles.legend}>
                {categorySlices.map((s) => {
                  const pct = spend > 0 ? (s.value / spend) * 100 : 0;
                  return (
                    <View key={s.label} style={styles.legendRow}>
                      <View style={[styles.dot, { backgroundColor: s.color }]} />
                      <Text style={styles.legendLabel} numberOfLines={1}>
                        {s.label}
                      </Text>
                      <Text style={styles.legendValue}>{pct.toFixed(0)}%</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </View>

        {/* Day of week */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Revenue by day of week</Text>
          <Text style={styles.cardSubtitle}>Last {days} days</Text>
          {data.loading ? (
            <Skeleton height={160} style={{ marginTop: spacing.sm }} />
          ) : (
            <View style={{ marginTop: spacing.sm }}>
              <BarChart data={dayOfWeek} width={chartW} height={160} />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SummaryStat({
  label,
  value,
  color,
  loading,
}: {
  label: string;
  value: string;
  color: string;
  loading?: boolean;
}) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      {loading ? (
        <Skeleton height={16} width="70%" style={{ marginTop: 4 }} />
      ) : (
        <Text style={[styles.statValue, { color }]}>{value}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  topbar: { gap: spacing.sm },
  title: { fontSize: 28, fontWeight: "800", color: colors.text, letterSpacing: -0.3 },
  summaryRow: { flexDirection: "row", gap: spacing.sm },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  statValue: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "800",
    fontVariant: ["tabular-nums" as const],
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { fontSize: 16, fontWeight: "800", color: colors.text },
  cardSubtitle: { marginTop: 2, fontSize: 12, color: colors.textMuted, fontWeight: "600" },
  donutRow: {
    marginTop: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  legend: { flex: 1, gap: 6 },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendLabel: { flex: 1, fontSize: 13, color: colors.text, fontWeight: "600" },
  legendValue: { fontSize: 12, color: colors.textSecondary, fontWeight: "700" },
  emptyInline: {
    marginTop: spacing.md,
    textAlign: "center",
    fontSize: 13,
    color: colors.textMuted,
  },
});
