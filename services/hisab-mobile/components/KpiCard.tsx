/**
 * A compact KPI card used across the dashboard.
 * Title + value + optional delta % + optional sparkline.
 */

import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Sparkline from "./Sparkline";
import Skeleton from "./Skeleton";
import { colors, radius, shadow, spacing } from "../utils/theme";

interface Props {
  title: string;
  value: string;
  delta?: number | null;
  deltaLabel?: string;
  sparkline?: number[];
  icon?: keyof typeof Ionicons.glyphMap;
  accent?: string;
  loading?: boolean;
  style?: ViewStyle;
}

export default function KpiCard({
  title,
  value,
  delta = null,
  deltaLabel = "vs last month",
  sparkline,
  icon,
  accent = colors.primary,
  loading,
  style,
}: Props) {
  const deltaPositive = (delta ?? 0) >= 0;

  return (
    <View style={[styles.card, style]}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {icon && (
          <View style={[styles.iconWrap, { backgroundColor: `${accent}22` }]}>
            <Ionicons name={icon} size={14} color={accent} />
          </View>
        )}
      </View>

      {loading ? (
        <Skeleton height={24} width="70%" style={{ marginTop: 4 }} />
      ) : (
        <Text style={styles.value} numberOfLines={1}>
          {value}
        </Text>
      )}

      <View style={styles.footer}>
        {delta !== null && delta !== undefined && !loading ? (
          <View style={styles.deltaRow}>
            <Ionicons
              name={deltaPositive ? "arrow-up" : "arrow-down"}
              size={11}
              color={deltaPositive ? colors.success : colors.danger}
            />
            <Text
              style={[
                styles.deltaText,
                { color: deltaPositive ? colors.success : colors.danger },
              ]}
            >
              {Math.abs(delta).toFixed(1)}%
            </Text>
            <Text style={styles.deltaLabel} numberOfLines={1}>
              {deltaLabel}
            </Text>
          </View>
        ) : (
          <View style={{ height: 14 }} />
        )}

        {sparkline && sparkline.length > 0 && !loading && (
          <Sparkline data={sparkline} width={72} height={26} stroke={accent} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
    minHeight: 110,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "600",
    letterSpacing: 0.3,
    textTransform: "uppercase",
    flex: 1,
    paddingRight: 8,
  },
  iconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    marginTop: 6,
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: -0.2,
    fontVariant: ["tabular-nums" as const],
  },
  footer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 6,
    gap: 8,
  },
  deltaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    flex: 1,
  },
  deltaText: { fontSize: 12, fontWeight: "700" },
  deltaLabel: { fontSize: 10, color: colors.textMuted, flexShrink: 1 },
});
