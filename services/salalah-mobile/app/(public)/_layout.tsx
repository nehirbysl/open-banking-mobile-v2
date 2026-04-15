/**
 * (public) layout — all browsing screens sit under this group.
 */

import React from 'react';
import { Stack } from 'expo-router';
import { theme } from '../../utils/theme';

export default function PublicLayout() {
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
