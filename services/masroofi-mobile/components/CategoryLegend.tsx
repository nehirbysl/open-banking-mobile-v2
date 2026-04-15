/**
 * Colour-keyed legend for the SpendingDonut.
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";

import type { SpendingSummary } from "../utils/categories";
import { formatAmount } from "../utils/format";
import { theme } from "../utils/theme";

interface Props {
  data: SpendingSummary[];
  currency?: string;
}

export default function CategoryLegend({ data, currency = "OMR" }: Props) {
  if (!data || data.length === 0) return null;
  return (
    <View style={styles.wrap}>
      {data.map((d) => (
        <View key={d.category.id} style={styles.row}>
          <View style={[styles.dot, { backgroundColor: d.category.color }]} />
          <Text style={styles.label} numberOfLines={1}>
            {d.category.emoji} {d.category.name}
          </Text>
          <View style={styles.meta}>
            <Text style={styles.amount}>{formatAmount(d.total, currency)}</Text>
            <Text style={styles.percent}>{d.percentage.toFixed(0)}%</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 16,
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  label: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.textPrimary,
    fontWeight: "500",
  },
  meta: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    fontVariant: ["tabular-nums"],
  },
  percent: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
});
