import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Stack,
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Chip,
  alpha,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Home as HomeIcon,
  NoteAdd as NewIcon,
  Science as ExampleIcon,
  Upload as ImportIcon,
  Edit as EditIcon,
  Share as ShareIcon,
  Description as DocIcon,
  Menu as MenuIcon,
  Layers as LayersIcon,
  Visibility as PreviewIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { landingColors } from "../../../styles/landing.styles";

interface BuilderHeaderProps {
  activeTab?: number;
  onTabChange?: (tab: number) => void;
  onNewForm: () => void;
  onExample: () => void;
  onImport: () => void;
  onEditForm: () => void;
  onShare: () => void;
  showTabs?: boolean;
}

/**
 * Header component for the Builder interface
 * Provides navigation, actions, and mobile/desktop menu layouts
 */
export const BuilderHeader: React.FC<BuilderHeaderProps> = ({
  activeTab = 0,
  onTabChange,
  onNewForm,
  onExample,
  onImport,
  onEditForm,
  onShare,
  showTabs = false,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(
    null,
  );

  return (
    <Paper
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1100,
        background: alpha(landingColors.background.paper, 0.9),
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${alpha(landingColors.primary.main, 0.1)}`,
        borderRadius: 0,
      }}
    >
      <Box sx={{ px: 3, py: 2 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton
              onClick={() => navigate("/")}
              aria-label="Go to home page"
              sx={{
                color: landingColors.primary.main,
                "&:hover": {
                  background: alpha(landingColors.primary.main, 0.1),
                },
              }}
            >
              <HomeIcon />
            </IconButton>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  background: landingColors.primary.gradient,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Form Builder
              </Typography>
              <Chip
                label="BETA"
                size="small"
                sx={{
                  height: 20,
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  background: alpha(landingColors.primary.main, 0.2),
                  color: landingColors.primary.main,
                  border: `1px solid ${landingColors.primary.main}`,
                  "& .MuiChip-label": {
                    px: 1,
                  },
                }}
              />
            </Stack>
          </Stack>

          {/* Desktop Menu */}
          {!isMobile && (
            <Stack direction="row" spacing={1}>
              <Button startIcon={<NewIcon />} onClick={onNewForm}>
                New Form
              </Button>
              <Button startIcon={<ExampleIcon />} onClick={onExample}>
                Example
              </Button>
              <Button startIcon={<ImportIcon />} onClick={onImport}>
                Import
              </Button>
              <Button
                startIcon={<EditIcon />}
                onClick={onEditForm}
                variant="contained"
                sx={{
                  background: `linear-gradient(135deg, ${landingColors.primary.main} 0%, ${alpha(landingColors.primary.main, 0.8)} 100%)`,
                  color: "white",
                  fontWeight: 600,
                  "&:hover": {
                    background: `linear-gradient(135deg, ${landingColors.primary.main} 0%, ${alpha(landingColors.primary.main, 0.9)} 100%)`,
                    transform: "translateY(-1px)",
                    boxShadow: `0 4px 20px ${alpha(landingColors.primary.main, 0.3)}`,
                  },
                  transition: "all 0.2s ease",
                }}
              >
                Edit Form
              </Button>
              <Button
                startIcon={<DocIcon />}
                onClick={() => window.open("/docs", "_blank")}
              >
                Docs
              </Button>
              <Button
                startIcon={<ShareIcon />}
                onClick={onShare}
                variant="contained"
                sx={{
                  background: `linear-gradient(135deg, ${landingColors.accent.teal} 0%, ${alpha(landingColors.accent.teal, 0.8)} 100%)`,
                  color: "white",
                  fontWeight: 600,
                  "&:hover": {
                    background: `linear-gradient(135deg, ${landingColors.accent.teal} 0%, ${alpha(landingColors.accent.teal, 0.9)} 100%)`,
                    transform: "translateY(-1px)",
                    boxShadow: `0 4px 20px ${alpha(landingColors.accent.teal, 0.3)}`,
                  },
                  transition: "all 0.2s ease",
                }}
              >
                Public Link
              </Button>
            </Stack>
          )}

          {/* Mobile Menu */}
          {isMobile && (
            <>
              <IconButton
                onClick={(e) => setMobileMenuAnchor(e.currentTarget)}
                aria-label="Open menu"
                aria-expanded={Boolean(mobileMenuAnchor)}
                sx={{
                  background: alpha(landingColors.primary.main, 0.1),
                  "&:hover": {
                    background: alpha(landingColors.primary.main, 0.2),
                  },
                }}
              >
                <MenuIcon />
              </IconButton>

              <Menu
                anchorEl={mobileMenuAnchor}
                open={Boolean(mobileMenuAnchor)}
                onClose={() => setMobileMenuAnchor(null)}
                PaperProps={{
                  sx: {
                    background: landingColors.background.elevated,
                    border: `1px solid ${alpha(landingColors.primary.main, 0.2)}`,
                    minWidth: 200,
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    onNewForm();
                    setMobileMenuAnchor(null);
                  }}
                >
                  <ListItemIcon>
                    <NewIcon />
                  </ListItemIcon>
                  New Form
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    onExample();
                    setMobileMenuAnchor(null);
                  }}
                >
                  <ListItemIcon>
                    <ExampleIcon />
                  </ListItemIcon>
                  Example
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    onImport();
                    setMobileMenuAnchor(null);
                  }}
                >
                  <ListItemIcon>
                    <ImportIcon />
                  </ListItemIcon>
                  Import
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    onEditForm();
                    setMobileMenuAnchor(null);
                  }}
                  sx={{
                    background: alpha(landingColors.primary.main, 0.1),
                    "&:hover": {
                      background: alpha(landingColors.primary.main, 0.2),
                    },
                  }}
                >
                  <ListItemIcon>
                    <EditIcon sx={{ color: landingColors.primary.main }} />
                  </ListItemIcon>
                  <Typography
                    sx={{ color: landingColors.primary.main, fontWeight: 600 }}
                  >
                    Edit Form
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    window.open("/docs", "_blank");
                    setMobileMenuAnchor(null);
                  }}
                >
                  <ListItemIcon>
                    <DocIcon />
                  </ListItemIcon>
                  Docs
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={() => {
                    onShare();
                    setMobileMenuAnchor(null);
                  }}
                  sx={{
                    background: alpha(landingColors.accent.teal, 0.1),
                    "&:hover": {
                      background: alpha(landingColors.accent.teal, 0.2),
                    },
                  }}
                >
                  <ListItemIcon>
                    <ShareIcon sx={{ color: landingColors.accent.teal }} />
                  </ListItemIcon>
                  <Typography
                    sx={{ color: landingColors.accent.teal, fontWeight: 600 }}
                  >
                    Public Link
                  </Typography>
                </MenuItem>
              </Menu>
            </>
          )}
        </Stack>
      </Box>

      {/* Mobile Tabs */}
      {showTabs && isMobile && onTabChange && (
        <Tabs
          value={activeTab}
          onChange={(_, value) => onTabChange(value)}
          variant="fullWidth"
          sx={{
            borderTop: `1px solid ${alpha(landingColors.primary.main, 0.1)}`,
          }}
        >
          <Tab label="Fields" icon={<LayersIcon />} iconPosition="start" />
          <Tab label="Editor" icon={<EditIcon />} iconPosition="start" />
          <Tab label="Preview" icon={<PreviewIcon />} iconPosition="start" />
        </Tabs>
      )}
    </Paper>
  );
};
