import React, { useEffect, useState } from "react";
import {
  alpha,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Fade,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  Cookie as CookieIcon,
  DateRange as DateIcon,
  Security as PrivacyIcon,
  Shield as ShieldIcon,
  Visibility as EyeIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  landingAnimations,
  landingColors,
  landingStyles,
} from "../../styles/landing.styles";
import Header from "../landing/components/Header";
import Footer from "../landing/components/Footer";

const PrivacyPolicy: React.FC = () => {
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
      icon: <ShieldIcon />,
      title: "1. No Data Collection",
      content: `EasySpec is a client-side application. We literally cannot collect your data because:
      • We have no backend servers
      • We have no database
      • We have no authentication system
      • Everything runs in your browser`,
    },
    {
      icon: <EyeIcon />,
      title: "2. What Happens to Your Forms",
      content: `When you create a form:
      • It's automatically saved in your browser's localStorage (on your device only)
      • The form definition is encoded in shareable URLs
      • We never see or store your form data on any server
      • Recipients who fill forms download YAML locally - nothing is sent to us
      • Your browser stores drafts locally - you can clear them anytime`,
    },
    {
      icon: <CookieIcon />,
      title: "3. No Cookies or Tracking",
      content: `We do not use:
      • Cookies
      • Analytics
      • Tracking scripts
      • Third-party services

      Your browser's localStorage is used only to auto-save your work locally. This data never leaves your device.`,
    },
    {
      title: "4. Shared Links",
      content: `When you share a form link:
      • The form definition is encoded in the URL itself
      • Anyone with the link can fill and download the form
      • The data stays on their computer when they download
      • We never see who fills forms or what they enter`,
    },
    {
      title: "5. Your Rights",
      content: `Since we don't collect data, there's nothing to access, delete, or port. You're in complete control:
      • Clear your browser data to remove forms
      • Forms live only on your device
      • Stop sharing a link to revoke access`,
    },
    {
      title: "6. Changes to This Policy",
      content: `If we ever add backend services or data collection, we'll update this policy and notify users clearly. For now: no servers, no data collection, no problem.`,
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
                <PrivacyIcon
                  sx={{ color: landingColors.primary.main, fontSize: 24 }}
                />
                <Typography
                  variant="subtitle1"
                  sx={{ color: landingColors.primary.main, fontWeight: 600 }}
                >
                  Your Privacy Matters
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
                Privacy Policy
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center">
                <Chip
                  icon={<DateIcon sx={{ fontSize: 16 }} />}
                  label="Last Updated: October 4, 2025"
                  size="small"
                  sx={{
                    background: alpha(landingColors.primary.main, 0.1),
                    color: landingColors.primary.main,
                    border: `1px solid ${alpha(
                      landingColors.primary.main,
                      0.3,
                    )}`,
                  }}
                />
                <Chip
                  label="nFADP / GDPR Compliant"
                  size="small"
                  sx={{
                    background: alpha(landingColors.semantic.success, 0.1),
                    color: landingColors.semantic.success,
                    border: `1px solid ${alpha(
                      landingColors.semantic.success,
                      0.3,
                    )}`,
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
                    EasySpec ("we", "our", or "us") is committed to protecting
                    your privacy. This Privacy Policy explains how we collect,
                    use, disclose, and safeguard your information when you use
                    our service. Please read this privacy policy carefully.
                  </Typography>
                </Box>

                <Divider
                  sx={{ borderColor: alpha(landingColors.primary.main, 0.2) }}
                />

                {/* Sections */}
                {sections.map((section, index) => (
                  <Fade key={index} in={isVisible} timeout={1000 + index * 100}>
                    <Box>
                      <Stack
                        direction="row"
                        alignItems="flex-start"
                        spacing={2}
                        sx={{ mb: 2 }}
                      >
                        {section.icon && (
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: "10px",
                              background: alpha(
                                landingColors.primary.main,
                                0.1,
                              ),
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: landingColors.primary.main,
                              flexShrink: 0,
                            }}
                          >
                            {section.icon}
                          </Box>
                        )}
                        <Typography
                          variant="h6"
                          sx={{
                            color: "white",
                            fontWeight: 700,
                            flex: 1,
                          }}
                        >
                          {section.title}
                        </Typography>
                      </Stack>
                      <Typography
                        variant="body2"
                        sx={{
                          color: alpha("#FFFFFF", 0.7),
                          lineHeight: 1.8,
                          whiteSpace: "pre-line",
                          pl: section.icon ? 7 : 0,
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

export default PrivacyPolicy;
