/**
 * SkeletonCard — shimmer placeholder for loading states.
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { theme } from '../utils/theme';

interface Props {
  height?: number;
  style?: ViewStyle;
}

export default function SkeletonCard({ height = 220, style }: Props) {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.9, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [opacity]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.card, { height }, animStyle, style]}>
      <View style={styles.art} />
      <View style={[styles.line, { width: '85%' }]} />
      <View style={[styles.line, { width: '60%' }]} />
      <View style={[styles.line, { width: '40%' }]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.radius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  art: {
    flex: 1,
    backgroundColor: theme.colors.bgMuted,
    borderRadius: theme.radius.md,
    marginBottom: 10,
  },
  line: {
    height: 10,
    backgroundColor: theme.colors.bgMuted,
    borderRadius: 5,
    marginVertical: 4,
  },
});
