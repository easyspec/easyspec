import React from "react";
import { Box, Typography } from "@mui/material";
import { Check as CheckIcon } from "@mui/icons-material";
import { alpha } from "@mui/material";
import { landingColors } from "../../../../styles/landing.styles";
import type { ChipBadgeProps } from "../../types";
import { ICON_SIZES, SPACING } from "../../types";

const ChipBadge: React.FC<ChipBadgeProps> = ({
  text,
  icon = <CheckIcon />,
}) => (
  <Box
    sx={{
      px: 1.5,
      py: 0.5,
      background: alpha(landingColors.primary.main, 0.15),
      border: `1px solid ${alpha(landingColors.primary.main, 0.3)}`,
      borderRadius: "20px",
      display: "inline-flex",
      alignItems: "center",
    }}
  >
    <Box
      sx={{
        fontSize: ICON_SIZES.sm,
        color: landingColors.primary.main,
        mr: SPACING.xs,
        display: "flex",
      }}
    >
      {icon}
    </Box>
    <Typography
      variant="caption"
      sx={{ color: alpha("#FFFFFF", 0.8), fontWeight: 500 }}
    >
      {text}
    </Typography>
  </Box>
);

export default ChipBadge;
