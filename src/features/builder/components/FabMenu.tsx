import React, { useState } from "react";
import { Box, Fab, Stack, Zoom } from "@mui/material";
import { Close as CloseIcon, Add as AddIcon } from "@mui/icons-material";
import { landingColors } from "../../../styles/landing.styles";

interface FabAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
}

interface FabMenuProps {
  actions: FabAction[];
}

/**
 * Floating Action Button menu for mobile and tablet views
 * Provides quick access to common actions in a compact, expandable menu
 */
export const FabMenu: React.FC<FabMenuProps> = ({ actions }) => {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 1300 }}>
      <Stack spacing={2} alignItems="center">
        {open &&
          actions.map((action, index) => (
            <Zoom
              in={open}
              style={{ transitionDelay: `${index * 50}ms` }}
              key={action.label}
            >
              <Fab
                size="small"
                onClick={() => {
                  action.onClick();
                  setOpen(false);
                }}
                sx={{
                  background: action.color || landingColors.primary.gradient,
                  "&:hover": { transform: "scale(1.1)" },
                }}
              >
                {action.icon}
              </Fab>
            </Zoom>
          ))}
        <Fab
          onClick={() => setOpen(!open)}
          sx={{
            background: landingColors.primary.gradient,
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: open ? "rotate(45deg) scale(1.1)" : "scale(1.1)",
            },
          }}
        >
          {open ? <CloseIcon /> : <AddIcon />}
        </Fab>
      </Stack>
    </Box>
  );
};
