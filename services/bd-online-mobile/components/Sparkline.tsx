/**
 * Sparkline — small SVG line chart for monetary trends.
 * Lightweight in-house implementation (no chart library needed for one tiny series).
 */

import React from "react";
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from "react-native-svg";
import { colors } from "../utils/theme";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fill?: boolean;
  strokeWidth?: number;
}

export default function Sparkline({
  data,
  width = 120,
  height = 36,
  color = colors.primary,
  fill = true,
  strokeWidth = 2,
}: SparklineProps) {
  if (!data || data.length < 2) {
    return <Svg width={width} height={height} />;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = Math.max(max - min, 0.0001);
  const stepX = width / (data.length - 1);

  const pad = strokeWidth + 1;
  const usableHeight = height - pad * 2;

  const points = data.map((v, i) => ({
    x: i * stepX,
    y: pad + (1 - (v - min) / range) * usableHeight,
  }));

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");

  const fillPath =
    `${linePath} L ${(points[points.length - 1].x).toFixed(2)} ${height} ` +
    `L 0 ${height} Z`;

  const last = points[points.length - 1];
  const gradId = `spark-grad-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <Svg width={width} height={height}>
      {fill && (
        <Defs>
          <LinearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity={0.35} />
            <Stop offset="1" stopColor={color} stopOpacity={0.0} />
          </LinearGradient>
        </Defs>
      )}
      {fill && <Path d={fillPath} fill={`url(#${gradId})`} />}
      <Path
        d={linePath}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={last.x} cy={last.y} r={strokeWidth + 1} fill={color} />
    </Svg>
  );
}
