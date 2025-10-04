import React from "react";
import { Grid, Stack, Typography, Button, Box } from "@mui/material";
import {
  ArrowForward as ArrowIcon,
  MenuBook as DocsIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { landingStyles, landingColors } from "../../../styles/landing.styles";
import { alpha } from "@mui/material";
import { CheckmarkItem, ChipBadge } from "./common";
import { SPACING } from "../types";

const HERO_CONTENT = {
  title: {
    line1: "Turn Forms into",
    line2: "Config Files",
  },
  subtitle: (
    <>
      Non-technical teams fill simple forms.
      <br />
      You get valid YAML or JSON.
      <br />
      No more manual config editing.
    </>
  ),
  buttons: {
    primary: "Create Form",
    secondary: "View Docs",
  },
  checkmarks: ["Share form link", "Download YAML/JSON instantly"],
  privacy: {
    title: "Privacy First & Open Source",
    description:
      "Your data stays in your browser. No backend API, no tracking. Fully open source under MIT license.",
    badges: ["No Backend", "No Tracking", "Open Source"],
  },
} as const;

const Hero: React.FC = () => {
  const navigate = useNavigate();

  const handleStartBuilding = () => navigate("/builder");
  const handleViewDocs = () => navigate("/docs");

  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <Box sx={{ position: "relative" }}>
        {/* Title */}
        <Typography
          variant="h1"
          sx={{
            ...landingStyles.hero.title,
            mb: SPACING.xl,
          }}
        >
          {HERO_CONTENT.title.line1}
          <Box component="span" sx={{ display: "block", color: "white" }}>
            {HERO_CONTENT.title.line2}
          </Box>
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="h5"
          sx={{ ...landingStyles.hero.subtitle, mb: SPACING.xl }}
        >
          {HERO_CONTENT.subtitle}
        </Typography>

        {/* Action Buttons */}
        <Stack direction="row" spacing={SPACING.md} sx={{ mb: SPACING.lg }}>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowIcon />}
            onClick={handleStartBuilding}
            sx={landingStyles.hero.primaryButton}
          >
            {HERO_CONTENT.buttons.primary}
          </Button>
          <Button
            variant="text"
            size="large"
            startIcon={<DocsIcon />}
            onClick={handleViewDocs}
            sx={landingStyles.hero.secondaryButton}
          >
            {HERO_CONTENT.buttons.secondary}
          </Button>
        </Stack>

        {/* Checkmarks */}
        <Stack direction="row" spacing={SPACING.lg} sx={{ mb: SPACING.lg }}>
          {HERO_CONTENT.checkmarks.map((text) => (
            <CheckmarkItem key={text} text={text} />
          ))}
        </Stack>

        {/* Privacy Section */}
        <Box
          sx={{
            p: SPACING.lg,
            background: alpha(landingColors.primary.main, 0.08),
            border: `1px solid ${alpha(landingColors.primary.main, 0.3)}`,
            borderRadius: "16px",
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: "white", fontWeight: 700, mb: SPACING.sm }}
          >
            {HERO_CONTENT.privacy.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: alpha("#FFFFFF", 0.7), mb: SPACING.md }}
          >
            {HERO_CONTENT.privacy.description}
          </Typography>
          <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
            {HERO_CONTENT.privacy.badges.map((text) => (
              <ChipBadge key={text} text={text} />
            ))}
          </Stack>
        </Box>
      </Box>
    </Grid>
  );
};

export default Hero;
