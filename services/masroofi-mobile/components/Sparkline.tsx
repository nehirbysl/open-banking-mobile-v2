/**
 * Lightweight inline sparkline backed by react-native-svg.
 *
 * We avoid react-native-chart-kit here because we only need a few
 * points and want the line to follow the accent colour.
 */

import React from "react";
import { View } from "react-native";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";

interface Props {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fill?: boolean;
}

export default function Sparkline({
  data,
  width = 120,
  height = 36,
  color = "#6C5CE7",
  fill = true,
}: Props) {
  if (!data || data.length === 0) {
    return <View style={{ width, height }} />;
  }
  const values = data.map((v) => (Number.isFinite(v) ? v : 0));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const stepX = values.length > 1 ? width / (values.length - 1) : width;

  const points = values.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return { x, y };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");

  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

  const gradientId = `spark-${color.replace("#", "")}`;

  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <Stop offset="0" stopColor={color} stopOpacity={0.3} />
          <Stop offset="1" stopColor={color} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      {fill ? <Path d={areaPath} fill={`url(#${gradientId})`} /> : null}
      <Path
        d={linePath}
        stroke={color}
        strokeWidth={2}
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </Svg>
  );
}
