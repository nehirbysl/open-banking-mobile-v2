/**
 * Simple vertical bar chart (used for the customer cohort / day-of-week view).
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Rect } from "react-native-svg";
import { colors, radius } from "../utils/theme";

export interface BarDatum {
  label: string;
  value: number;
}

interface Props {
  data: BarDatum[];
  width: number;
  height?: number;
  color?: string;
}

export default function BarChart({ data, width, height = 160, color = colors.primary }: Props) {
  if (!data || data.length === 0) {
    return <View style={[styles.empty, { width, height }]}><Text style={styles.emptyText}>No data</Text></View>;
  }

  const padL = 24;
  const padR = 8;
  const padT = 8;
  const padB = 28;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;
  const max = Math.max(...data.map((d) => d.value), 0.0001);
  const gap = 6;
  const barW = Math.max(6, (chartW - gap * (data.length - 1)) / data.length);

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        {data.map((d, i) => {
          const h = (d.value / max) * chartH;
          const x = padL + i * (barW + gap);
          const y = padT + (chartH - h);
          return (
            <Rect
              key={`b-${i}`}
              x={x}
              y={y}
              width={barW}
              height={Math.max(h, 2)}
              rx={4}
              fill={color}
              opacity={0.85}
            />
          );
        })}
      </Svg>
      <View style={[styles.xAxis, { width, height: padB, top: height - padB }]} pointerEvents="none">
        {data.map((d, i) => {
          const showEvery = Math.max(1, Math.round(data.length / 7));
          if (i % showEvery !== 0 && i !== data.length - 1) return null;
          const x = padL + i * (barW + gap) + barW / 2;
          return (
            <Text key={`xl-${i}`} style={[styles.xLabel, { left: x - 22 }]} numberOfLines={1}>
              {d.label}
            </Text>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
  },
  emptyText: { color: colors.textMuted, fontSize: 13 },
  xAxis: { position: "absolute", left: 0 },
  xLabel: {
    position: "absolute",
    top: 8,
    width: 44,
    textAlign: "center",
    fontSize: 10,
    color: colors.textMuted,
  },
});
