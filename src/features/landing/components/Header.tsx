import React, { useState } from "react";
import {
  Box,
  Container,
  Stack,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  alpha,
} from "@mui/material";
import {
  DynamicForm as BrandIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Build as BuildIcon,
  Description as DocIcon,
  AutoAwesome as SparkleIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { landingStyles, landingColors } from "../../../styles/landing.styles";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <Box sx={landingStyles.navigation.header}>
      <Container maxWidth="lg">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ py: 2.5 }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                ...landingStyles.navigation.logo,
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            >
              <BrandIcon sx={{ color: "white", fontSize: 26 }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "white",
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            >
              EasySpec
            </Typography>
          </Stack>

          {/* Desktop Navigation */}
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            <Button
              startIcon={<DocIcon sx={{ fontSize: 20 }} />}
              onClick={() => navigate("/docs")}
              sx={landingStyles.navigation.navButton}
            >
              Docs
            </Button>
            <Button
              startIcon={
                <Box
                  sx={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <BuildIcon sx={{ fontSize: 20 }} />
                  <SparkleIcon
                    sx={{
                      fontSize: 12,
                      position: "absolute",
                      top: -6,
                      right: -8,
                      color: landingColors.accent.gold,
                      animation: "pulse 2s ease infinite",
                    }}
                  />
                </Box>
              }
              onClick={() => navigate("/builder")}
              sx={{
                ...landingStyles.navigation.navButton,
                background: `linear-gradient(135deg, ${alpha(landingColors.primary.main, 0.1)} 0%, ${alpha(landingColors.accent.gold, 0.1)} 100%)`,
                border: `1px solid ${alpha(landingColors.accent.gold, 0.3)}`,
                color: landingColors.accent.gold,
                fontWeight: 600,
                animation: "pulse-border 3s ease-in-out infinite",
                "&:hover": {
                  background: `linear-gradient(135deg, ${alpha(landingColors.primary.main, 0.2)} 0%, ${alpha(landingColors.accent.gold, 0.2)} 100%)`,
                  borderColor: landingColors.accent.gold,
                  transform: "translateY(-2px)",
                  boxShadow: `0 4px 12px ${alpha(landingColors.accent.gold, 0.3)}`,
                },
              }}
            >
              Builder
            </Button>
          </Stack>

          {/* Mobile Menu Button */}
          <IconButton
            aria-label="Open navigation menu"
            onClick={() => setMobileMenuOpen(true)}
            sx={{
              display: { xs: "flex", md: "none" },
              color: landingColors.primary.main,
            }}
          >
            <MenuIcon />
          </IconButton>
        </Stack>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            background: landingColors.background.paper,
            borderLeft: `1px solid ${alpha(landingColors.primary.main, 0.2)}`,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="h6" sx={{ color: "white", fontWeight: 700 }}>
              Menu
            </Typography>
            <IconButton
              onClick={() => setMobileMenuOpen(false)}
              sx={{ color: landingColors.primary.main }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>

          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNavigate("/docs")}>
                <ListItemIcon>
                  <DocIcon sx={{ color: landingColors.primary.main }} />
                </ListItemIcon>
                <ListItemText primary="Documentation" sx={{ color: "white" }} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleNavigate("/builder")}
                sx={{
                  background: `linear-gradient(135deg, ${alpha(landingColors.primary.main, 0.1)} 0%, ${alpha(landingColors.accent.gold, 0.1)} 100%)`,
                  border: `1px solid ${alpha(landingColors.accent.gold, 0.3)}`,
                  borderRadius: 1,
                  my: 1,
                }}
              >
                <ListItemIcon>
                  <BuildIcon sx={{ color: landingColors.accent.gold }} />
                </ListItemIcon>
                <ListItemText
                  primary="Builder"
                  sx={{ color: landingColors.accent.gold, fontWeight: 600 }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Header;
