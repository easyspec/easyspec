import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Box,
  Chip,
  Typography,
  alpha,
} from "@mui/material";
import {
  Upload as UploadIcon,
  Check as CheckIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";
import Editor from "@monaco-editor/react";
import { colors } from "../../../../styles/tokens";
import * as yaml from "js-yaml";
import {
  MONACO_EDITOR_OPTIONS,
  registerEasyspecTheme,
} from "../../constants/editorTheme";

interface ImportDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (content: string, format: "json" | "yaml") => void;
}

export const ImportDialog: React.FC<ImportDialogProps> = ({
  open,
  onClose,
  onImport,
}) => {
  const [importContent, setImportContent] = useState("");
  const [importFormat, setImportFormat] = useState<"json" | "yaml">("yaml");
  const [validationStatus, setValidationStatus] = useState<{
    isValid: boolean;
    error: string | null;
  }>({ isValid: true, error: null });

  // Validate content whenever it changes or format changes
  useEffect(() => {
    if (!importContent.trim()) {
      setValidationStatus({ isValid: true, error: null });
      return;
    }

    try {
      if (importFormat === "yaml") {
        yaml.load(importContent);
      } else {
        JSON.parse(importContent);
      }
      setValidationStatus({ isValid: true, error: null });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Invalid format";
      setValidationStatus({
        isValid: false,
        error: errorMessage,
      });
    }
  }, [importContent, importFormat]);

  const handleClose = () => {
    setImportContent("");
    setImportFormat("yaml");
    setValidationStatus({ isValid: true, error: null });
    onClose();
  };

  const handleImport = () => {
    if (validationStatus.isValid && importContent.trim()) {
      onImport(importContent, importFormat);
      handleClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          background: colors.background.elevated,
          border: `1px solid ${alpha(colors.primary.main, 0.2)}`,
          height: "90vh",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <DialogTitle
        sx={{
          color: colors.text.primary,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>Import Configuration</span>
        {importContent.trim() && (
          <Chip
            icon={validationStatus.isValid ? <CheckIcon /> : <ErrorIcon />}
            label={
              validationStatus.isValid
                ? `Valid ${importFormat.toUpperCase()}`
                : "Invalid Format"
            }
            size="small"
            sx={{
              background: alpha(
                validationStatus.isValid
                  ? colors.semantic.success
                  : colors.semantic.error,
                0.1,
              ),
              color: validationStatus.isValid
                ? colors.semantic.success
                : colors.semantic.error,
              border: `1px solid ${validationStatus.isValid ? colors.semantic.success : colors.semantic.error}`,
              fontWeight: 600,
            }}
          />
        )}
      </DialogTitle>
      <DialogContent
        sx={{
          flex: 1,
          p: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: `1px solid ${alpha(colors.primary.main, 0.1)}`,
          }}
        >
          <Stack direction="row" spacing={2}>
            <Button
              variant={importFormat === "yaml" ? "contained" : "outlined"}
              onClick={() => setImportFormat("yaml")}
              sx={
                importFormat === "yaml"
                  ? {
                      background: colors.primary.main,
                      "&:hover": {
                        background: colors.primary.dark,
                      },
                    }
                  : {
                      borderColor: alpha(colors.primary.main, 0.5),
                      color: colors.primary.main,
                      "&:hover": {
                        borderColor: colors.primary.main,
                        background: alpha(colors.primary.main, 0.1),
                      },
                    }
              }
            >
              YAML
            </Button>
            <Button
              variant={importFormat === "json" ? "contained" : "outlined"}
              onClick={() => setImportFormat("json")}
              sx={
                importFormat === "json"
                  ? {
                      background: colors.primary.main,
                      "&:hover": {
                        background: colors.primary.dark,
                      },
                    }
                  : {
                      borderColor: alpha(colors.primary.main, 0.5),
                      color: colors.primary.main,
                      "&:hover": {
                        borderColor: colors.primary.main,
                        background: alpha(colors.primary.main, 0.1),
                      },
                    }
              }
            >
              JSON
            </Button>
          </Stack>
        </Box>
        <Box
          sx={{
            flex: 1,
            border: `1px solid ${
              !validationStatus.isValid && importContent.trim()
                ? colors.semantic.error
                : alpha(colors.primary.main, 0.2)
            }`,
            borderRadius: "8px",
            overflow: "hidden",
            m: 2,
          }}
        >
          <Editor
            height="100%"
            defaultLanguage={importFormat}
            language={importFormat}
            theme="easyspec-dark"
            value={importContent}
            onChange={(value) => setImportContent(value || "")}
            options={MONACO_EDITOR_OPTIONS}
            beforeMount={registerEasyspecTheme}
          />
        </Box>
        {!validationStatus.isValid && importContent.trim() && (
          <Box sx={{ px: 2, pb: 2, color: colors.semantic.error }}>
            <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
              Error: {validationStatus.error}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} sx={{ color: colors.text.secondary }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleImport}
          startIcon={<UploadIcon />}
          disabled={!validationStatus.isValid || !importContent.trim()}
          sx={{
            background: colors.primary.main,
            "&:hover": {
              background: colors.primary.dark,
              transform: "translateY(-1px)",
            },
            "&:disabled": {
              background: alpha(colors.primary.main, 0.3),
              color: alpha(colors.text.primary, 0.5),
            },
            transition: "all 0.2s ease",
          }}
        >
          Import
        </Button>
      </DialogActions>
    </Dialog>
  );
};
