/**
 * Stack for unauthenticated screens (welcome, login, signup, callback).
 */

import React from "react";
import { Stack } from "expo-router";

import { theme } from "../../utils/theme";

export default function PublicLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.bg },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="connect" />
      <Stack.Screen name="callback" />
    </Stack>
  );
}
