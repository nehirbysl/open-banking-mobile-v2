/**
 * Top Customers screen — ranking with avatar monograms, spend, last seen.
 */

import React, { useMemo } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { useBankData } from "../../utils/useBankData";
import { formatOMR, getTopCustomers, initials, formatDate } from "../../utils/analytics";
import EmptyState from "../../components/EmptyState";
import Skeleton from "../../components/Skeleton";
import { colors, radius, spacing } from "../../utils/theme";

const RANK_COLORS = ["#FFD700", "#C0C0C0", "#CD7F32"];

export default function CustomersScreen() {
  const router = useRouter();
  const data = useBankData();
  const customers = useMemo(() => getTopCustomers(data.transactions, 50), [data.transactions]);
  const totalSpend = customers.reduce((s, c) => s + c.totalAmount, 0);

  if (!data.connected && !data.loading) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <View style={styles.topbar}><Text style={styles.title}>Customers</Text></View>
        <EmptyState
          icon="people-outline"
          title="Connect your bank"
          description="Hisab automatically groups incoming transactions by customer."
          ctaLabel="Connect Bank Dhofar"
          onCtaPress={() => router.push("/(public)/connect")}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.topbar}>
        <Text style={styles.title}>Customers</Text>
        <Text style={styles.subtitle}>{customers.length} total · {formatOMR(totalSpend)}</Text>
      </View>

      {data.loading ? (
        <View style={{ padding: spacing.lg, gap: spacing.sm }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} height={64} radius={14} />
          ))}
        </View>
      ) : customers.length === 0 ? (
        <EmptyState
          icon="people-outline"
          title="No customers yet"
          description="We'll start ranking buyers here as soon as revenue comes in."
        />
      ) : (
        <FlatList
          data={customers}
          keyExtractor={(c, idx) => `${c.name}-${idx}`}
          renderItem={({ item, index }) => {
            const pct = totalSpend > 0 ? (item.totalAmount / totalSpend) * 100 : 0;
            const rankBg = index < 3 ? RANK_COLORS[index] : colors.surfaceAlt;
            const rankFg = index < 3 ? "#FFF" : colors.textSecondary;
            return (
              <View style={styles.row}>
                <View style={[styles.avatar, { backgroundColor: `${colors.primary}18` }]}>
                  <Text style={styles.avatarText}>{initials(item.name)}</Text>
                </View>
                <View style={styles.body}>
                  <View style={styles.topLine}>
                    <View style={[styles.rank, { backgroundColor: rankBg }]}>
                      <Text style={[styles.rankText, { color: rankFg }]}>
                        {index + 1}
                      </Text>
                    </View>
                    <Text style={styles.name} numberOfLines={1}>
                      {item.name}
                    </Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Text style={styles.meta}>
                      {item.transactionCount} txn{item.transactionCount === 1 ? "" : "s"}
                    </Text>
                    <Text style={styles.dot}>•</Text>
                    <Text style={styles.meta}>Last: {formatDate(item.lastTransaction)}</Text>
                  </View>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        { width: `${Math.min(100, Math.max(3, pct))}%` },
                      ]}
                    />
                  </View>
                </View>
                <View style={styles.right}>
                  <Text style={styles.amount}>{formatOMR(item.totalAmount)}</Text>
                  <Text style={styles.pct}>{pct.toFixed(1)}%</Text>
                </View>
              </View>
            );
          }}
          contentContainerStyle={{ padding: spacing.lg, gap: spacing.sm, paddingBottom: spacing.xxl }}
          ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
          refreshControl={
            <RefreshControl refreshing={data.refreshing} onRefresh={data.refresh} tintColor={colors.primary} />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  topbar: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: { fontSize: 28, fontWeight: "800", color: colors.text, letterSpacing: -0.3 },
  subtitle: { marginTop: 4, fontSize: 12, color: colors.textMuted, fontWeight: "600" },
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
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 14, fontWeight: "800", color: colors.primary, letterSpacing: 0.3 },
  body: { flex: 1, minWidth: 0 },
  topLine: { flexDirection: "row", alignItems: "center", gap: 6 },
  rank: {
    minWidth: 22,
    height: 18,
    paddingHorizontal: 6,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: { fontSize: 10, fontWeight: "800" },
  name: { flex: 1, fontSize: 14, fontWeight: "700", color: colors.text },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 3 },
  meta: { fontSize: 12, color: colors.textMuted },
  dot: { color: colors.textMuted, fontSize: 12 },
  barTrack: {
    marginTop: 6,
    height: 4,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 2,
    overflow: "hidden",
  },
  barFill: { height: "100%", backgroundColor: colors.primary, borderRadius: 2 },
  right: { alignItems: "flex-end", minWidth: 80 },
  amount: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text,
    fontVariant: ["tabular-nums" as const],
  },
  pct: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
});
