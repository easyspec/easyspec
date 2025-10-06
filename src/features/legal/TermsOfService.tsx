import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Paper,
  Fade,
  Chip,
  Divider,
  Button,
  alpha,
} from "@mui/material";
import {
  Gavel as LegalIcon,
  ArrowBack as BackIcon,
  DateRange as DateIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  landingStyles,
  landingColors,
  landingAnimations,
} from "../../styles/landing.styles";
import Header from "../landing/components/Header";
import Footer from "../landing/components/Footer";

const TermsOfService: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
    // Inject animations
    const style = document.createElement("style");
    style.textContent = Object.values(landingAnimations).join("\n");
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const sections = [
    {
      title: "1. What EasySpec Is",
      content: `EasySpec is a free, open-source, client-side form builder. You use it to create forms and share them via URL. There are no accounts, no servers, no subscriptions.`,
    },
    {
      title: "2. Use It However You Want",
      content: `EasySpec is free to use for any purpose:
      • Personal use
      • Commercial use
      • Modify it (it's open source)
      • No restrictions

      Just don't claim you made it.`,
    },
    {
      title: "3. No Accounts, No Data",
      content: `Since there are no accounts:
      • You don't need to provide any information
      • We don't collect or store your data
      • Everything runs in your browser
      • You're responsible for your own data`,
    },
    {
      title: "4. Shared Links",
      content: `When you share a form link:
      • Anyone with the link can access it
      • The link contains the form definition
      • You can't revoke a link once shared (no backend to track it)
      • Don't share links with sensitive form structures publicly`,
    },
    {
      title: "5. No Warranties",
      content: `EasySpec is provided "as is":
      • We don't guarantee it will work perfectly
      • We're not responsible for data loss
      • Use at your own risk
      • Save important forms yourself`,
    },
    {
      title: "6. Limitation of Liability",
      content: `Since we don't collect data or charge money, there's not much we can be liable for. But to be clear: we're not responsible for any damages from using EasySpec.`,
    },
    {
      title: "7. Changes",
      content: `We may update the app or these terms at any time. Since there are no accounts, we can't notify you directly. Check back occasionally.`,
    },
  ];

  return (
    <Box sx={landingStyles.mainContainer}>
      {/* Animated Background Mesh */}
      <Box sx={landingStyles.backgroundMesh} />

      {/* Header */}
      <Header />

      {/* Content */}
      <Container
        maxWidth="lg"
        sx={{ pt: 10, pb: 8, position: "relative", zIndex: 1 }}
      >
        <Fade in={isVisible} timeout={1000}>
          <Stack spacing={4}>
            {/* Hero Section */}
            <Stack alignItems="center" spacing={2} sx={{ mb: 4 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <LegalIcon
                  sx={{ color: landingColors.primary.main, fontSize: 24 }}
                />
                <Typography
                  variant="subtitle1"
                  sx={{ color: landingColors.primary.main, fontWeight: 600 }}
                >
                  Legal Agreement
                </Typography>
              </Stack>

              <Typography
                variant="h3"
                align="center"
                sx={{
                  ...landingStyles.hero.title,
                  fontSize: { xs: "2rem", md: "2.5rem" },
                }}
              >
                Terms of Service
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center">
                <Chip
                  icon={<DateIcon sx={{ fontSize: 16 }} />}
                  label="Last Updated: October 4, 2025"
                  size="small"
                  sx={{
                    background: alpha(landingColors.primary.main, 0.1),
                    color: landingColors.primary.main,
                    border: `1px solid ${alpha(landingColors.primary.main, 0.3)}`,
                  }}
                />
                <Chip
                  label="Version 1.0"
                  size="small"
                  sx={{
                    background: alpha(landingColors.accent.teal, 0.1),
                    color: landingColors.accent.teal,
                    border: `1px solid ${alpha(landingColors.accent.teal, 0.3)}`,
                  }}
                />
              </Stack>
            </Stack>

            {/* Main Content */}
            <Paper
              sx={{
                p: { xs: 3, md: 5 },
                background: alpha(landingColors.background.paper, 0.9),
                backdropFilter: "blur(20px)",
                border: `1px solid ${alpha(landingColors.primary.main, 0.2)}`,
                borderRadius: "24px",
              }}
            >
              <Stack spacing={4}>
                {/* Introduction */}
                <Box>
                  <Typography
                    variant="body1"
                    sx={{ color: alpha("#FFFFFF", 0.8), lineHeight: 1.8 }}
                  >
                    Welcome to EasySpec. These terms of service ("Terms") govern
                    your use of our website and services. By using EasySpec, you
                    agree to these Terms. If you disagree with any part of these
                    terms, please do not use our Service.
                  </Typography>
                </Box>

                <Divider
                  sx={{ borderColor: alpha(landingColors.primary.main, 0.2) }}
                />

                {/* Sections */}
                {sections.map((section, index) => (
                  <Fade key={index} in={isVisible} timeout={1000 + index * 100}>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "white",
                          fontWeight: 700,
                          mb: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: landingColors.primary.gradient,
                          }}
                        />
                        {section.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: alpha("#FFFFFF", 0.7),
                          lineHeight: 1.8,
                          whiteSpace: "pre-line",
                          pl: 2,
                        }}
                      >
                        {section.content}
                      </Typography>
                    </Box>
                  </Fade>
                ))}
              </Stack>
            </Paper>

            {/* Back Button */}
            <Stack alignItems="center">
              <Button
                startIcon={<BackIcon />}
                onClick={() => navigate(-1)}
                sx={{
                  color: alpha("#FFFFFF", 0.7),
                  textTransform: "none",
                  "&:hover": {
                    color: "white",
                    background: alpha("#FFFFFF", 0.05),
                  },
                }}
              >
                Go Back
              </Button>
            </Stack>
          </Stack>
        </Fade>
      </Container>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default TermsOfService;
