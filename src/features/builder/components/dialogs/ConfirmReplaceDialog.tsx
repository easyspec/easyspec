import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  alpha,
} from "@mui/material";
import { Warning as WarningIcon } from "@mui/icons-material";
import { colors } from "../../../../styles/tokens";

interface ConfirmReplaceDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  action: "new" | "example" | "import";
}

const ACTION_LABELS = {
  new: "create a new form",
  example: "load an example",
  import: "import a form",
};

/**
 * Confirmation dialog before replacing current form
 * SOLID: Single Responsibility - only handles confirmation
 */
export const ConfirmReplaceDialog: React.FC<ConfirmReplaceDialogProps> = ({
  open,
  onConfirm,
  onCancel,
  action,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: colors.background.elevated,
          border: `1px solid ${alpha(colors.semantic.warning, 0.3)}`,
        },
      }}
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <WarningIcon sx={{ color: colors.semantic.warning, fontSize: 28 }} />
          <Typography
            variant="h6"
            sx={{ color: colors.text.primary, fontWeight: 700 }}
          >
            Replace Current Form?
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Typography sx={{ color: colors.text.secondary, mb: 2 }}>
          You are about to {ACTION_LABELS[action]}. This will replace your
          current work.
        </Typography>
        <Box
          sx={{
            p: 2,
            background: alpha(colors.semantic.warning, 0.1),
            border: `1px solid ${alpha(colors.semantic.warning, 0.3)}`,
            borderRadius: "8px",
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: colors.text.primary, fontWeight: 600 }}
          >
            💡 Your current form is auto-saved in your browser
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onCancel} sx={{ color: colors.text.secondary }}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            background: colors.semantic.warning,
            color: "#000",
            fontWeight: 600,
            "&:hover": {
              background: "#F59E0B",
            },
          }}
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};
