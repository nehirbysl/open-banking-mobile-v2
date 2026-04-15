/**
 * Shimmering skeleton block. Uses a simple Animated opacity oscillation.
 */

import React, { useEffect, useRef } from "react";
import { Animated, DimensionValue, StyleSheet, View, ViewStyle } from "react-native";
import { colors, radius } from "../utils/theme";

interface Props {
  height?: number;
  width?: DimensionValue;
  radius?: number;
  style?: ViewStyle;
}

export default function Skeleton({ height = 14, width = "100%", radius: r = radius.sm, style }: Props) {
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.6, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <View style={[styles.wrap, style]}>
      <Animated.View
        style={[
          styles.inner,
          {
            opacity,
            height,
            width,
            borderRadius: r,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: "hidden" },
  inner: { backgroundColor: colors.surfaceAlt },
});
