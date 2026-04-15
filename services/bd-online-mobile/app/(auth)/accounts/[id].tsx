/**
 * Account detail — premium account card with full transaction history.
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
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import {
  fetchAccount,
  fetchAccountTransactions,
  getStoredUser,
  type BankAccount,
  type Transaction,
} from "../../../utils/api";
import { colors, radius, shadow, spacing } from "../../../utils/theme";
import AccountCard from "../../../components/AccountCard";
import TransactionRow from "../../../components/TransactionRow";
import Skeleton from "../../../components/Skeleton";

export default function AccountDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [account, setAccount] = useState<BankAccount | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<"all" | "credit" | "debit">("all");

  const load = useCallback(async () => {
    if (!id) return;
    const u = await getStoredUser();
    if (!u) return;
    const [a, txs] = await Promise.all([
      fetchAccount(u.customer_id, id),
      fetchAccountTransactions(id, 100),
    ]);
    setAccount(a);
    setTransactions(txs);
  }, [id]);

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

  const filtered = transactions.filter((t) =>
    filter === "all" ? true : t.direction === filter,
  );

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
      <View style={styles.headerRow}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Account</Text>
        <View style={{ width: 38 }} />
      </View>

      {loading ? (
        <Skeleton height={150} borderRadius={radius.xl} />
      ) : account ? (
        <AccountCard account={account} variant="premium" />
      ) : (
        <View style={styles.errorCard}>
          <Ionicons name="alert-circle-outline" size={28} color={colors.danger} />
          <Text style={styles.errorText}>Account not found.</Text>
        </View>
      )}

      <View style={styles.filterRow}>
        {(["all", "credit", "debit"] as const).map((f) => (
          <Pressable
            key={f}
            onPress={() => {
              Haptics.selectionAsync().catch(() => undefined);
              setFilter(f);
            }}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
          >
            <Text
              style={[
                styles.filterChipText,
                filter === f && styles.filterChipTextActive,
              ]}
            >
              {f === "all" ? "All" : f === "credit" ? "Money In" : "Money Out"}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.txCard}>
        {loading ? (
          <View style={{ gap: spacing.sm, padding: spacing.md }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} height={48} />
            ))}
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="receipt-outline" size={28} color={colors.textFaint} />
            <Text style={styles.emptyText}>No transactions to show.</Text>
          </View>
        ) : (
          filtered.map((t, idx) => (
            <View key={t.transaction_id || idx} style={{ paddingHorizontal: spacing.lg }}>
              <TransactionRow transaction={t} />
              {idx < filtered.length - 1 && <View style={styles.divider} />}
            </View>
          ))
        )}
      </View>

      <View style={{ height: spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.card,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
  },
  errorCard: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: radius.lg,
    alignItems: "center",
    gap: spacing.sm,
    ...shadow.card,
  },
  errorText: {
    color: colors.text,
    fontSize: 14,
  },
  filterRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  filterChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },
  filterChipTextActive: {
    color: colors.white,
  },
  txCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    ...shadow.card,
    overflow: "hidden",
  },
  empty: {
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.sm,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
});
