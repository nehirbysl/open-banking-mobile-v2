/**
 * Full-width revenue area chart. Uses react-native-svg directly (rather than
 * victory) so it renders on Expo Go without extra native setup.
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Defs, LinearGradient, Line, Path, Stop, Circle } from "react-native-svg";
import { colors, radius, spacing } from "../utils/theme";
import { formatCompact } from "../utils/analytics";

export interface AreaPoint {
  label: string;
  value: number;
}

interface Props {
  data: AreaPoint[];
  width: number;
  height?: number;
  stroke?: string;
  showGrid?: boolean;
}

export default function AreaChart({
  data,
  width,
  height = 200,
  stroke = colors.primary,
  showGrid = true,
}: Props) {
  if (!data || data.length === 0) {
    return (
      <View style={[styles.empty, { width, height }]}>
        <Text style={styles.emptyText}>No data</Text>
      </View>
    );
  }

  const padL = 36;
  const padR = 12;
  const padT = 12;
  const padB = 24;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;

  const max = Math.max(...data.map((d) => d.value), 0.0001);
  const min = 0;
  const range = max - min || 1;
  const step = chartW / Math.max(data.length - 1, 1);

  const points = data.map((d, i) => {
    const x = padL + i * step;
    const y = padT + chartH - ((d.value - min) / range) * chartH;
    return { x, y, label: d.label, value: d.value };
  });

  // Smooth line
  let linePath = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cx = (prev.x + curr.x) / 2;
    linePath += ` Q ${prev.x} ${prev.y} ${cx} ${(prev.y + curr.y) / 2} T ${curr.x} ${curr.y}`;
  }

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padT + chartH} L ${points[0].x} ${padT + chartH} Z`;

  // 4 horizontal grid lines
  const gridLines: number[] = [];
  for (let i = 0; i <= 3; i++) {
    gridLines.push(padT + (chartH * i) / 3);
  }
  const yLabels = [max, (max * 2) / 3, max / 3, 0];

  const gradId = `area-grad-${Math.floor(Math.random() * 10_000_000)}`;

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={stroke} stopOpacity={0.32} />
            <Stop offset="1" stopColor={stroke} stopOpacity={0} />
          </LinearGradient>
        </Defs>

        {showGrid &&
          gridLines.map((y, i) => (
            <Line
              key={`grid-${i}`}
              x1={padL}
              y1={y}
              x2={width - padR}
              y2={y}
              stroke={colors.border}
              strokeWidth={1}
              strokeDasharray="3,5"
            />
          ))}

        <Path d={areaPath} fill={`url(#${gradId})`} />
        <Path d={linePath} fill="none" stroke={stroke} strokeWidth={2.5} strokeLinecap="round" />

        {points.map((p, i) => (
          <Circle key={`pt-${i}`} cx={p.x} cy={p.y} r={3} fill={colors.surface} stroke={stroke} strokeWidth={2} />
        ))}
      </Svg>

      {/* Y-axis labels */}
      <View style={[styles.yAxis, { height }]} pointerEvents="none">
        {yLabels.map((v, i) => (
          <Text
            key={`y-${i}`}
            style={[
              styles.yLabel,
              { top: padT + (chartH * i) / 3 - 7 },
            ]}
          >
            {formatCompact(v)}
          </Text>
        ))}
      </View>

      {/* X-axis labels */}
      <View style={[styles.xAxis, { width, height: padB, top: height - padB }]} pointerEvents="none">
        {points.map((p, i) => {
          const showEvery = Math.max(1, Math.round(points.length / 6));
          if (i % showEvery !== 0 && i !== points.length - 1) return null;
          return (
            <Text
              key={`x-${i}`}
              style={[styles.xLabel, { left: p.x - 20 }]}
            >
              {p.label}
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
  yAxis: { position: "absolute", left: 0, top: 0, width: 36 },
  yLabel: {
    position: "absolute",
    left: 4,
    fontSize: 10,
    color: colors.textMuted,
    fontVariant: ["tabular-nums" as const],
  },
  xAxis: { position: "absolute", left: 0 },
  xLabel: {
    position: "absolute",
    top: 6,
    fontSize: 10,
    color: colors.textMuted,
    width: 40,
    textAlign: "center",
    fontVariant: ["tabular-nums" as const],
  },
});
