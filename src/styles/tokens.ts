/**
 * Design Tokens - Emerald Theme
 * Unified color palette from LandingDesign2
 */

const colors = {
  primary: {
    main: "#10B981",
    light: "#34D399",
    dark: "#059669",
    gradient: "linear-gradient(135deg, #059669 0%, #10B981 50%, #34D399 100%)",
    glow: "0 0 40px rgba(16, 185, 129, 0.6)",
  },
  secondary: {
    main: "#22C55E",
    light: "#4ADE80",
    dark: "#16A34A",
    gradient: "linear-gradient(135deg, #16A34A 0%, #22C55E 100%)",
  },
  accent: {
    lime: "#84CC16",
    teal: "#14B8A6",
    mint: "#6EE7B7",
    dark: "#064E3B",
    gold: "#FCD34D",
    amber: "#F59E0B",
    emerald: "#10B981",
    purple: "#9333EA",
    gradient:
      "linear-gradient(135deg, #10B981 0%, #14B8A6 25%, #84CC16 50%, #FCD34D 75%, #F59E0B 100%)",
    nature:
      "linear-gradient(90deg, #059669 0%, #10B981 20%, #14B8A6 40%, #22C55E 60%, #84CC16 80%, #A3E635 100%)",
  },
  background: {
    default: "#0A0F0D", // Very dark emerald
    paper: "#111918",
    elevated: "#1A2421",
    input: "rgba(15, 21, 20, 0.8)",
    gradient: "linear-gradient(180deg, #0A0F0D 0%, #111918 50%, #1A2421 100%)",
    mesh: "radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(132, 204, 22, 0.15) 0%, transparent 50%)",
  },
  // Text colors derived from theme
  text: {
    primary: "#FFFFFF",
    secondary: "rgba(255, 255, 255, 0.7)",
    disabled: "rgba(255, 255, 255, 0.5)",
  },
  // Semantic colors based on theme
  semantic: {
    success: "#22C55E",
    warning: "#FCD34D",
    error: "#EF4444",
    errorDark: "#DC2626",
    info: "#14B8A6",
  },
  // Field type colors (using theme colors)
  fieldTypes: {
    text: "#10B981", // primary.main
    number: "#14B8A6", // accent.teal
    boolean: "#FCD34D", // accent.gold
    object: "#22C55E", // secondary.main
    array: "#84CC16", // accent.lime
    enum: "#6EE7B7", // accent.mint
    multiselect: "#F59E0B", // derived from gold
  },
  // Neutral colors for UI elements
  neutral: {
    50: "#FAFAFA",
    100: "#F4F4F5",
    200: "#E4E4E7",
    300: "#D4D4D8",
    400: "#A1A1AA",
    500: "#71717A",
    600: "#52525B",
    700: "#3F3F46",
    800: "#27272A",
    900: "#18181B",
  },
  // Aurora effects
  aurora: {
    gradient1:
      "linear-gradient(135deg, rgba(16, 185, 129, 0.4) 0%, rgba(132, 204, 22, 0.3) 100%)",
    gradient2:
      "linear-gradient(225deg, rgba(20, 184, 166, 0.3) 0%, rgba(252, 211, 77, 0.2) 100%)",
  },
  // Additional UI colors
  white: "#FFFFFF",
  black: "#000000",
};

export { colors };

export const radius = {
  none: "0",
  xs: "0.375rem", // 6px
  sm: "0.5rem", // 8px
  md: "0.75rem", // 12px
  lg: "1rem", // 16px
  xl: "1.5rem", // 24px
  "2xl": "2rem", // 32px
  "3xl": "3rem", // 48px
  full: "9999px",
};

export const shadows = {
  xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  sm: "0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.03)",
  md: "0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.02)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.02)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.15)",

  // Theme specific shadows
  glow: "0 0 40px rgba(16, 185, 129, 0.6)",
  emeraldGlow: "0 0 30px rgba(16, 185, 129, 0.3)",
  limeGlow: "0 4px 20px rgba(132, 204, 22, 0.4)",
  tealGlow: "0 8px 24px rgba(20, 184, 166, 0.4)",
  goldGlow: "0 8px 24px rgba(252, 211, 77, 0.4)",
};

export const typography = {
  fontFamily: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"JetBrains Mono", "Fira Code", monospace',
  },
  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
    "6xl": "3.75rem", // 60px
    "7xl": "4.5rem", // 72px
  },
  fontWeight: {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  lineHeight: {
    tight: 1.1,
    snug: 1.3,
    normal: 1.5,
    relaxed: 1.6,
    loose: 2,
  },
  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },
};

export const transitions = {
  fast: "150ms ease",
  base: "250ms ease",
  slow: "350ms ease",
  slower: "500ms ease",
  smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
  bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
};
