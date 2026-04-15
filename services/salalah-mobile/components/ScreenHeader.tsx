/**
 * ScreenHeader — branded top bar with back button and cart badge.
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CartBadge from './CartBadge';
import { theme } from '../utils/theme';

interface Props {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showCart?: boolean;
  transparent?: boolean;
}

export default function ScreenHeader({
  title,
  subtitle,
  showBack = true,
  showCart = true,
  transparent = false,
}: Props) {
  const router = useRouter();

  return (
    <View style={[styles.container, transparent && styles.transparent]}>
      <View style={styles.side}>
        {showBack && router.canGoBack() && (
          <Pressable
            onPress={() => router.back()}
            style={styles.iconBtn}
            hitSlop={8}
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={26} color={theme.colors.primary} />
          </Pressable>
        )}
      </View>
      <View style={styles.center}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
      <View style={styles.side}>{showCart && <CartBadge />}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: theme.colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    minHeight: 56,
  },
  transparent: { backgroundColor: 'transparent', borderBottomWidth: 0 },
  side: { width: 56, alignItems: 'center' },
  iconBtn: { padding: 4 },
  center: { flex: 1, alignItems: 'center' },
  title: {
    fontSize: theme.typography.subheading,
    fontWeight: '800',
    color: theme.colors.text,
  },
  subtitle: { fontSize: 12, color: theme.colors.textMuted, marginTop: 2 },
});
