/**
 * CartBadge — animated cart icon with item count.
 */

import React, { useEffect } from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '../utils/cart';
import { theme } from '../utils/theme';

export default function CartBadge() {
  const router = useRouter();
  const count = useCart((s) => s.lines.reduce((sum, l) => sum + l.quantity, 0));
  const bump = useSharedValue(1);

  useEffect(() => {
    if (count > 0) {
      bump.value = withSequence(
        withSpring(1.3, { damping: 8 }),
        withSpring(1, { damping: 12 }),
      );
    }
  }, [count, bump]);

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bump.value }],
  }));

  return (
    <Pressable
      onPress={() => router.push('/cart')}
      style={styles.button}
      testID="cart-badge"
      accessibilityLabel={`Cart, ${count} items`}
    >
      <Ionicons name="bag-handle" size={26} color={theme.colors.primary} />
      {count > 0 && (
        <Animated.View style={[styles.badge, badgeStyle]}>
          <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
        </Animated.View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { padding: 8 },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: '#FFF', fontSize: 11, fontWeight: '800' },
});
