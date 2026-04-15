/**
 * Reusable screen header — large title + optional subtitle + trailing element.
 */

import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

import { theme } from "../utils/theme";

interface Props {
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  style?: ViewStyle;
}

export default function ScreenHeader({ title, subtitle, trailing, style }: Props) {
  return (
    <View style={[styles.wrap, style]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {trailing ? <View>{trailing}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
});
