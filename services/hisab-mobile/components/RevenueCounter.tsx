/**
 * Animated "live" revenue counter used in the dashboard hero.
 * Smoothly counts up to the target value and then adds a gentle pulse.
 */

import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text } from "react-native";

interface Props {
  amount: number;
  currency?: string;
  style?: object;
  durationMs?: number;
}

export default function RevenueCounter({
  amount,
  currency = "OMR",
  style,
  durationMs = 1400,
}: Props) {
  const anim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const listener = anim.addListener(({ value }) => {
      setDisplay(value);
    });
    Animated.timing(anim, {
      toValue: amount,
      duration: durationMs,
      useNativeDriver: false,
    }).start();
    return () => {
      anim.removeListener(listener);
    };
  }, [amount, anim, durationMs]);

  const formatted = display.toLocaleString("en-US", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });

  return (
    <Text style={[styles.text, style]} numberOfLines={1} adjustsFontSizeToFit>
      {formatted} <Text style={styles.currency}>{currency}</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "800",
    letterSpacing: -0.5,
    fontVariant: ["tabular-nums" as const],
  },
  currency: {
    fontSize: 18,
    fontWeight: "700",
    opacity: 0.85,
  },
});
