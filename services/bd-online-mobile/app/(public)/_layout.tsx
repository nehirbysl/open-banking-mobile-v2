/**
 * (public) layout — Stack for sign-in screen(s).
 */

import React from "react";
import { Stack } from "expo-router";

export default function PublicLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    />
  );
}
