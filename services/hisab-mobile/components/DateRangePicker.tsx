/**
 * Date-range selector: segmented pills for 7d / 30d / 90d / YTD.
 */

import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "../utils/theme";

export type DateRangeKey = "7d" | "30d" | "90d" | "ytd";

interface Props {
  value: DateRangeKey;
  onChange: (next: DateRangeKey) => void;
}

const OPTIONS: { key: DateRangeKey; label: string }[] = [
  { key: "7d", label: "7D" },
  { key: "30d", label: "30D" },
  { key: "90d", label: "90D" },
  { key: "ytd", label: "YTD" },
];

export default function DateRangePicker({ value, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      {OPTIONS.map((opt) => {
        const active = opt.key === value;
        return (
          <Pressable
            key={opt.key}
            onPress={() => onChange(opt.key)}
            style={[styles.pill, active && styles.active]}
          >
            <Text style={[styles.label, active && styles.activeLabel]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function rangeToDays(key: DateRangeKey): number {
  switch (key) {
    case "7d": return 7;
    case "30d": return 30;
    case "90d": return 90;
    case "ytd": {
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 1);
      return Math.max(1, Math.floor((now.getTime() - start.getTime()) / 86_400_000));
    }
  }
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    padding: 4,
    gap: 4,
    alignSelf: "flex-start",
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  active: {
    backgroundColor: colors.surface,
    shadowColor: "#0B1220",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  activeLabel: { color: colors.primary },
});
