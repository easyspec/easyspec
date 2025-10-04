import React from "react";
import { Stack, Typography } from "@mui/material";
import { Check as CheckIcon } from "@mui/icons-material";
import { alpha } from "@mui/material";
import { landingColors } from "../../../../styles/landing.styles";
import type { CheckmarkItemProps } from "../../types";
import { ICON_SIZES } from "../../types";

const CheckmarkItem: React.FC<CheckmarkItemProps> = ({ text }) => (
  <Stack direction="row" spacing={1} alignItems="center">
    <CheckIcon
      sx={{ color: landingColors.primary.main, fontSize: ICON_SIZES.md }}
    />
    <Typography variant="body2" sx={{ color: alpha("#FFFFFF", 0.7) }}>
      {text}
    </Typography>
  </Stack>
);

export default CheckmarkItem;
