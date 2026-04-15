/**
 * Shared theme tokens for the Masroofi mobile app.
 *
 * Violet-based "premium PFM" palette inspired by Mint / Cleo.
 * Keep all colours, spacing and radii here so screens stay consistent.
 */

export const theme = {
  colors: {
    primary: "#6C5CE7",
    primaryDark: "#4834d4",
    primaryLight: "#a29bfe",
    primarySoft: "#F4F1FF",

    // Semantic
    income: "#00b894",
    spend: "#e17055",
    warn: "#fdcb6e",
    danger: "#d63031",
    info: "#0984e3",

    // Surfaces
    bg: "#F7F7FB",
    bgElevated: "#FFFFFF",
    surface: "#FFFFFF",
    surfaceMuted: "#F2F2F7",

    // Text
    textPrimary: "#1A1A2E",
    textSecondary: "#6C7293",
    textMuted: "#9CA3AF",
    textInverse: "#FFFFFF",

    // Borders
    border: "#E6E6EE",
    borderStrong: "#D0D0DE",

    // Decorative
    skeleton: "#EDEDF4",
  },
  radii: {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 20,
    xl: 28,
    pill: 999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  shadow: {
    sm: {
      shadowColor: "#1A1A2E",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 2,
    },
    md: {
      shadowColor: "#1A1A2E",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.1,
      shadowRadius: 14,
      elevation: 5,
    },
  },
} as const;

export type Theme = typeof theme;
