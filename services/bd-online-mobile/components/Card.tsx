/**
 * Card — surface container with rounded corners and shadow.
 */

import React from "react";
import { StyleSheet, View, ViewProps, ViewStyle } from "react-native";
import { colors, radius, shadow, spacing } from "../utils/theme";

interface CardProps extends ViewProps {
  padding?: keyof typeof PADDING | number;
  variant?: "default" | "outlined" | "subtle";
  style?: ViewStyle;
}

const PADDING = {
  none: 0,
  sm: spacing.sm,
  md: spacing.md,
  lg: spacing.lg,
  xl: spacing.xl,
};

export default function Card({
  padding = "lg",
  variant = "default",
  style,
  children,
  ...rest
}: CardProps) {
  const padValue = typeof padding === "number" ? padding : PADDING[padding];
  return (
    <View
      {...rest}
      style={[
        styles.base,
        variant === "default" && styles.default,
        variant === "outlined" && styles.outlined,
        variant === "subtle" && styles.subtle,
        { padding: padValue },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  default: {
    ...shadow.card,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  subtle: {
    backgroundColor: colors.surfaceMuted,
  },
});
