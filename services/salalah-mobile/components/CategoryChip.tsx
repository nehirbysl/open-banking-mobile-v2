/**
 * CategoryChip — horizontal filter pill.
 */

import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { theme } from '../utils/theme';

interface Props {
  label: string;
  emoji?: string;
  active?: boolean;
  onPress?: () => void;
}

export default function CategoryChip({ label, emoji, active, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      {emoji && <Text style={styles.emoji}>{emoji}</Text>}
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: theme.radius.round,
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    marginRight: 8,
    gap: 6,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  emoji: { fontSize: 13 },
  label: { fontSize: 13, fontWeight: '600', color: theme.colors.text },
  labelActive: { color: '#FFF' },
});
