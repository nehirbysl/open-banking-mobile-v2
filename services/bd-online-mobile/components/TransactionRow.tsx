/**
 * TransactionRow — single line item in a transaction list.
 */

import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing } from "../utils/theme";
import { formatBalance, relativeTime } from "../utils/format";
import type { Transaction } from "../utils/api";

interface TransactionRowProps {
  transaction: Transaction;
  onPress?: () => void;
}

export default function TransactionRow({ transaction, onPress }: TransactionRowProps) {
  const isCredit = transaction.direction === "credit";
  const sign = isCredit ? "+" : "-";
  const amountColor = isCredit ? colors.success : colors.text;
  const iconBg = isCredit ? "#DCFCE7" : "#FEE2E2";
  const iconColor = isCredit ? colors.success : colors.danger;
  const iconName: keyof typeof Ionicons.glyphMap = isCredit
    ? "arrow-down-circle"
    : "arrow-up-circle";

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.row, pressed && onPress ? { opacity: 0.7 } : undefined]}
    >
      <View style={[styles.icon, { backgroundColor: iconBg }]}>
        <Ionicons name={iconName} size={20} color={iconColor} />
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {transaction.counterparty || transaction.description || "Transaction"}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {transaction.description ? transaction.description : transaction.reference || ""}
          {transaction.posted_at ? ` · ${relativeTime(transaction.posted_at)}` : ""}
        </Text>
      </View>
      <View style={styles.amountCol}>
        <Text style={[styles.amount, { color: amountColor }]} numberOfLines={1}>
          {sign}
          {formatBalance(Math.abs(transaction.amount), transaction.currency)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  icon: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  body: { flex: 1 },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  amountCol: { alignItems: "flex-end" },
  amount: {
    fontSize: 14,
    fontWeight: "700",
  },
});
