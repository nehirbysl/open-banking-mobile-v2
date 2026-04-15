/**
 * Layout for unauthenticated / public screens.
 * Header is hidden on all of them — each screen owns its own chrome.
 */

import React from "react";
import { Stack } from "expo-router";
import { colors } from "../../utils/theme";

export default function PublicLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    />
  );
}
