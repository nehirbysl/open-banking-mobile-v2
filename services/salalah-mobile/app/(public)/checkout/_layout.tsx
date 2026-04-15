import React from 'react';
import { Stack } from 'expo-router';
import { theme } from '../../../utils/theme';

export default function CheckoutLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.bg },
      }}
    />
  );
}
