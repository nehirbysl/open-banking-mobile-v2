/**
 * Confetti — lightweight reanimated confetti burst.
 *
 * Mounts, fires one animation, then stays on-screen until parent unmounts.
 * No external deps beyond react-native-reanimated.
 */

import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const COLORS = ['#D35400', '#E67E22', '#DAA520', '#2E7D32', '#F9A825', '#C62828'];

interface Piece {
  id: number;
  x: number;
  delay: number;
  colour: string;
  rotateEnd: number;
  endY: number;
  drift: number;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function Confetti({ count = 40 }: { count?: number }) {
  const pieces = useMemo<Piece[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * SCREEN_WIDTH,
        delay: Math.random() * 300,
        colour: COLORS[i % COLORS.length],
        rotateEnd: (Math.random() - 0.5) * 720,
        endY: SCREEN_HEIGHT * 0.65 + Math.random() * 120,
        drift: (Math.random() - 0.5) * 80,
      })),
    [count],
  );

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map((p) => (
        <ConfettiPiece key={p.id} piece={p} />
      ))}
    </View>
  );
}

function ConfettiPiece({ piece }: { piece: Piece }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, {
      duration: 1600,
      easing: Easing.out(Easing.quad),
    });
  }, [progress]);

  const style = useAnimatedStyle(() => {
    const y = progress.value * piece.endY;
    const x = piece.x + progress.value * piece.drift;
    const rotate = progress.value * piece.rotateEnd;
    const opacity = progress.value > 0.85 ? 1 - (progress.value - 0.85) / 0.15 : 1;
    return {
      transform: [
        { translateX: x },
        { translateY: y },
        { rotate: `${rotate}deg` },
      ],
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        styles.piece,
        { backgroundColor: piece.colour },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
    top: -20,
    left: 0,
    width: 10,
    height: 14,
    borderRadius: 2,
  },
});
