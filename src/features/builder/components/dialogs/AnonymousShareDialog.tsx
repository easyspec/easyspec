import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Box,
  IconButton,
  Typography,
  Stack,
} from "@mui/material";
import {
  ContentCopy as CopyIcon,
  Close as CloseIcon,
  Share as ShareIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { encodeFormToURL, isURLSafe } from "../../../../utils/formUrlEncoder";
import type { Field } from "../../../../types";

interface AnonymousShareDialogProps {
  open: boolean;
  onClose: () => void;
  fields: Field[];
  formName?: string;
  formDescription?: string;
}

export const AnonymousShareDialog: React.FC<AnonymousShareDialogProps> = ({
  open,
  onClose,
  fields,
  formName,
  formDescription,
}) => {
  const [shareURL, setShareURL] = useState("");
  const [copied, setCopied] = useState(false);
  const [urlTooLong, setUrlTooLong] = useState(false);

  useEffect(() => {
    if (open && fields.length > 0) {
      try {
        const url = encodeFormToURL(fields, formName, formDescription);
        setShareURL(url);
        setUrlTooLong(!isURLSafe(url));
      } catch {
        // Failed to generate URL, clear it
        setShareURL("");
      }
    }
  }, [open, fields, formName, formDescription]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareURL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Copy failed, silently ignore
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <ShareIcon />
            <span>Share Form Anonymously</span>
          </Box>
          <IconButton onClick={onClose} size="small" aria-label="Close dialog">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          <Alert severity="info">
            Anyone with this link can view and fill out your form. No login
            required! The entire form structure is encoded in the URL.
          </Alert>

          {urlTooLong && (
            <Alert severity="warning" icon={<WarningIcon />}>
              Your form is quite large and may not work in all browsers.
              Consider simplifying the form or using authenticated sharing for
              complex forms.
            </Alert>
          )}

          {shareURL && (
            <>
              <Typography variant="body2" color="text.secondary">
                Copy this link to share your form:
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={3}
                value={shareURL}
                InputProps={{
                  readOnly: true,
                  sx: { fontFamily: "monospace", fontSize: "0.875rem" },
                }}
                onClick={(e) => {
                  const target = e.currentTarget.querySelector("textarea");
                  if (target) target.select();
                }}
              />

              <Box display="flex" gap={1}>
                <Button
                  variant="contained"
                  startIcon={<CopyIcon />}
                  onClick={handleCopy}
                  fullWidth
                >
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
              </Box>

              <Alert severity="success" variant="outlined">
                <Typography variant="body2">
                  <strong>Privacy First:</strong> No data is stored on any
                  server. The form structure is completely contained in the URL.
                </Typography>
              </Alert>
            </>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
