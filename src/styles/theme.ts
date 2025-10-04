import { createTheme } from "@mui/material/styles";
import { colors, typography, radius, shadows } from "./tokens";

/**
 * Emerald Theme - Dark Mode Only
 * Based on DesignProposal5 and LandingDesign2
 */
export const emeraldTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: colors.primary.main,
      light: colors.primary.light,
      dark: colors.primary.dark,
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: colors.secondary.main,
      light: colors.secondary.light,
      dark: colors.secondary.dark,
      contrastText: "#FFFFFF",
    },
    success: {
      main: colors.semantic.success,
      light: colors.secondary.light,
      dark: "#16A34A",
    },
    warning: {
      main: colors.semantic.warning,
      light: "#FDE68A",
      dark: "#F59E0B",
    },
    error: {
      main: colors.semantic.error,
      light: "#F87171",
      dark: "#DC2626",
    },
    info: {
      main: colors.semantic.info,
      light: "#2DD4BF",
      dark: "#0F766E",
    },
    background: {
      default: colors.background.default,
      paper: colors.background.paper,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
      disabled: colors.text.disabled,
    },
    divider: "rgba(16, 185, 129, 0.12)",
  },
  typography: {
    fontFamily: typography.fontFamily.sans,
    h1: {
      fontSize: typography.fontSize["7xl"],
      fontWeight: typography.fontWeight.black,
      lineHeight: typography.lineHeight.tight,
      letterSpacing: typography.letterSpacing.tight,
    },
    h2: {
      fontSize: typography.fontSize["5xl"],
      fontWeight: typography.fontWeight.extrabold,
      lineHeight: typography.lineHeight.tight,
      letterSpacing: typography.letterSpacing.tight,
    },
    h3: {
      fontSize: typography.fontSize["4xl"],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.snug,
    },
    h4: {
      fontSize: typography.fontSize["3xl"],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.snug,
    },
    h5: {
      fontSize: typography.fontSize["2xl"],
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.normal,
    },
    h6: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.normal,
    },
    body1: {
      fontSize: typography.fontSize.base,
      lineHeight: typography.lineHeight.relaxed,
    },
    body2: {
      fontSize: typography.fontSize.sm,
      lineHeight: typography.lineHeight.relaxed,
    },
    button: {
      textTransform: "none",
      fontWeight: typography.fontWeight.semibold,
    },
    caption: {
      fontSize: typography.fontSize.xs,
      lineHeight: typography.lineHeight.normal,
    },
    overline: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.bold,
      letterSpacing: typography.letterSpacing.widest,
      textTransform: "uppercase",
    },
  },
  shape: {
    borderRadius: parseInt(radius.md),
  },
  shadows: [
    "none",
    shadows.xs,
    shadows.sm,
    shadows.md,
    shadows.lg,
    shadows.xl,
    shadows["2xl"],
    shadows.glow,
    shadows.emeraldGlow,
    shadows.limeGlow,
    shadows.tealGlow,
    shadows.goldGlow,
    ...Array(13).fill(shadows.xl),
  ] as [
    "none",
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.background.default,
          backgroundImage: colors.background.gradient,
          minHeight: "100vh",
        },
        "::-webkit-scrollbar": {
          width: "8px",
          height: "8px",
        },
        "::-webkit-scrollbar-track": {
          background: "rgba(6, 78, 59, 0.3)",
          borderRadius: "4px",
        },
        "::-webkit-scrollbar-thumb": {
          background: "rgba(16, 185, 129, 0.4)",
          borderRadius: "4px",
          transition: "background 0.2s",
          "&:hover": {
            background: "rgba(16, 185, 129, 0.6)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: radius.md,
          textTransform: "none",
          fontWeight: typography.fontWeight.semibold,
          transition: "all 250ms ease",
        },
        contained: {
          background: colors.primary.gradient,
          boxShadow: shadows.emeraldGlow,
          "&:hover": {
            boxShadow: shadows.glow,
            transform: "translateY(-2px)",
          },
        },
        outlined: {
          borderWidth: "2px",
          "&:hover": {
            borderWidth: "2px",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: colors.background.paper,
        },
        elevation1: {
          boxShadow: shadows.sm,
        },
        elevation2: {
          boxShadow: shadows.md,
        },
        elevation3: {
          boxShadow: shadows.lg,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: radius.lg,
          border: `1px solid rgba(16, 185, 129, 0.1)`,
          background: colors.background.paper,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: radius.sm,
          fontWeight: typography.fontWeight.semibold,
        },
        filled: {
          background: `rgba(16, 185, 129, 0.1)`,
          color: colors.primary.main,
          border: `1px solid ${colors.primary.main}`,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "rgba(15, 21, 20, 0.8)",
            "& fieldset": {
              borderColor: "rgba(16, 185, 129, 0.2)",
            },
            "&:hover fieldset": {
              borderColor: colors.primary.main,
            },
            "&.Mui-focused fieldset": {
              borderColor: colors.primary.main,
            },
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "rgba(16, 185, 129, 0.12)",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: colors.background.elevated,
          border: `1px solid rgba(16, 185, 129, 0.2)`,
          borderRadius: radius.sm,
        },
        arrow: {
          color: colors.background.elevated,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: radius.md,
        },
        standardSuccess: {
          backgroundColor: "rgba(34, 197, 94, 0.1)",
          color: colors.semantic.success,
          border: `1px solid ${colors.semantic.success}`,
        },
        standardError: {
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          color: colors.semantic.error,
          border: `1px solid ${colors.semantic.error}`,
        },
        standardWarning: {
          backgroundColor: "rgba(245, 158, 11, 0.1)",
          color: colors.semantic.warning,
          border: `1px solid ${colors.semantic.warning}`,
        },
        standardInfo: {
          backgroundColor: "rgba(20, 184, 166, 0.1)",
          color: colors.semantic.info,
          border: `1px solid ${colors.semantic.info}`,
        },
      },
    },
  },
});

// Export a single theme (no theme switching)
export const theme = emeraldTheme;
