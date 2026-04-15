/**
 * Bank Dhofar mobile theme — green palette, gradients, spacing, shadows.
 * Single source of truth for design tokens used across screens.
 */

export const colors = {
  // Bank Dhofar greens
  primary: "#4D9134",
  primaryDark: "#326323",
  primaryDarker: "#264c1b",
  primaryLight: "#79c065",
  primarySoft: "#f0f9ed",

  // Neutrals
  bg: "#F5F7FA",
  surface: "#FFFFFF",
  surfaceMuted: "#F9FAFB",
  border: "#E6E8EC",
  text: "#0F172A",
  textMuted: "#64748B",
  textFaint: "#94A3B8",

  // Semantic
  success: "#16A34A",
  warning: "#F59E0B",
  danger: "#DC2626",
  info: "#2563EB",

  // Special
  black: "#000000",
  white: "#FFFFFF",
  shadow: "rgba(15, 23, 42, 0.08)",
};

export const gradients = {
  hero: ["#4D9134", "#3f7a2b", "#326323"] as const,
  heroSoft: ["#5db44c", "#4D9134"] as const,
  card: ["#4D9134", "#3f7a2b"] as const,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
};

export const typography = {
  display: { fontSize: 32, fontWeight: "800" as const, letterSpacing: -0.5 },
  h1: { fontSize: 24, fontWeight: "700" as const, letterSpacing: -0.3 },
  h2: { fontSize: 20, fontWeight: "700" as const },
  h3: { fontSize: 17, fontWeight: "600" as const },
  body: { fontSize: 15, fontWeight: "400" as const },
  bodyStrong: { fontSize: 15, fontWeight: "600" as const },
  small: { fontSize: 13, fontWeight: "400" as const },
  caption: { fontSize: 11, fontWeight: "500" as const, letterSpacing: 0.5 },
};

export const shadow = {
  card: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  raised: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  hero: {
    shadowColor: "#326323",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 10,
  },
};
