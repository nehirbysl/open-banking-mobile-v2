/**
 * Animated shimmer Skeleton placeholder.
 *
 * Uses react-native-reanimated to drive a subtle opacity pulse so
 * loading states feel alive on both iOS and Android.
 */

import React, { useEffect } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { theme } from "../utils/theme";

interface Props {
  width?: number | string;
  height?: number | string;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

export default function Skeleton({ width = "100%", height = 16, radius = 8, style }: Props) {
  const pulse = useSharedValue(0.5);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width: width as number | `${number}%`,
          height: height as number | `${number}%`,
          backgroundColor: theme.colors.skeleton,
          borderRadius: radius,
        } as ViewStyle,
        animatedStyle,
        style,
      ]}
    >
      <View />
    </Animated.View>
  );
}
