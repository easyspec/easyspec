import React from "react";
import { Box, Container, Typography, Stack, Paper, alpha } from "@mui/material";
import {
  Build as BuildIcon,
  Link as LinkIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { landingColors } from "../../../styles/landing.styles";
import { SPACING } from "../types";

const steps = [
  {
    number: "1",
    icon: <BuildIcon />,
    title: "Build Your Form",
    description: "Define fields with types, labels, and validation rules",
  },
  {
    number: "2",
    icon: <LinkIcon />,
    title: "Share the Link",
    description: "Generate a URL with your form encoded — no signup needed",
  },
  {
    number: "3",
    icon: <DownloadIcon />,
    title: "Get Config Files",
    description: "Recipients fill the form and download valid YAML or JSON",
  },
];

const HowItWorks: React.FC = () => {
  return (
    <Container
      maxWidth="lg"
      sx={{ py: SPACING.xxl, position: "relative", zIndex: 1 }}
    >
      <Stack spacing={SPACING.lg} alignItems="center">
        <Typography
          variant="h3"
          align="center"
          sx={{
            color: "white",
            fontWeight: 700,
            mb: SPACING.md,
          }}
        >
          How It Works
        </Typography>

        <Typography
          variant="body1"
          align="center"
          sx={{
            color: alpha("#FFFFFF", 0.7),
            maxWidth: 600,
            mb: SPACING.xl,
          }}
        >
          Three simple steps to collect structured configuration data
        </Typography>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={SPACING.lg}
          sx={{ width: "100%" }}
        >
          {steps.map((step) => (
            <Paper
              key={step.number}
              sx={{
                flex: 1,
                p: SPACING.lg,
                background: alpha(landingColors.background.paper, 0.8),
                backdropFilter: "blur(20px)",
                border: `1px solid ${alpha(landingColors.primary.main, 0.2)}`,
                borderRadius: "16px",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  border: `1px solid ${alpha(landingColors.primary.main, 0.4)}`,
                  boxShadow: `0 12px 40px ${alpha(landingColors.primary.main, 0.2)}`,
                },
              }}
            >
              {/* Step Number */}
              <Box
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  fontSize: "80px",
                  fontWeight: 900,
                  color: alpha(landingColors.primary.main, 0.1),
                  lineHeight: 1,
                  pointerEvents: "none",
                }}
              >
                {step.number}
              </Box>

              {/* Icon */}
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "12px",
                  background: alpha(landingColors.primary.main, 0.15),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: SPACING.md,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <Box sx={{ color: landingColors.primary.main, fontSize: 32 }}>
                  {step.icon}
                </Box>
              </Box>

              {/* Content */}
              <Typography
                variant="h6"
                sx={{
                  color: "white",
                  fontWeight: 700,
                  mb: SPACING.sm,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {step.title}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: alpha("#FFFFFF", 0.7),
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {step.description}
              </Typography>
            </Paper>
          ))}
        </Stack>
      </Stack>
    </Container>
  );
};

export default HowItWorks;
