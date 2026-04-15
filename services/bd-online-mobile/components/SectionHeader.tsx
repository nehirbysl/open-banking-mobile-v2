/**
 * SectionHeader — title + optional action link for screen sections.
 */

import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "../utils/theme";

interface SectionHeaderProps {
  title: string;
  action?: { label: string; onPress: () => void };
}

export default function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {action && (
        <Pressable onPress={action.onPress} hitSlop={8}>
          <Text style={styles.action}>{action.label}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  action: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "600",
  },
});
