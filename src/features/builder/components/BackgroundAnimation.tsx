import { Box, alpha } from "@mui/material";
import { landingColors } from "../../../styles/landing.styles";

/**
 * Animated background gradient effect for the builder interface
 * Provides a subtle, professional floating animation
 */
export const BackgroundAnimation: React.FC = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.5,
        background: `
          radial-gradient(circle at 20% 50%, ${alpha(landingColors.primary.main, 0.1)} 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, ${alpha(landingColors.accent.teal, 0.1)} 0%, transparent 50%),
          radial-gradient(circle at 40% 20%, ${alpha(landingColors.accent.mint, 0.1)} 0%, transparent 50%)
        `,
        animation: "float 20s ease-in-out infinite",
        "@keyframes float": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -30px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
        },
      }}
    />
  );
};
