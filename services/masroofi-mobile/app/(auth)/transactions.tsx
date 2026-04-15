/**
 * Searchable transaction list across all connected accounts.
 *
 * Features:
 *   - Search by merchant / description
 *   - Category filter chips
 *   - Pull to refresh
 */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import Card from "../../components/Card";
import EmptyState from "../../components/EmptyState";
import ScreenHeader from "../../components/ScreenHeader";
import Skeleton from "../../components/Skeleton";
import TransactionRow from "../../components/TransactionRow";
import {
  Category,
  CATEGORIES,
  categorizeTransaction,
} from "../../utils/categories";
import { getAllTransactions, OBTransaction } from "../../utils/api";
import { isBankConnected } from "../../utils/auth";
import { theme } from "../../utils/theme";

export default function Transactions() {
  const router = useRouter();
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState<OBTransaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const load = useCallback(async () => {
    const isConn = await isBankConnected();
    setConnected(isConn);
    if (!isConn) {
      setTransactions([]);
      setLoading(false);
      return;
    }
    setError(null);
    try {
      const tx = await getAllTransactions();
      setTransactions(tx);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load transactions");
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const byDate = [...transactions].sort(
      (a, b) => new Date(b.BookingDateTime).getTime() - new Date(a.BookingDateTime).getTime(),
    );
    return byDate.filter((tx) => {
      if (activeCategory) {
        const cat = categorizeTransaction(tx.TransactionInformation);
        if (cat.id !== activeCategory) return false;
      }
      if (!q) return true;
      const haystack = [
        tx.TransactionInformation,
        tx.MerchantDetails?.MerchantName,
        tx.Amount?.Amount,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [transactions, query, activeCategory]);

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <ScreenHeader
        title="Transactions"
        subtitle={`${transactions.length} total \u00b7 ${filtered.length} shown`}
      />

      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={theme.colors.textMuted} />
        <TextInput
          style={styles.search}
          value={query}
          onChangeText={setQuery}
          placeholder="Search merchant or description"
          placeholderTextColor={theme.colors.textMuted}
          autoCapitalize="none"
        />
        {query ? (
          <Pressable onPress={() => setQuery("")} hitSlop={10}>
            <Ionicons name="close-circle" size={18} color={theme.colors.textMuted} />
          </Pressable>
        ) : null}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsWrap}
      >
        <CategoryChip
          label="All"
          color={theme.colors.primary}
          active={activeCategory === null}
          onPress={() => setActiveCategory(null)}
        />
        {CATEGORIES.filter((c) => c.id !== "other").map((c) => (
          <CategoryChip
            key={c.id}
            label={`${c.emoji} ${c.name}`}
            color={c.color}
            active={activeCategory === c.id}
            onPress={() => setActiveCategory(c.id === activeCategory ? null : c.id)}
          />
        ))}
      </ScrollView>

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {!connected ? (
          <Card>
            <EmptyState
              icon="link-outline"
              title="No bank connected"
              description="Connect your Bank Dhofar account to see transactions."
              ctaLabel="Connect bank"
              onCta={() => router.push("/connect")}
            />
          </Card>
        ) : loading ? (
          <View style={{ gap: 8 }}>
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Skeleton key={i} height={56} radius={theme.radii.md} />
            ))}
          </View>
        ) : error ? (
          <Card>
            <Text style={{ color: theme.colors.danger }}>{error}</Text>
          </Card>
        ) : filtered.length === 0 ? (
          <Card>
            <EmptyState
              icon="search"
              title="Nothing matches"
              description={query ? "Try a different search term." : "No transactions in this category yet."}
            />
          </Card>
        ) : (
          <Card padded={false}>
            <View style={{ paddingHorizontal: 12, paddingVertical: 4 }}>
              {filtered.map((tx, i) => (
                <TransactionRow key={tx.TransactionId} transaction={tx} index={i} />
              ))}
            </View>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function CategoryChip({
  label,
  color,
  active,
  onPress,
}: {
  label: string;
  color: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        active && {
          backgroundColor: color,
          borderColor: color,
        },
      ]}
    >
      <Text
        style={[
          styles.chipLabel,
          active && { color: "#FFF" },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    paddingHorizontal: 14,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  search: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  chipsWrap: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radii.pill,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
});
