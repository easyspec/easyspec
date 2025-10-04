import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Box,
  Typography,
  Chip,
  alpha,
  Tooltip,
} from "@mui/material";
import {
  DataObject as JsonIcon,
  Save as SaveIcon,
  Check as CheckIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";
import Editor from "@monaco-editor/react";
import { useSnackbar } from "notistack";
import { colors } from "../../../../styles/tokens";
import { basicTemplates } from "../../constants/fieldTemplates";
import type { FieldTemplate } from "../../constants/fieldTemplates";
import {
  MONACO_EDITOR_OPTIONS,
  registerEasyspecTheme,
} from "../../constants/editorTheme";

interface JsonEditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (jsonContent: string) => void;
  initialContent: string;
}

export const JsonEditDialog: React.FC<JsonEditDialogProps> = ({
  open,
  onClose,
  onSave,
  initialContent,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [jsonEditContent, setJsonEditContent] = useState("");
  const [isJsonValid, setIsJsonValid] = useState(true);

  useEffect(() => {
    if (open && initialContent) {
      setJsonEditContent(initialContent);
      setIsJsonValid(true);
    }
  }, [open, initialContent]);

  const handleClose = () => {
    setJsonEditContent("");
    setIsJsonValid(true);
    onClose();
  };

  const handleSave = () => {
    if (isJsonValid) {
      onSave(jsonEditContent);
      handleClose();
    }
  };

  const formatJson = () => {
    try {
      const formatted = JSON.stringify(JSON.parse(jsonEditContent), null, 2);
      setJsonEditContent(formatted);
    } catch {
      enqueueSnackbar("Invalid JSON format", { variant: "error" });
    }
  };

  /**
   * Simple insertion: Always append to end of form array with unique name
   */
  const insertTemplate = (template: FieldTemplate) => {
    try {
      const parsed = JSON.parse(jsonEditContent);
      if (Array.isArray(parsed)) {
        // Clone template and generate unique name
        const newField = { ...template.template };
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 7);
        newField.name = `${template.label.toLowerCase()}_${timestamp}${random}`;

        // Add the template to the array
        parsed.push(newField);
        // Format and update
        const formatted = JSON.stringify(parsed, null, 2);
        setJsonEditContent(formatted);
      } else {
        enqueueSnackbar("Invalid form structure", { variant: "error" });
      }
    } catch {
      enqueueSnackbar("Invalid JSON format", { variant: "error" });
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
          borderBottom: `1px solid ${alpha(colors.primary.main, 0.1)}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <JsonIcon sx={{ color: colors.primary.main }} />
          <Typography variant="h6">Edit Configuration as JSON</Typography>
          <Chip
            icon={isJsonValid ? <CheckIcon /> : <ErrorIcon />}
            label={isJsonValid ? "Valid JSON" : "Invalid JSON"}
            size="small"
            sx={{
              background: alpha(
                isJsonValid ? colors.primary.main : colors.accent.gold,
                0.1,
              ),
              color: isJsonValid ? colors.primary.main : colors.accent.gold,
              border: `1px solid ${isJsonValid ? colors.primary.main : colors.accent.gold}`,
              fontWeight: 600,
            }}
          />
        </Stack>
        <Stack direction="row" spacing={1}>
          <Chip
            label="Auto-format"
            size="small"
            sx={{
              background: alpha(colors.primary.main, 0.1),
              color: colors.primary.main,
              border: `1px solid ${alpha(colors.primary.main, 0.3)}`,
            }}
          />
          <Chip
            label="Syntax Highlighting"
            size="small"
            sx={{
              background: alpha(colors.accent.teal, 0.1),
              color: colors.accent.teal,
              border: `1px solid ${alpha(colors.accent.teal, 0.3)}`,
            }}
          />
        </Stack>
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
        {/* Template Buttons Toolbar */}
        <Box
          sx={{
            px: 2,
            pt: 2,
            pb: 1,
            background: alpha(colors.background.elevated, 0.5),
            borderBottom: `1px solid ${alpha(colors.primary.main, 0.1)}`,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: colors.text.secondary,
              fontWeight: 600,
              fontSize: "0.75rem",
              mb: 1,
              display: "block",
            }}
          >
            QUICK INSERT:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {basicTemplates.map((template) => (
              <Tooltip
                key={template.label}
                title={`Insert ${template.label} field template`}
                arrow
              >
                <Chip
                  label={`${template.icon} ${template.label}`}
                  size="small"
                  onClick={() => insertTemplate(template)}
                  sx={{
                    background: alpha(colors.primary.main, 0.1),
                    color: colors.text.primary,
                    border: `1px solid ${alpha(colors.primary.main, 0.3)}`,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      background: alpha(colors.primary.main, 0.2),
                      border: `1px solid ${colors.primary.main}`,
                      transform: "translateY(-1px)",
                    },
                  }}
                />
              </Tooltip>
            ))}
          </Stack>
        </Box>

        <Box
          sx={{
            flex: 1,
            border: `1px solid ${alpha(colors.primary.main, 0.2)}`,
            borderRadius: "8px",
            overflow: "hidden",
            m: 2,
          }}
        >
          <Editor
            height="100%"
            defaultLanguage="json"
            theme="easyspec-dark"
            value={jsonEditContent}
            onChange={(value) => {
              setJsonEditContent(value || "");
              // Validate JSON
              try {
                if (value) {
                  JSON.parse(value);
                  setIsJsonValid(true);
                }
              } catch {
                setIsJsonValid(false);
              }
            }}
            options={MONACO_EDITOR_OPTIONS}
            beforeMount={registerEasyspecTheme}
          />
        </Box>
        <Box
          sx={{
            px: 2,
            pb: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
            💡 Tip: Use Ctrl+Space for auto-completion
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          p: 2,
          borderTop: `1px solid ${alpha(colors.primary.main, 0.1)}`,
        }}
      >
        <Button onClick={handleClose} sx={{ color: colors.text.secondary }}>
          Cancel
        </Button>
        <Button
          variant="outlined"
          onClick={formatJson}
          sx={{
            borderColor: colors.primary.main,
            color: colors.primary.main,
            "&:hover": {
              background: alpha(colors.primary.main, 0.1),
            },
          }}
        >
          Format JSON
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          startIcon={<SaveIcon />}
          disabled={!isJsonValid}
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
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};
