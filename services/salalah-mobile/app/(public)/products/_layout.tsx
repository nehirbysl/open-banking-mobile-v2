import React from 'react';
import { Stack } from 'expo-router';
import { theme } from '../../../utils/theme';

export default function ProductsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.bg },
        animation: 'slide_from_right',
      }}
    />
  );
}
