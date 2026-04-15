/**
 * Transactions screen — filterable list with status pills and date headers.
 */

import React, { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { useBankData } from "../../utils/useBankData";
import TransactionRow from "../../components/TransactionRow";
import EmptyState from "../../components/EmptyState";
import Skeleton from "../../components/Skeleton";
import { formatOMR, groupByDay } from "../../utils/analytics";
import { colors, radius, spacing } from "../../utils/theme";
import type { OBTransaction } from "../../utils/api";

type FilterKey = "all" | "credit" | "debit" | "pending";

const FILTERS: { key: FilterKey; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: "all", label: "All", icon: "apps-outline" },
  { key: "credit", label: "Income", icon: "arrow-down-outline" },
  { key: "debit", label: "Spend", icon: "arrow-up-outline" },
  { key: "pending", label: "Pending", icon: "time-outline" },
];

type ListItem =
  | { type: "header"; label: string; total: number }
  | { type: "tx"; tx: OBTransaction };

export default function TransactionsScreen() {
  const router = useRouter();
  const data = useBankData();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");

  const items: ListItem[] = useMemo(() => {
    let filtered = data.transactions;
    if (filter === "credit") filtered = filtered.filter((t) => t.CreditDebitIndicator === "Credit");
    else if (filter === "debit") filtered = filtered.filter((t) => t.CreditDebitIndicator === "Debit");
    else if (filter === "pending") filtered = filtered.filter((t) => t.Status.toLowerCase() === "pending");

    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter((t) => {
        const merchant = (t.MerchantDetails?.MerchantName || t.TransactionInformation || "").toLowerCase();
        return merchant.includes(q) || t.TransactionId.toLowerCase().includes(q);
      });
    }

    const groups = groupByDay(filtered);
    const out: ListItem[] = [];
    for (const g of groups) {
      out.push({ type: "header", label: g.dateLabel, total: g.total });
      for (const tx of g.transactions) out.push({ type: "tx", tx });
    }
    return out;
  }, [data.transactions, filter, query]);

  if (!data.connected && !data.loading) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <View style={styles.topbar}><Text style={styles.title}>Transactions</Text></View>
        <EmptyState
          icon="swap-horizontal-outline"
          title="Connect your bank"
          description="Once connected you'll see every transaction categorised and searchable here."
          ctaLabel="Connect Bank Dhofar"
          onCtaPress={() => router.push("/(public)/connect")}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.topbar}>
        <Text style={styles.title}>Transactions</Text>
        <Text style={styles.subtitle}>{data.transactions.length} total</Text>
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={16} color={colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search merchant or id"
          placeholderTextColor={colors.textMuted}
          style={styles.search}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query ? (
          <Pressable onPress={() => setQuery("")} hitSlop={8}>
            <Ionicons name="close-circle" size={16} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((f) => {
          const active = f.key === filter;
          return (
            <Pressable
              key={f.key}
              style={[styles.filter, active && styles.filterActive]}
              onPress={() => setFilter(f.key)}
            >
              <Ionicons
                name={f.icon}
                size={13}
                color={active ? "#FFF" : colors.textSecondary}
              />
              <Text style={[styles.filterLabel, active && styles.filterLabelActive]}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {data.loading ? (
        <View style={{ padding: spacing.lg, gap: spacing.sm }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} height={56} radius={12} />
          ))}
        </View>
      ) : items.length === 0 ? (
        <EmptyState
          icon="filter-outline"
          title="No transactions"
          description="Try a different filter or search term."
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item, idx) =>
            item.type === "header" ? `h-${item.label}-${idx}` : item.tx.TransactionId
          }
          renderItem={({ item }) =>
            item.type === "header" ? (
              <View style={styles.dateHeader}>
                <Text style={styles.dateLabel}>{item.label}</Text>
                <Text style={[styles.dateTotal, { color: item.total >= 0 ? colors.success : colors.debit }]}>
                  {item.total >= 0 ? "+" : ""}{formatOMR(item.total)}
                </Text>
              </View>
            ) : (
              <TransactionRow transaction={item.tx} />
            )
          }
          contentContainerStyle={{ paddingBottom: spacing.xxl }}
          refreshControl={
            <RefreshControl refreshing={data.refreshing} onRefresh={data.refresh} tintColor={colors.primary} />
          }
          ItemSeparatorComponent={() => null}
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
    paddingBottom: 4,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  title: { fontSize: 28, fontWeight: "800", color: colors.text, letterSpacing: -0.3 },
  subtitle: { fontSize: 12, color: colors.textMuted, fontWeight: "600" },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    paddingHorizontal: 12,
  },
  search: { flex: 1, paddingVertical: 10, fontSize: 14, color: colors.text },
  filterRow: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  filter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
  },
  filterActive: { backgroundColor: colors.primary },
  filterLabel: { fontSize: 12, fontWeight: "700", color: colors.textSecondary },
  filterLabelActive: { color: "#FFF" },
  dateHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.bg,
  },
  dateLabel: { fontSize: 12, fontWeight: "800", color: colors.textSecondary, letterSpacing: 0.5, textTransform: "uppercase" },
  dateTotal: {
    fontSize: 12,
    fontWeight: "700",
    fontVariant: ["tabular-nums" as const],
  },
});
