import { alpha } from "@mui/material";

// Emerald Twilight Color Palette
export const landingColors = {
  primary: {
    main: "#10B981",
    light: "#34D399",
    dark: "#059669",
    gradient: "linear-gradient(135deg, #059669 0%, #10B981 50%, #34D399 100%)",
  },
  secondary: {
    main: "#22C55E",
    light: "#4ADE80",
    gradient: "linear-gradient(135deg, #16A34A 0%, #22C55E 100%)",
  },
  accent: {
    lime: "#84CC16",
    teal: "#14B8A6",
    mint: "#6EE7B7",
    dark: "#064E3B",
    gold: "#FCD34D",
    amber: "#F59E0B",
    gradient:
      "linear-gradient(135deg, #10B981 0%, #14B8A6 25%, #84CC16 50%, #FCD34D 75%, #F59E0B 100%)",
    nature:
      "linear-gradient(90deg, #059669 0%, #10B981 20%, #14B8A6 40%, #22C55E 60%, #84CC16 80%, #A3E635 100%)",
  },
  background: {
    default: "#0A0F0D",
    paper: "#111918",
    elevated: "#1A2421",
    input: "#0F1614",
    gradient: "linear-gradient(180deg, #0A0F0D 0%, #111918 50%, #1A2421 100%)",
    mesh: "radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(132, 204, 22, 0.15) 0%, transparent 50%)",
  },
  semantic: {
    success: "#22C55E",
    warning: "#FCD34D",
    error: "#EF4444",
    errorDark: "#DC2626",
    info: "#14B8A6",
  },
  text: {
    primary: "#FFFFFF",
    secondary: "rgba(255, 255, 255, 0.7)",
    disabled: "rgba(255, 255, 255, 0.5)",
  },
};

// Animations - Using animations from animations.css
export const landingAnimations = {
  fadeInLine: `
    @keyframes fadeInLine {
      from { opacity: 0; transform: translateX(-10px) }
      to { opacity: 1; transform: translateX(0) }
    }
  `,
};

