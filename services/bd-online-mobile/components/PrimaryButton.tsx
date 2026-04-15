/**
 * PrimaryButton — Bank Dhofar branded button with haptic feedback,
 * loading state and optional left/right icons.
 */

import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import * as Haptics from "expo-haptics";
import { colors, radius, shadow, spacing } from "../utils/theme";

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "filled" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  fullWidth?: boolean;
  haptic?: boolean;
}

export default function PrimaryButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = "filled",
  size = "md",
  leftIcon,
  rightIcon,
  style,
  fullWidth,
  haptic = true,
}: PrimaryButtonProps) {
  const handlePress = () => {
    if (loading || disabled) return;
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
    }
    onPress();
  };

  const sizeStyles = SIZE_STYLES[size];
  const variantStyles = VARIANT_STYLES[variant];

  return (
    <Pressable
      onPress={handlePress}
      disabled={loading || disabled}
      style={({ pressed }) => [
        styles.base,
        sizeStyles.container,
        variantStyles.container,
        fullWidth && { alignSelf: "stretch" },
        (disabled || loading) && { opacity: 0.55 },
        pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
        style,
      ]}
    >
      <View style={styles.inner}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === "filled" || variant === "danger" ? colors.white : colors.primary}
          />
        ) : (
          <>
            {leftIcon}
            <Text style={[styles.label, sizeStyles.label, variantStyles.label]}>
              {label}
            </Text>
            {rightIcon}
          </>
        )}
      </View>
    </Pressable>
  );
}

const SIZE_STYLES = {
  sm: {
    container: { paddingVertical: 8, paddingHorizontal: spacing.lg },
    label: { fontSize: 13 },
  },
  md: {
    container: { paddingVertical: 12, paddingHorizontal: spacing.lg },
    label: { fontSize: 15 },
  },
  lg: {
    container: { paddingVertical: 16, paddingHorizontal: spacing.xl },
    label: { fontSize: 16 },
  },
};

const VARIANT_STYLES = {
  filled: {
    container: { backgroundColor: colors.primary, ...shadow.card },
    label: { color: colors.white },
  },
  outline: {
    container: {
      backgroundColor: "transparent",
      borderWidth: 1.5,
      borderColor: colors.primary,
    },
    label: { color: colors.primary },
  },
  ghost: {
    container: { backgroundColor: colors.primarySoft },
    label: { color: colors.primary },
  },
  danger: {
    container: { backgroundColor: colors.danger, ...shadow.card },
    label: { color: colors.white },
  },
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  label: {
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
