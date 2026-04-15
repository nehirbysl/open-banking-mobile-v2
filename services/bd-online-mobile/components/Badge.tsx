/**
 * Badge — small colored pill for statuses and tags.
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, radius } from "../utils/theme";

interface BadgeProps {
  label: string;
  color?: string;
  variant?: "filled" | "soft" | "outline";
  size?: "xs" | "sm" | "md";
}

export default function Badge({
  label,
  color = colors.primary,
  variant = "soft",
  size = "sm",
}: BadgeProps) {
  const sizeStyle = SIZE[size];
  return (
    <View
      style={[
        styles.base,
        sizeStyle.container,
        variant === "filled" && { backgroundColor: color },
        variant === "soft" && { backgroundColor: hexToRgba(color, 0.12) },
        variant === "outline" && {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: color,
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          sizeStyle.label,
          { color: variant === "filled" ? colors.white : color },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

function hexToRgba(hex: string, alpha: number): string {
  let h = hex.replace("#", "");
  if (h.length === 3) {
    h = h.split("").map((c) => c + c).join("");
  }
  const num = parseInt(h, 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const SIZE = {
  xs: {
    container: { paddingHorizontal: 6, paddingVertical: 2 },
    label: { fontSize: 10 },
  },
  sm: {
    container: { paddingHorizontal: 8, paddingVertical: 3 },
    label: { fontSize: 11 },
  },
  md: {
    container: { paddingHorizontal: 10, paddingVertical: 5 },
    label: { fontSize: 13 },
  },
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    alignSelf: "flex-start",
  },
  label: {
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
