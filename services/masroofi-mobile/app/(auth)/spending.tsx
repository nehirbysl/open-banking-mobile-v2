/**
 * Spending screen — category donut, top merchants, monthly trend.
 */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import Card from "../../components/Card";
import CategoryLegend from "../../components/CategoryLegend";
import EmptyState from "../../components/EmptyState";
import ScreenHeader from "../../components/ScreenHeader";
import Skeleton from "../../components/Skeleton";
import SpendingDonut from "../../components/SpendingDonut";
import {
  buildMerchantSummary,
  buildMonthlyTrend,
  buildSpendingSummary,
} from "../../utils/categories";
import { formatAmount, initials } from "../../utils/format";
import type { OBTransaction } from "../../utils/api";
import { getAllTransactions } from "../../utils/api";
import { isBankConnected } from "../../utils/auth";
import { theme } from "../../utils/theme";

const CHART_W = Dimensions.get("window").width - 40;

export default function Spending() {
  const router = useRouter();
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState<OBTransaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const isConn = await isBankConnected();
    setConnected(isConn);
    if (!isConn) {
      setLoading(false);
      return;
    }
    try {
      const tx = await getAllTransactions();
      setTransactions(tx);
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

  const { thisMonth, summary, merchants, trend } = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const thisMonth = transactions.filter((t) => {
      const d = new Date(t.BookingDateTime);
      return d >= start && d <= end;
    });

    return {
      thisMonth,
      summary: buildSpendingSummary(thisMonth),
      merchants: buildMerchantSummary(thisMonth, 8),
      trend: buildMonthlyTrend(transactions, 6),
    };
  }, [transactions]);

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <ScreenHeader title="Spending" subtitle="Where your money went this month." />
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {!connected ? (
          <Card>
            <EmptyState
              icon="link-outline"
              title="No bank connected"
              description="Connect your Bank Dhofar account to see spending insights."
              ctaLabel="Connect bank"
              onCta={() => router.push("/connect")}
            />
          </Card>
        ) : loading ? (
          <View style={{ gap: 16 }}>
            <Skeleton height={260} radius={theme.radii.lg} />
            <Skeleton height={180} radius={theme.radii.lg} />
            <Skeleton height={180} radius={theme.radii.lg} />
          </View>
        ) : error ? (
          <Card>
            <Text style={{ color: theme.colors.danger }}>{error}</Text>
          </Card>
        ) : thisMonth.length === 0 ? (
          <Card>
            <EmptyState
              icon="pie-chart-outline"
              title="No spending yet"
              description="Come back once you have some transactions this month."
            />
          </Card>
        ) : (
          <View style={{ gap: 18 }}>
            <Card>
              <Text style={styles.cardTitle}>By category</Text>
              <View style={{ alignItems: "center", marginTop: 12 }}>
                <SpendingDonut data={summary} />
              </View>
              <CategoryLegend data={summary} />
            </Card>

            <Card>
              <Text style={styles.cardTitle}>Top merchants</Text>
              <View style={{ marginTop: 10 }}>
                {merchants.map((m, idx) => (
                  <View key={`${m.name}-${idx}`} style={styles.merchantRow}>
                    <View
                      style={[
                        styles.merchantAvatar,
                        { backgroundColor: m.category.color },
                      ]}
                    >
                      <Text style={styles.merchantInitials}>{initials(m.name)}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.merchantName} numberOfLines={1}>
                        {m.name}
                      </Text>
                      <Text style={styles.merchantMeta}>
                        {m.count} visit{m.count === 1 ? "" : "s"} \u00b7 {m.category.name}
                      </Text>
                    </View>
                    <Text style={styles.merchantAmount}>
                      {formatAmount(m.total)}
                    </Text>
                  </View>
                ))}
              </View>
            </Card>

            <Card>
              <Text style={styles.cardTitle}>Last 6 months</Text>
              <TrendBars data={trend} width={CHART_W - 32} />
            </Card>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function TrendBars({
  data,
  width,
}: {
  data: { label: string; total: number }[];
  width: number;
}) {
  if (!data || data.length === 0) {
    return <Text style={{ color: theme.colors.textMuted }}>No history yet</Text>;
  }
  const max = Math.max(...data.map((d) => d.total), 1);
  const barW = Math.max(18, width / data.length - 12);

  return (
    <View style={styles.trendWrap}>
      <View style={styles.trendBars}>
        {data.map((d) => {
          const pct = d.total / max;
          return (
            <View key={d.label} style={styles.trendCol}>
              <Text style={styles.trendValue}>
                {d.total > 0 ? formatAmount(d.total).split(" ")[0] : ""}
              </Text>
              <View
                style={{
                  width: barW,
                  height: 120 * pct + 4,
                  backgroundColor: theme.colors.primary,
                  borderTopLeftRadius: 6,
                  borderTopRightRadius: 6,
                  opacity: 0.15 + 0.85 * pct,
                }}
              />
              <Text style={styles.trendLabel}>{d.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
  scroll: { padding: 20, paddingBottom: 40 },
  cardTitle: { fontSize: 15, fontWeight: "700", color: theme.colors.textPrimary },
  merchantRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  merchantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  merchantInitials: { color: "#FFF", fontWeight: "800", fontSize: 13 },
  merchantName: { fontSize: 14, fontWeight: "600", color: theme.colors.textPrimary },
  merchantMeta: { fontSize: 11, color: theme.colors.textMuted, marginTop: 2 },
  merchantAmount: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    fontVariant: ["tabular-nums"],
  },
  trendWrap: { marginTop: 14 },
  trendBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 160,
  },
  trendCol: { alignItems: "center", flex: 1 },
  trendValue: {
    fontSize: 10,
    color: theme.colors.textMuted,
    marginBottom: 4,
  },
  trendLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 6,
  },
});
