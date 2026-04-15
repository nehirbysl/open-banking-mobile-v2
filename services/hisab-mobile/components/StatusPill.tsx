/**
 * Small colored badge for transaction status (Booked / Pending / Rejected).
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, radius } from "../utils/theme";

interface Props {
  status: string;
  size?: "sm" | "md";
}

export default function StatusPill({ status, size = "sm" }: Props) {
  const { bg, fg, label } = mapStatus(status);
  const style = size === "md" ? styles.pillMd : styles.pillSm;
  const fontSize = size === "md" ? 12 : 10;

  return (
    <View style={[style, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: fg, fontSize }]}>{label}</Text>
    </View>
  );
}

function mapStatus(s: string): { bg: string; fg: string; label: string } {
  const v = s.toLowerCase();
  if (v === "booked" || v === "completed") {
    return { bg: colors.successBg, fg: colors.success, label: "Booked" };
  }
  if (v === "pending" || v === "info" || v === "processing") {
    return { bg: colors.warningBg, fg: colors.warning, label: "Pending" };
  }
  if (v === "rejected" || v === "failed" || v === "canceled" || v === "cancelled") {
    return { bg: colors.dangerBg, fg: colors.danger, label: "Rejected" };
  }
  return { bg: colors.surfaceAlt, fg: colors.textSecondary, label: s };
}

const styles = StyleSheet.create({
  pillSm: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
    alignSelf: "flex-start",
  },
  pillMd: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: "flex-start",
  },
  text: {
    fontWeight: "700",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
});
