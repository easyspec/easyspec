import React from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Stack,
  Paper,
  Chip,
  FormControl,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Button,
  Fade,
  alpha,
} from "@mui/material";
import {
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  AutoAwesome as SparkleIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Link as LinkIcon,
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material";
import type { Field } from "../../../../types";
import { colors } from "../../../../styles/tokens";
import { getFieldIcon, getFieldColor } from "../../constants/fieldConstants";

interface BuilderEditorProps {
  selectedField: Field | null;
  selectedFieldPath: string | null;
  validationError: string | null;
  onUpdateValue: (path: string, value: unknown) => void;
  onAddArrayItem: (path: string) => void;
  onRemoveArrayItem: (parentPath: string, itemPath: string) => void;
  onClose: () => void;
}

export const BuilderEditor: React.FC<BuilderEditorProps> = ({
  selectedField,
  selectedFieldPath,
  validationError,
  onUpdateValue,
  onAddArrayItem,
  onRemoveArrayItem,
  onClose,
}) => {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: alpha(colors.background.default, 0.3),
      }}
    >
      {selectedField ? (
        <Fade in timeout={300}>
          <Box
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            {/* Editor Header */}
            <Box
              sx={{
                p: 3,
                borderBottom: `1px solid ${alpha(colors.primary.main, 0.1)}`,
                background: alpha(colors.background.elevated, 0.3),
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "16px",
                        background: alpha(
                          getFieldColor(selectedField.type),
                          0.1,
                        ),
                        border: `2px solid ${getFieldColor(selectedField.type)}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {React.createElement(getFieldIcon(selectedField.type), {
                        sx: { fontSize: 18 },
                      })}
                    </Box>
                    <Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: colors.text.primary,
                          mb: 0.5,
                        }}
                      >
                        {selectedField.name}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Chip
                          label={selectedField.type}
                          size="small"
                          sx={{
                            background: alpha(
                              getFieldColor(selectedField.type),
                              0.2,
                            ),
                            color: getFieldColor(selectedField.type),
                            border: `1px solid ${getFieldColor(selectedField.type)}`,
                            fontWeight: 600,
                          }}
                        />
                        {selectedField.required && (
                          <Chip
                            label="required"
                            size="small"
                            icon={<SparkleIcon sx={{ fontSize: 16 }} />}
                            sx={{
                              background: alpha(colors.accent.gold, 0.2),
                              color: colors.accent.gold,
                              border: `1px solid ${colors.accent.gold}`,
                              fontWeight: 600,
                            }}
                          />
                        )}
                      </Stack>
                    </Box>
                  </Stack>
                </Box>
                <IconButton
                  onClick={onClose}
                  aria-label="Close editor"
                  sx={{ color: colors.text.secondary }}
                >
                  <CloseIcon />
                </IconButton>
              </Stack>
            </Box>

            {/* Editor Content */}
            <Box sx={{ flex: 1, p: 3, overflow: "auto" }}>
              <Stack spacing={3}>
                {/* Value Editor */}
                <Box>
                  <Typography
                    sx={{
                      color: colors.text.secondary,
                      mb: 1.5,
                      fontWeight: 600,
                      fontSize: "0.9rem",
                    }}
                  >
                    VALUE
                  </Typography>
                  {selectedField.type === "boolean" ? (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={Boolean(selectedField.value) || false}
                          onChange={(e) =>
                            onUpdateValue(selectedFieldPath!, e.target.checked)
                          }
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: colors.primary.main,
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                              {
                                backgroundColor: colors.primary.main,
                              },
                          }}
                        />
                      }
                      label={selectedField.value ? "True" : "False"}
                      sx={{ color: colors.text.primary }}
                    />
                  ) : selectedField.type === "enum" && selectedField.options ? (
                    <FormControl fullWidth>
                      <Select
                        value={selectedField.value || ""}
                        onChange={(e) =>
                          onUpdateValue(selectedFieldPath!, e.target.value)
                        }
                        sx={{
                          background: alpha(colors.background.input, 0.5),
                          borderRadius: "12px",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: alpha(colors.primary.main, 0.2),
                            borderWidth: 2,
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: alpha(colors.primary.main, 0.4),
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: colors.primary.main,
                          },
                          color: colors.text.primary,
                        }}
                      >
                        {selectedField.options.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : selectedField.type === "multiselect" &&
                    selectedField.options ? (
                    <FormControl component="fieldset">
                      <FormGroup>
                        {selectedField.options.map((option) => {
                          const currentValues = Array.isArray(
                            selectedField.value,
                          )
                            ? selectedField.value
                            : [];
                          const isChecked = currentValues.includes(
                            option.value,
                          );

                          return (
                            <FormControlLabel
                              key={option.value}
                              control={
                                <Checkbox
                                  checked={isChecked}
                                  onChange={(e) => {
                                    let newValues: string[];
                                    if (e.target.checked) {
                                      newValues = [
                                        ...currentValues,
                                        option.value,
                                      ];
                                    } else {
                                      newValues = currentValues.filter(
                                        (v) => v !== option.value,
                                      );
                                    }
                                    onUpdateValue(
                                      selectedFieldPath!,
                                      newValues,
                                    );
                                  }}
                                  sx={{
                                    color: alpha(colors.primary.main, 0.6),
                                    "&.Mui-checked": {
                                      color: colors.primary.main,
                                    },
                                  }}
                                />
                              }
                              label={option.label}
                              sx={{
                                mb: 1,
                                ml: 0,
                                "& .MuiFormControlLabel-label": {
                                  color: colors.text.primary,
                                  fontSize: "0.95rem",
                                },
                                "&:hover": {
                                  background: alpha(colors.primary.main, 0.05),
                                  borderRadius: "8px",
                                },
                                px: 1,
                                py: 0.5,
                                borderRadius: "8px",
                                transition: "background 0.2s ease",
                              }}
                            />
                          );
                        })}
                      </FormGroup>
                    </FormControl>
                  ) : selectedField.type === "array" ? (
                    <Stack spacing={2}>
                      {selectedField.children?.map((child, index) => (
                        <Stack
                          key={`${selectedFieldPath}.${child.name}`}
                          direction="row"
                          spacing={1}
                          alignItems="center"
                        >
                          <TextField
                            fullWidth
                            value={child.value || ""}
                            onChange={(e) =>
                              onUpdateValue(
                                `${selectedFieldPath}.${child.name}`,
                                e.target.value,
                              )
                            }
                            placeholder={`Item ${index + 1}`}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                background: alpha(colors.background.input, 0.5),
                                borderRadius: "12px",
                                "& fieldset": {
                                  borderColor: alpha(colors.primary.main, 0.2),
                                  borderWidth: 2,
                                },
                                "&:hover fieldset": {
                                  borderColor: alpha(colors.primary.main, 0.4),
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: colors.primary.main,
                                },
                              },
                              "& .MuiInputBase-input": {
                                color: colors.text.primary,
                              },
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={() =>
                              onRemoveArrayItem(
                                selectedFieldPath!,
                                `${selectedFieldPath}.${child.name}`,
                              )
                            }
                            aria-label="Delete array item"
                            sx={{ color: colors.semantic.error }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      ))}
                      <Button
                        startIcon={<AddIcon />}
                        onClick={() => onAddArrayItem(selectedFieldPath!)}
                        disabled={
                          selectedField.maxItems
                            ? selectedField.children!.length >=
                              selectedField.maxItems
                            : false
                        }
                        sx={{
                          color: colors.primary.main,
                          borderColor: colors.primary.main,
                          borderRadius: "12px",
                          textTransform: "none",
                          "&:hover": {
                            background: alpha(colors.primary.main, 0.1),
                          },
                        }}
                      >
                        Add Item
                      </Button>
                    </Stack>
                  ) : (
                    <TextField
                      fullWidth
                      multiline={selectedField.type === "object"}
                      rows={selectedField.type === "object" ? 4 : 1}
                      value={selectedField.value || ""}
                      onChange={(e) =>
                        onUpdateValue(selectedFieldPath!, e.target.value)
                      }
                      placeholder={
                        selectedField.placeholder ||
                        `Enter ${selectedField.type} value...`
                      }
                      error={!!validationError}
                      helperText={validationError}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          background: alpha(colors.background.input, 0.5),
                          borderRadius: "12px",
                          "& fieldset": {
                            borderColor: alpha(colors.primary.main, 0.2),
                            borderWidth: 2,
                          },
                          "&:hover fieldset": {
                            borderColor: alpha(colors.primary.main, 0.4),
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: colors.primary.main,
                          },
                        },
                        "& .MuiInputBase-input": {
                          color: colors.text.primary,
                          fontSize: "1rem",
                        },
                        "& .MuiFormHelperText-root": {
                          color: colors.semantic.error,
                        },
                      }}
                    />
                  )}
                </Box>

                {/* Description */}
                {selectedField.description && (
                  <Box>
                    <Typography
                      sx={{
                        color: colors.text.secondary,
                        mb: 1.5,
                        fontWeight: 600,
                        fontSize: "0.9rem",
                      }}
                    >
                      DESCRIPTION
                    </Typography>
                    <Paper
                      sx={{
                        p: 2,
                        background: alpha(colors.background.elevated, 0.3),
                        border: `1px solid ${alpha(colors.primary.main, 0.1)}`,
                        borderRadius: "12px",
                      }}
                    >
                      <Typography sx={{ color: colors.text.secondary }}>
                        {selectedField.description}
                      </Typography>
                    </Paper>
                  </Box>
                )}

                {/* Related Links */}
                {selectedField.links && selectedField.links.length > 0 && (
                  <Box>
                    <Typography
                      sx={{
                        color: colors.text.secondary,
                        mb: 1.5,
                        fontWeight: 600,
                        fontSize: "0.9rem",
                      }}
                    >
                      RELATED LINKS
                    </Typography>
                    <Stack spacing={1.5}>
                      {selectedField.links.map((link, index) => (
                        <Paper
                          key={index}
                          component="a"
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            p: 2,
                            background: alpha(colors.background.elevated, 0.3),
                            border: `1px solid ${alpha(colors.primary.main, 0.2)}`,
                            borderRadius: "12px",
                            textDecoration: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            transition: "all 0.2s ease",
                            cursor: "pointer",
                            "&:hover": {
                              background: alpha(
                                colors.background.elevated,
                                0.5,
                              ),
                              border: `1px solid ${alpha(colors.primary.main, 0.4)}`,
                              transform: "translateX(4px)",
                            },
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                          >
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: "8px",
                                background: alpha(colors.primary.main, 0.1),
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <LinkIcon
                                sx={{
                                  fontSize: 16,
                                  color: colors.primary.main,
                                }}
                              />
                            </Box>
                            <Typography
                              sx={{
                                color: colors.text.primary,
                                fontWeight: 500,
                              }}
                            >
                              {link.text}
                            </Typography>
                          </Stack>
                          <OpenInNewIcon
                            sx={{
                              fontSize: 16,
                              color: colors.text.secondary,
                            }}
                          />
                        </Paper>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Stack>
            </Box>
          </Box>
        </Fade>
      ) : (
        // Empty State
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 3,
          }}
        >
          <Stack alignItems="center" spacing={3}>
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: alpha(colors.primary.main, 0.1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `2px dashed ${alpha(colors.primary.main, 0.3)}`,
              }}
            >
              <DashboardIcon
                sx={{ fontSize: 60, color: colors.primary.main, opacity: 0.5 }}
              />
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h5"
                sx={{
                  color: colors.text.primary,
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                Select a Node to Edit
              </Typography>
              <Typography
                sx={{
                  color: colors.text.secondary,
                  fontSize: "1.1rem",
                }}
              >
                Choose any field from the tree to configure its properties
              </Typography>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
};
