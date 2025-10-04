import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  Fade,
  Paper,
  alpha,
} from "@mui/material";
import {
  Home as HomeIcon,
  ArrowBack as BackIcon,
  DynamicForm as BrandIcon,
  Explore as ExploreIcon,
  Build as BuildIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  landingStyles,
  landingColors,
  landingAnimations,
} from "../../styles/landing.styles";
import Header from "../landing/components/Header";
import Footer from "../landing/components/Footer";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Inject animations
    const style = document.createElement("style");
    style.textContent =
      Object.values(landingAnimations).join("\n") +
      `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
      @keyframes glitch {
        0%, 100% { 
          text-shadow: 
            2px 2px 0 ${landingColors.primary.main},
            -2px -2px 0 ${landingColors.accent.teal};
        }
        25% { 
          text-shadow: 
            -2px 2px 0 ${landingColors.accent.lime},
            2px -2px 0 ${landingColors.primary.light};
        }
        50% { 
          text-shadow: 
            2px -2px 0 ${landingColors.accent.gold},
            -2px 2px 0 ${landingColors.accent.amber};
        }
        75% { 
          text-shadow: 
            -2px -2px 0 ${landingColors.primary.main},
            2px 2px 0 ${landingColors.accent.teal};
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const quickLinks = [
    {
      title: "Go to Builder",
      description: "Start creating forms for your team",
      icon: <BuildIcon />,
      path: "/builder",
      color: landingColors.primary.main,
    },
    {
      title: "View Documentation",
      description: "Learn how to use EasySpec",
      icon: <ExploreIcon />,
      path: "/docs",
      color: landingColors.accent.teal,
    },
    {
      title: "Browse FAQ",
      description: "Find answers to common questions",
      icon: <BrandIcon />,
      path: "/faq",
      color: landingColors.accent.lime,
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
        maxWidth="md"
        sx={{
          pt: 10,
          pb: 8,
          position: "relative",
          zIndex: 1,
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Fade in={isVisible} timeout={1000}>
          <Stack spacing={6} alignItems="center" sx={{ width: "100%" }}>
            {/* 404 Display */}
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "120px", md: "180px" },
                  fontWeight: 900,
                  background: landingColors.primary.gradient,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  animation: "glitch 3s ease-in-out infinite",
                  mb: -2,
                }}
              >
                404
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  color: "white",
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                Page Not Found
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: alpha("#FFFFFF", 0.7),
                  maxWidth: 500,
                  mx: "auto",
                }}
              >
                The page you're looking for doesn't exist, has been moved, or is
                temporarily unavailable.
              </Typography>
            </Box>

            {/* Decorative Element */}
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: "24px",
                background: landingColors.accent.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "float 3s ease-in-out infinite",
                boxShadow: `0 20px 40px ${alpha(landingColors.primary.main, 0.3)}`,
              }}
            >
              <BrandIcon sx={{ color: "white", fontSize: 48 }} />
            </Box>

            {/* Action Buttons */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                variant="contained"
                size="large"
                startIcon={<HomeIcon />}
                onClick={() => navigate("/")}
                sx={{
                  background: landingColors.primary.gradient,
                  borderRadius: "12px",
                  textTransform: "none",
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: `0 8px 24px ${alpha(landingColors.primary.main, 0.3)}`,
                  },
                }}
              >
                Back to Home
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<BackIcon />}
                onClick={() => navigate(-1)}
                sx={{
                  borderColor: landingColors.primary.main,
                  color: landingColors.primary.main,
                  borderRadius: "12px",
                  textTransform: "none",
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  borderWidth: 2,
                  "&:hover": {
                    borderWidth: 2,
                    borderColor: landingColors.primary.light,
                    background: alpha(landingColors.primary.main, 0.1),
                  },
                }}
              >
                Go Back
              </Button>
            </Stack>

            {/* Quick Links */}
            <Box sx={{ width: "100%", mt: 4 }}>
              <Typography
                variant="h6"
                align="center"
                sx={{
                  color: alpha("#FFFFFF", 0.7),
                  mb: 3,
                  fontWeight: 600,
                }}
              >
                Or try one of these pages:
              </Typography>

              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                {quickLinks.map((link, index) => (
                  <Fade key={index} in={isVisible} timeout={1200 + index * 100}>
                    <Paper
                      onClick={() => navigate(link.path)}
                      sx={{
                        p: 3,
                        flex: 1,
                        background: alpha(landingColors.background.paper, 0.9),
                        backdropFilter: "blur(20px)",
                        border: `1px solid ${alpha(link.color, 0.3)}`,
                        borderRadius: "16px",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          borderColor: link.color,
                          background: alpha(link.color, 0.05),
                          boxShadow: `0 12px 24px ${alpha(link.color, 0.2)}`,
                        },
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: "12px",
                            background: alpha(link.color, 0.1),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: link.color,
                          }}
                        >
                          {link.icon}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle1"
                            sx={{ color: "white", fontWeight: 600 }}
                          >
                            {link.title}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: alpha("#FFFFFF", 0.6) }}
                          >
                            {link.description}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Fade>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Fade>
      </Container>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default NotFoundPage;
