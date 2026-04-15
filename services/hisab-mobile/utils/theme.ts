/**
 * Hisab design tokens — teal "Stripe Atlas" palette for B2B analytics.
 * Used across all screens and components for consistency.
 */

export const colors = {
  // Primary teal
  primary: "#00B894",
  primaryDark: "#009379",
  primaryLight: "#55efc4",
  accent: "#00CEC9",

  // Neutrals
  bg: "#F7F9FB",
  surface: "#FFFFFF",
  surfaceAlt: "#F1F4F7",
  border: "#E6EAEF",
  borderStrong: "#D2D8DE",

  // Text
  text: "#101624",
  textSecondary: "#5B6573",
  textMuted: "#8A94A3",
  textInverse: "#FFFFFF",

  // Semantic
  success: "#00B894",
  successBg: "#E5F8F3",
  warning: "#F39C12",
  warningBg: "#FEF4E4",
  danger: "#E55353",
  dangerBg: "#FDE8E8",
  info: "#0984E3",
  infoBg: "#E4F1FC",

  // Credit / debit
  credit: "#00B894",
  debit: "#E17055",

  // Overlays
  overlay: "rgba(16, 22, 36, 0.45)",
} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 40,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 34, fontWeight: "800" as const, letterSpacing: -0.5 },
  h1: { fontSize: 26, fontWeight: "800" as const, letterSpacing: -0.3 },
  h2: { fontSize: 20, fontWeight: "700" as const },
  h3: { fontSize: 17, fontWeight: "700" as const },
  body: { fontSize: 15, fontWeight: "400" as const },
  bodyStrong: { fontSize: 15, fontWeight: "600" as const },
  small: { fontSize: 13, fontWeight: "400" as const },
  smallStrong: { fontSize: 13, fontWeight: "600" as const },
  caption: { fontSize: 11, fontWeight: "500" as const, letterSpacing: 0.4 },
} as const;

export const shadow = {
  card: {
    shadowColor: "#0B1220",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  cardHover: {
    shadowColor: "#0B1220",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 4,
  },
} as const;

/** Gradient used on the dashboard hero card. */
export const heroGradient = ["#00B894", "#00CEC9"] as const;
