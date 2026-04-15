/**
 * SVG donut chart for category spending.
 *
 * Built in-house on react-native-svg so we can keep a single chart
 * dependency (react-native-svg is already required by the sparkline).
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";

import type { SpendingSummary } from "../utils/categories";
import { formatAmount } from "../utils/format";
import { theme } from "../utils/theme";

interface Props {
  data: SpendingSummary[];
  currency?: string;
  size?: number;
  strokeWidth?: number;
}

export default function SpendingDonut({
  data,
  currency = "OMR",
  size = 200,
  strokeWidth = 24,
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const total = data.reduce((s, d) => s + d.total, 0);

  if (total === 0) {
    return (
      <View style={{ alignItems: "center", paddingVertical: 24 }}>
        <Text style={{ color: theme.colors.textMuted }}>No spending yet</Text>
      </View>
    );
  }

  let offset = 0;
  const segments = data.map((d) => {
    const length = (d.total / total) * circumference;
    const element = (
      <Circle
        key={d.category.id}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={d.category.color}
        strokeWidth={strokeWidth}
        fill="transparent"
        strokeDasharray={`${length} ${circumference}`}
        strokeDashoffset={-offset}
        strokeLinecap="butt"
      />
    );
    offset += length;
    return element;
  });

  return (
    <View style={styles.wrap}>
      <Svg width={size} height={size}>
        <G rotation={-90} originX={size / 2} originY={size / 2}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.colors.surfaceMuted}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {segments}
        </G>
      </Svg>
      <View style={[styles.center, { width: size, height: size }]} pointerEvents="none">
        <Text style={styles.label}>Total Spend</Text>
        <Text style={styles.amount}>{formatAmount(total, currency)}</Text>
        <Text style={styles.sub}>{data.length} categories</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 11,
    textTransform: "uppercase",
    color: theme.colors.textMuted,
    letterSpacing: 1,
    fontWeight: "600",
  },
  amount: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.textPrimary,
    marginTop: 2,
    fontVariant: ["tabular-nums"],
  },
  sub: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
});
