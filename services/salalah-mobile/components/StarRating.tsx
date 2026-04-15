/**
 * StarRating — five-star rating with half-star precision.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../utils/theme';

interface Props {
  value: number;
  max?: number;
  size?: number;
  showNumber?: boolean;
  count?: number;
}

export default function StarRating({
  value,
  max = 5,
  size = 16,
  showNumber = false,
  count,
}: Props) {
  const stars: Array<'full' | 'half' | 'empty'> = [];
  for (let i = 1; i <= max; i++) {
    if (value >= i) stars.push('full');
    else if (value >= i - 0.5) stars.push('half');
    else stars.push('empty');
  }
  return (
    <View style={styles.row}>
      {stars.map((s, i) => (
        <Ionicons
          key={i}
          name={s === 'full' ? 'star' : s === 'half' ? 'star-half' : 'star-outline'}
          size={size}
          color={theme.colors.star}
          style={{ marginRight: 1 }}
        />
      ))}
      {showNumber && (
        <Text style={[styles.number, { fontSize: size - 2 }]}>
          {value.toFixed(1)}
          {count !== undefined ? ` (${count})` : ''}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  number: { marginLeft: 6, color: theme.colors.textMuted, fontWeight: '600' },
});
