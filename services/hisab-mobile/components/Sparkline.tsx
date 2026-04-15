/**
 * Tiny SVG sparkline for KPI cards. Draws a smooth line + soft area fill.
 */

import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";
import { colors } from "../utils/theme";

interface Props {
  data: number[];
  width?: number;
  height?: number;
  stroke?: string;
  fillOpacity?: number;
}

export default function Sparkline({
  data,
  width = 120,
  height = 40,
  stroke = colors.primary,
  fillOpacity = 0.18,
}: Props) {
  if (!data || data.length === 0) {
    return <View style={[styles.empty, { width, height }]} />;
  }

  const max = Math.max(...data, 0.0001);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const step = width / Math.max(data.length - 1, 1);

  const points = data.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return { x, y };
  });

  // Smooth line using simple quadratic mid-point curves
  let linePath = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cx = (prev.x + curr.x) / 2;
    linePath += ` Q ${prev.x} ${prev.y} ${cx} ${(prev.y + curr.y) / 2} T ${curr.x} ${curr.y}`;
  }

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  const gradId = `spark-grad-${Math.floor(Math.random() * 10_000_000)}`;

  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={stroke} stopOpacity={fillOpacity} />
          <Stop offset="1" stopColor={stroke} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Path d={areaPath} fill={`url(#${gradId})`} stroke="none" />
      <Path d={linePath} fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  empty: { backgroundColor: "transparent" },
});
