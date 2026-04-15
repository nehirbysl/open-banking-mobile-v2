/**
 * PrimaryButton — branded CTA with press animation.
 */

import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, ActivityIndicator, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../utils/theme';

interface Props {
  title: string;
  onPress?: () => void;
  variant?: 'solid' | 'outline' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  fullWidth?: boolean;
  style?: ViewStyle;
  testID?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function PrimaryButton({
  title,
  onPress,
  variant = 'solid',
  disabled,
  loading,
  icon,
  fullWidth,
  style,
  testID,
}: Props) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12 });
  };
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress?.();
  };

  const isDisabled = disabled || loading;
  const palette = getPalette(variant, isDisabled);

  return (
    <AnimatedPressable
      testID={testID}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      style={[
        styles.button,
        { backgroundColor: palette.bg, borderColor: palette.border },
        fullWidth && { alignSelf: 'stretch' },
        style,
        animStyle,
      ]}
    >
      <View style={styles.row}>
        {loading ? (
          <ActivityIndicator color={palette.text} size="small" />
        ) : (
          <>
            {icon && <Ionicons name={icon} size={18} color={palette.text} style={{ marginRight: 8 }} />}
            <Text style={[styles.label, { color: palette.text }]}>{title}</Text>
          </>
        )}
      </View>
    </AnimatedPressable>
  );
}

function getPalette(variant: 'solid' | 'outline' | 'ghost', disabled: boolean) {
  if (disabled) {
    return { bg: '#E0D5C7', border: '#E0D5C7', text: '#9E8578' };
  }
  if (variant === 'solid') {
    return {
      bg: theme.colors.primary,
      border: theme.colors.primary,
      text: '#FFFFFF',
    };
  }
  if (variant === 'outline') {
    return {
      bg: 'transparent',
      border: theme.colors.primary,
      text: theme.colors.primary,
    };
  }
  return { bg: 'transparent', border: 'transparent', text: theme.colors.primary };
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  label: { fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },
});
