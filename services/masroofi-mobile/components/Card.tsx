/**
 * Generic elevated surface. Wraps children in a violet-tinted shadow card.
 */

import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { theme } from "../utils/theme";

interface Props {
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  children?: React.ReactNode;
}

export default function Card({ style, padded = true, children }: Props) {
  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radii.lg,
          padding: padded ? theme.spacing.lg : 0,
          ...theme.shadow.sm,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
