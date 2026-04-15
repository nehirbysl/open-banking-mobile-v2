/**
 * SVG donut chart for category breakdown.
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G, Path } from "react-native-svg";
import { colors, radius, spacing } from "../utils/theme";

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

interface Props {
  data: DonutSlice[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
}

const PALETTE = [
  "#00B894",
  "#00CEC9",
  "#0984E3",
  "#6C5CE7",
  "#FDCB6E",
  "#E17055",
  "#D63031",
  "#636E72",
];

export function paletteFor(i: number): string {
  return PALETTE[i % PALETTE.length];
}

export default function DonutChart({
  data,
  size = 180,
  thickness = 24,
  centerLabel,
  centerValue,
}: Props) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - thickness / 2 - 2;

  if (total <= 0 || data.length === 0) {
    return (
      <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
        <Svg width={size} height={size}>
          <Circle cx={cx} cy={cy} r={r} stroke={colors.surfaceAlt} strokeWidth={thickness} fill="none" />
        </Svg>
        <Text style={styles.empty}>No data</Text>
      </View>
    );
  }

  let angle = -Math.PI / 2;
  const paths = data.map((slice, i) => {
    const frac = slice.value / total;
    const delta = frac * 2 * Math.PI;
    const startAngle = angle;
    const endAngle = angle + delta;
    angle = endAngle;

    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = delta > Math.PI ? 1 : 0;

    // Stroke-based arc rendering: use a Path with large-arc
    const d = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
    return { d, color: slice.color, key: `slice-${i}` };
  });

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle cx={cx} cy={cy} r={r} stroke={colors.surfaceAlt} strokeWidth={thickness} fill="none" />
        <G>
          {paths.map((p) => (
            <Path
              key={p.key}
              d={p.d}
              stroke={p.color}
              strokeWidth={thickness}
              fill="none"
              strokeLinecap="butt"
            />
          ))}
        </G>
      </Svg>
      {(centerLabel || centerValue) && (
        <View style={[styles.center, { width: size, height: size }]} pointerEvents="none">
          {centerValue && <Text style={styles.centerValue}>{centerValue}</Text>}
          {centerLabel && <Text style={styles.centerLabel}>{centerLabel}</Text>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  centerValue: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: -0.3,
    fontVariant: ["tabular-nums" as const],
  },
  centerLabel: {
    marginTop: 2,
    fontSize: 11,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  empty: {
    position: "absolute",
    width: "100%",
    textAlign: "center",
    top: "45%",
    color: colors.textMuted,
    fontSize: 12,
  },
});
