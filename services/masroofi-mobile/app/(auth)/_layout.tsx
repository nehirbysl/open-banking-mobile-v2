/**
 * Bottom-tab layout for authenticated screens.
 *
 * Four tabs: Dashboard, Transactions, Spending, More.
 * Animated entries + custom styling to match the violet theme.
 */

import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { theme } from "../../utils/theme";

type IconName = keyof typeof Ionicons.glyphMap;

interface TabConfig {
  name: string;
  title: string;
  icon: IconName;
  activeIcon: IconName;
}

const TABS: TabConfig[] = [
  { name: "index", title: "Dashboard", icon: "home-outline", activeIcon: "home" },
  {
    name: "transactions",
    title: "Transactions",
    icon: "list-outline",
    activeIcon: "list",
  },
  {
    name: "spending",
    title: "Spending",
    icon: "pie-chart-outline",
    activeIcon: "pie-chart",
  },
  { name: "more", title: "More", icon: "apps-outline", activeIcon: "apps" },
];

export default function AuthTabsLayout() {
  return (
    <Tabs
      screenListeners={{
        tabPress: () => {
          Haptics.selectionAsync().catch(() => {});
        },
      }}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: theme.colors.bgElevated,
          borderTopColor: theme.colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: Platform.OS === "ios" ? 84 : 64,
          paddingTop: 6,
          paddingBottom: Platform.OS === "ios" ? 26 : 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      {TABS.map((t) => (
        <Tabs.Screen
          key={t.name}
          name={t.name}
          options={{
            title: t.title,
            tabBarIcon: ({ color, focused, size }) => (
              <View style={styles.iconWrap}>
                <Ionicons
                  name={focused ? t.activeIcon : t.icon}
                  size={size ?? 22}
                  color={color}
                />
                {focused ? <View style={styles.activeDot} /> : null}
              </View>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.primary,
    marginTop: 3,
  },
});
