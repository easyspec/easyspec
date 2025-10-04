import React from "react";
import { Shield as ShieldIcon } from "@mui/icons-material";
import { Box } from "@mui/material";
import { landingColors } from "../../../../styles/landing.styles";
import { ICON_SIZES, ANIMATION_DURATIONS } from "../../types";

interface SwissShieldProps {
  size?: number;
  animated?: boolean;
}

const SwissShield: React.FC<SwissShieldProps> = ({
  size = ICON_SIZES.xxl,
  animated = true,
}) => {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        position: "relative",
        ...(animated && {
          animation: `pulse ${ANIMATION_DURATIONS.pulse}ms ease-in-out infinite`,
        }),
      }}
    >
      <ShieldIcon
        sx={{
          fontSize: size,
          color: landingColors.primary.main,
        }}
      />
    </Box>
  );
};

export default SwissShield;
