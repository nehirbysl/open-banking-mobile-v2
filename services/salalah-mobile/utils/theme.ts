/**
 * Salalah Souq design tokens.
 *
 * Premium Omani heritage palette — warm orange primary, earthy gold accents,
 * cream backgrounds, deep espresso text.
 */

export const theme = {
  colors: {
    primary: '#D35400',
    primaryDark: '#A04000',
    primaryLight: '#E67E22',
    gold: '#B8860B',
    goldLight: '#DAA520',

    bg: '#FFF8F0',
    bgCard: '#FFFFFF',
    bgMuted: '#FDF2E6',
    bgAccent: '#FFE8CC',

    text: '#3E2723',
    textMuted: '#6D4C41',
    textFaint: '#8D6E63',

    border: '#EADBC8',
    borderStrong: '#D7B99C',

    success: '#2E7D32',
    warning: '#EF6C00',
    danger: '#C62828',

    star: '#F9A825',

    shadow: 'rgba(71, 34, 13, 0.12)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  radius: {
    sm: 6,
    md: 12,
    lg: 18,
    xl: 24,
    round: 999,
  },
  typography: {
    title: 28,
    heading: 22,
    subheading: 18,
    body: 15,
    small: 13,
    tiny: 11,
  },
} as const;

export type Theme = typeof theme;
