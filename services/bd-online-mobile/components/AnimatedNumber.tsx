/**
 * AnimatedNumber — count-up animation for monetary values.
 * Uses Reanimated's withTiming for smooth interpolation.
 */

import React, { useEffect, useState } from "react";
import { Text, TextStyle } from "react-native";
import {
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
  useAnimatedReaction,
} from "react-native-reanimated";

interface AnimatedNumberProps {
  value: number;
  style?: TextStyle | TextStyle[];
  prefix?: string;
  decimals?: number;
  duration?: number;
  thousandSeparator?: boolean;
}

export default function AnimatedNumber({
  value,
  style,
  prefix = "",
  decimals = 3,
  duration = 900,
  thousandSeparator = true,
}: AnimatedNumberProps) {
  const animatedValue = useSharedValue(0);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    animatedValue.value = withTiming(value, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [value, duration, animatedValue]);

  useAnimatedReaction(
    () => animatedValue.value,
    (current) => {
      runOnJS(setDisplayValue)(current);
    },
    [],
  );

  const formatted = formatNumber(displayValue, decimals, thousandSeparator);

  return (
    <Text style={style}>
      {prefix}
      {formatted}
    </Text>
  );
}

function formatNumber(value: number, decimals: number, thousand: boolean): string {
  const fixed = value.toFixed(decimals);
  if (!thousand) return fixed;
  const [int, dec] = fixed.split(".");
  const intWithCommas = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return dec ? `${intWithCommas}.${dec}` : intWithCommas;
}