// Component Styles
export const landingStyles = {
  // Layout
  mainContainer: {
    background: landingColors.background.gradient,
    minHeight: "100vh",
    position: "relative" as const,
    overflow: "hidden",
    color: "white",
  },

  backgroundMesh: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    height: "100vh",
    background: landingColors.background.mesh,
    opacity: 0.5,
    animation: "drift 30s ease-in-out infinite",
    pointerEvents: "none" as const,
  },

  // Navigation
  navigation: {
    header: {
      position: "relative" as const,
      zIndex: 10,
      backdropFilter: "blur(20px)",
      background: alpha(landingColors.background.default, 0.8),
      borderBottom: `1px solid ${alpha(landingColors.primary.main, 0.2)}`,
    },
    logo: {
      width: 40,
      height: 40,
      borderRadius: "12px",
      background: landingColors.primary.gradient,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    navButton: {
      color: alpha("#FFFFFF", 0.7),
      textTransform: "none" as const,
      fontWeight: 500,
      padding: "6px 12px",
      "&:hover": {
        color: landingColors.primary.main,
        background: alpha(landingColors.primary.main, 0.05),
        borderRadius: "8px",
      },
    },
    signInButton: {
      borderColor: landingColors.primary.main,
      color: landingColors.primary.main,
      borderRadius: "8px",
      textTransform: "none" as const,
      fontWeight: 500,
      px: 2.5,
      py: 0.75,
      "&:hover": {
        background: alpha(landingColors.primary.main, 0.1),
        borderColor: landingColors.primary.light,
      },
    },
  },

  // Hero Section
  hero: {
    container: {
      pt: 10,
      pb: 8,
      position: "relative" as const,
      zIndex: 1,
    },
    badge: {
      width: "fit-content",
      background: alpha(landingColors.primary.main, 0.08),
      color: alpha(landingColors.primary.main, 0.8),
      border: `1px solid ${alpha(landingColors.primary.main, 0.2)}`,
      px: 1.5,
      py: 0.5,
      height: "auto",
      fontSize: "0.75rem",
      fontWeight: 500,
    },
    title: {
      fontSize: { xs: "2.75rem", md: "4rem" },
      fontWeight: 900,
      lineHeight: 1.1,
      background: landingColors.accent.gradient,
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      color: "transparent",
    },
    subtitle: {
      color: alpha("#FFFFFF", 0.7),
      fontWeight: 300,
      lineHeight: 1.6,
    },
    primaryButton: {
      background: landingColors.primary.gradient,
      borderRadius: "12px",
      textTransform: "none" as const,
      px: 4,
      py: 1.75,
      fontWeight: 600,
      fontSize: "1rem",
      lineHeight: 1.5,
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: `0 8px 24px ${alpha(landingColors.primary.main, 0.3)}`,
      },
    },
    secondaryButton: {
      color: alpha("#FFFFFF", 0.7),
      textTransform: "none" as const,
      px: 3,
      fontWeight: 600,
      "&:hover": {
        color: "white",
        background: alpha("#FFFFFF", 0.05),
      },
    },
  },

  // Code Display
  codeDisplay: {
    paper: {
      p: 3,
      background: alpha(landingColors.background.paper, 0.8),
      backdropFilter: "blur(20px)",
      border: `1px solid ${alpha(landingColors.primary.main, 0.3)}`,
      borderRadius: "24px",
      position: "relative" as const,
      overflow: "hidden",
    },
    codeBox: {
      p: 2,
      background: landingColors.background.elevated,
      borderRadius: "16px",
      fontFamily: "monospace",
      minHeight: 200,
      position: "relative" as const,
    },
    codeLine: {
      fontSize: "0.875rem",
      opacity: 0,
      animation: "fadeInLine 0.3s ease forwards",
      animationDelay: "0.1s",
    },
    cursor: {
      display: "inline-block",
      width: 10,
      height: 18,
      backgroundColor: landingColors.primary.main,
      animation: "blink 1s infinite",
    },
    validationChip: {
      background: alpha(landingColors.primary.main, 0.2),
      color: landingColors.primary.main,
      border: `1px solid ${landingColors.primary.main}`,
    },
  },

  // Feature Card
  featureCard: {
    background: alpha(landingColors.background.elevated, 0.8),
    backdropFilter: "blur(20px)",
    border: `1px solid ${alpha(landingColors.primary.main, 0.2)}`,
    borderRadius: "16px",
    height: "100%",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      border: `1px solid ${landingColors.primary.main}`,
      boxShadow: `0 20px 40px ${alpha(landingColors.primary.main, 0.2)}`,
    },
  },

  featureIcon: {
    width: 48,
    height: 48,
    background: landingColors.primary.gradient,
    mb: 2,
  },

  // Metrics
  metrics: {
    primaryCard: {
      p: 4,
      background: landingColors.primary.gradient,
      borderRadius: "24px",
      textAlign: "center" as const,
    },
    secondaryCard: {
      p: 4,
      background: alpha(landingColors.background.elevated, 0.8),
      borderRadius: "24px",
      textAlign: "center" as const,
    },
  },

  // CTA Section
  cta: {
    container: {
      background: `linear-gradient(135deg, ${alpha(landingColors.primary.main, 0.1)} 0%, ${alpha(landingColors.accent.teal, 0.1)} 100%)`,
      py: 10,
    },
    title: {
      fontWeight: 800,
      color: "white",
    },
    subtitle: {
      color: alpha("#FFFFFF", 0.7),
    },
  },

  // Footer
  footer: {
    container: {
      background: landingColors.background.paper,
      borderTop: `1px solid ${alpha(landingColors.primary.main, 0.1)}`,
      pt: 8,
      pb: 4,
      mt: 10,
    },
    logoBox: {
      width: 48,
      height: 48,
      borderRadius: "14px",
      background: landingColors.primary.gradient,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    socialButton: {
      background: alpha(landingColors.primary.main, 0.1),
      color: landingColors.primary.main,
      "&:hover": {
        background: alpha(landingColors.primary.main, 0.2),
      },
    },
    link: {
      color: alpha("#FFFFFF", 0.6),
      textDecoration: "none",
      fontSize: "0.875rem",
      transition: "color 0.2s",
      "&:hover": {
        color: landingColors.primary.main,
      },
    },
    newsletterInput: {
      p: 0.5,
      background: alpha(landingColors.background.elevated, 0.5),
      border: `1px solid ${alpha(landingColors.primary.main, 0.2)}`,
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
    },
  },
};
