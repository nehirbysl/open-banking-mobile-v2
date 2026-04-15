/**
 * Primary CTA button with violet gradient + haptic feedback.
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
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../utils/theme";

interface Props {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  iconLeft?: keyof typeof Ionicons.glyphMap;
  iconRight?: keyof typeof Ionicons.glyphMap;
  variant?: "primary" | "ghost" | "subtle";
  style?: ViewStyle;
}

export default function PrimaryButton({
  label,
  onPress,
  loading,
  disabled,
  iconLeft,
  iconRight,
  variant = "primary",
  style,
}: Props) {
  const handlePress = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onPress();
  };

  const body = (
    <View style={styles.inner}>
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#FFF" : theme.colors.primary} />
      ) : (
        <>
          {iconLeft ? (
            <Ionicons
              name={iconLeft}
              size={18}
              color={variant === "primary" ? "#FFF" : theme.colors.primary}
              style={{ marginRight: 8 }}
            />
          ) : null}
          <Text
            style={[
              styles.label,
              {
                color: variant === "primary" ? "#FFF" : theme.colors.primary,
              },
            ]}
          >
            {label}
          </Text>
          {iconRight ? (
            <Ionicons
              name={iconRight}
              size={18}
              color={variant === "primary" ? "#FFF" : theme.colors.primary}
              style={{ marginLeft: 8 }}
            />
          ) : null}
        </>
      )}
    </View>
  );

  if (variant === "primary") {
    return (
      <Pressable
        onPress={handlePress}
        disabled={disabled || loading}
        style={({ pressed }) => [
          styles.wrap,
          (disabled || loading) && { opacity: 0.6 },
          pressed && { transform: [{ scale: 0.98 }] },
          style,
        ]}
      >
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {body}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.wrap,
        {
          backgroundColor:
            variant === "subtle" ? theme.colors.primarySoft : "transparent",
          borderWidth: variant === "ghost" ? 1 : 0,
          borderColor: theme.colors.primary,
          paddingVertical: 14,
        },
        pressed && { transform: [{ scale: 0.98 }] },
        (disabled || loading) && { opacity: 0.6 },
        style,
      ]}
    >
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: theme.radii.md,
    overflow: "hidden",
  },
  gradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
