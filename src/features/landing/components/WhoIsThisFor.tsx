import React from "react";
import { Box, Container, Typography, Stack, Paper, alpha } from "@mui/material";
import {
  Engineering as DevOpsIcon,
  Support as SupportIcon,
  Business as ITIcon,
  Code as DevIcon,
} from "@mui/icons-material";
import { landingColors } from "../../../styles/landing.styles";
import { SPACING } from "../types";

const useCases = [
  {
    icon: <DevOpsIcon />,
    title: "DevOps Teams",
    description:
      "Collect deployment configs from developers without Slack back-and-forth",
    color: landingColors.primary.main,
  },
  {
    icon: <SupportIcon />,
    title: "Support Teams",
    description:
      "Gather structured troubleshooting info from customers in valid format",
    color: landingColors.accent.teal,
  },
  {
    icon: <ITIcon />,
    title: "IT Managers",
    description:
      "Request setup information from teams and get machine-readable output",
    color: landingColors.accent.lime,
  },
  {
    icon: <DevIcon />,
    title: "Developers",
    description:
      "Create config forms for non-technical users to fill without errors",
    color: landingColors.accent.amber,
  },
];

const WhoIsThisFor: React.FC = () => {
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
          Who Uses EasySpec
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
          Anyone who needs YAML or JSON from non-technical users
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "repeat(4, 1fr)",
            },
            gap: SPACING.lg,
            width: "100%",
          }}
        >
          {useCases.map((useCase) => (
            <Paper
              key={useCase.title}
              sx={{
                p: SPACING.lg,
                background: alpha(landingColors.background.paper, 0.8),
                backdropFilter: "blur(20px)",
                border: `1px solid ${alpha(useCase.color, 0.2)}`,
                borderRadius: "16px",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  border: `1px solid ${alpha(useCase.color, 0.5)}`,
                  boxShadow: `0 12px 40px ${alpha(useCase.color, 0.2)}`,
                },
              }}
            >
              {/* Icon */}
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "12px",
                  background: alpha(useCase.color, 0.15),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: SPACING.md,
                }}
              >
                <Box sx={{ color: useCase.color, fontSize: 28 }}>
                  {useCase.icon}
                </Box>
              </Box>

              {/* Content */}
              <Typography
                variant="h6"
                sx={{
                  color: "white",
                  fontWeight: 700,
                  mb: SPACING.sm,
                  fontSize: "1.1rem",
                }}
              >
                {useCase.title}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: alpha("#FFFFFF", 0.7),
                  lineHeight: 1.6,
                }}
              >
                {useCase.description}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Stack>
    </Container>
  );
};

export default WhoIsThisFor;
