import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Stack,
  Tabs,
  Tab,
  alpha,
  Chip,
} from "@mui/material";
import {
  ContentCopy as CopyIcon,
  Description as YamlIcon,
  Code as JsonIcon,
  Cloud as KyamlIcon,
  Download as DownloadIcon,
  ArrowForward as NextIcon,
} from "@mui/icons-material";
import { colors } from "../../../../styles/tokens";
import type { ValidationResult } from "../../../../types";

interface BuilderPreviewProps {
  activeTab: number;
  onTabChange: (value: number) => void;
  yamlOutput: string;
  jsonOutput?: string;
  validation: ValidationResult;
  onCopyYaml: () => void;
  onDownloadYaml: () => void;
  setSelectedFieldPath: (path: string | null) => void;
  setExpandedItems: React.Dispatch<React.SetStateAction<string[]>>;
}

export const BuilderPreview: React.FC<BuilderPreviewProps> = ({
  activeTab,
  onTabChange,
  yamlOutput,
  jsonOutput = "",
  validation,
  onCopyYaml,
  onDownloadYaml,
  setSelectedFieldPath,
  setExpandedItems,
}) => {
  // Syntax highlight JSON (same style as YAML)
  const renderHighlightedJson = (json: string) => {
    if (!json) return null;

    const lines = json.split("\n");
    return lines.map((line, index) => {
      const trimmed = line.trim();

      // Skip empty lines
      if (!trimmed) {
        return (
          <Box key={index} component="span">
            {"\n"}
          </Box>
        );
      }

      // Structural elements (brackets, braces)
      if (
        trimmed === "{" ||
        trimmed === "}" ||
        trimmed === "[" ||
        trimmed === "]" ||
        trimmed === "}," ||
        trimmed === "],"
      ) {
        return (
          <Box
            key={index}
            component="span"
            sx={{ color: alpha(colors.primary.main, 0.8) }}
          >
            {line}
            {"\n"}
          </Box>
        );
      }

      // Check for property keys with values
      const keyValueMatch = line.match(/^(\s*)"([^"]+)":\s*(.*)$/);
      if (keyValueMatch) {
        const [, indentation, key, valueStr] = keyValueMatch;

        let valueColor = colors.text.primary;
        const value = valueStr.replace(/,$/, "").trim();

        // Color based on value type
        if (value === "true" || value === "false") {
          valueColor = colors.accent.mint;
        } else if (value === "null") {
          valueColor = colors.text.secondary;
        } else if (value.startsWith('"') && value.endsWith('"')) {
          valueColor = alpha(colors.accent.lime, 0.9);
        } else if (!isNaN(Number(value)) && value !== "") {
          valueColor = colors.primary.light;
        } else if (value === "[" || value === "{") {
          valueColor = alpha(colors.primary.main, 0.8);
        }

        return (
          <Box key={index} component="span">
            {indentation}
            <Box
              component="span"
              sx={{ color: alpha(colors.accent.gold, 0.85), fontWeight: 500 }}
            >
              "{key}"
            </Box>
            <Box component="span" sx={{ color: colors.text.secondary }}>
              :
            </Box>
            <Box component="span" sx={{ color: valueColor }}>
              {valueStr}
            </Box>
            {"\n"}
          </Box>
        );
      }

      // Array values on their own line (like strings in an array)
      if (
        trimmed.startsWith('"') &&
        (trimmed.endsWith(",") || trimmed.endsWith('"'))
      ) {
        return (
          <Box key={index} component="span">
            {line.substring(0, line.indexOf('"'))}
            <Box
              component="span"
              sx={{ color: alpha(colors.accent.lime, 0.9) }}
            >
              {trimmed}
            </Box>
            {"\n"}
          </Box>
        );
      }

      // Default
      return (
        <Box key={index} component="span" sx={{ color: colors.text.primary }}>
          {line}
          {"\n"}
        </Box>
      );
    });
  };

  // Syntax highlight YAML
  const renderHighlightedYaml = (yaml: string) => {
    if (!yaml) return null;

    const lines = yaml.split("\n");
    return lines.map((line, index) => {
      // Check for comments
      if (line.trim().startsWith("#")) {
        return (
          <Box
            key={index}
            component="span"
            sx={{ color: colors.text.disabled, fontStyle: "italic" }}
          >
            {line}
            {"\n"}
          </Box>
        );
      }

      // Check for keys and values
      if (line.includes(":")) {
        const colonIndex = line.indexOf(":");
        const key = line.substring(0, colonIndex);
        const rest = line.substring(colonIndex);
        const value = rest.substring(1).trim();

        let valueColor = colors.text.primary;

        // Balanced color hints for value types
        if (value === "true" || value === "false") {
          valueColor = colors.accent.mint;
        } else if (!isNaN(Number(value)) && value !== "") {
          valueColor = colors.primary.light;
        } else if (value && (value.startsWith('"') || value.startsWith("'"))) {
          valueColor = alpha(colors.accent.lime, 0.9);
        }

        return (
          <Box key={index} component="span">
            <Box
              component="span"
              sx={{ color: alpha(colors.accent.gold, 0.85), fontWeight: 500 }}
            >
              {key}
            </Box>
            <Box component="span" sx={{ color: colors.text.secondary }}>
              :
            </Box>
            {value && (
              <Box component="span" sx={{ color: valueColor }}>
                {rest.substring(1)}
              </Box>
            )}
            {"\n"}
          </Box>
        );
      }

      // Array items
      if (line.trim().startsWith("-")) {
        const dashIndex = line.indexOf("-");
        const indent = line.substring(0, dashIndex);
        const content = line.substring(dashIndex + 1);

        return (
          <Box key={index} component="span">
            {indent}
            <Box
              component="span"
              sx={{ color: alpha(colors.primary.main, 0.8) }}
            >
              -
            </Box>
            <Box component="span" sx={{ color: colors.text.primary }}>
              {content}
            </Box>
            {"\n"}
          </Box>
        );
      }

      // Default (plain values)
      return (
        <Box key={index} component="span" sx={{ color: colors.text.primary }}>
          {line}
          {"\n"}
        </Box>
      );
    });
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Preview Tabs */}
      <Box
        sx={{
          borderBottom: `1px solid ${alpha(colors.primary.main, 0.1)}`,
          flexShrink: 0,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(_, v) => onTabChange(v)}
          variant="fullWidth"
          sx={{
            "& .MuiTabs-indicator": {
              height: 3,
              background: colors.primary.main,
            },
            "& .MuiTab-root": {
              color: colors.text.secondary,
              textTransform: "none",
              fontWeight: 600,
              flex: 1,
              maxWidth: "none",
              "&.Mui-selected": {
                color: colors.primary.main,
              },
            },
          }}
        >
          <Tab
            label="YAML"
            icon={<YamlIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
          />
          <Tab
            label="JSON"
            icon={<JsonIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
          />
          <Tab
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <span>KYAML</span>
                <Chip
                  label="BETA"
                  size="small"
                  sx={{
                    height: 16,
                    fontSize: "0.65rem",
                    background: alpha(colors.accent.gold, 0.2),
                    color: colors.accent.gold,
                    border: `1px solid ${colors.accent.gold}`,
                    "& .MuiChip-label": {
                      px: 0.8,
                      py: 0,
                    },
                  }}
                />
              </Stack>
            }
            icon={<KyamlIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          position: "relative",
          minHeight: 0,
        }}
      >
        {activeTab === 0 && (
          <Box
            sx={{
              height: "100%",
              p: 2,
              position: "relative",
              overflow: "auto",
              background: alpha(colors.background.input, 0.3),
            }}
          >
            {/* Copy Button */}
            <IconButton
              size="small"
              onClick={onCopyYaml}
              aria-label="Copy YAML to clipboard"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                background: alpha(colors.primary.main, 0.1),
                color: colors.primary.main,
                "&:hover": {
                  background: alpha(colors.primary.main, 0.2),
                },
              }}
            >
              <CopyIcon fontSize="small" />
            </IconButton>

            {/* YAML Content */}
            <Box
              component="pre"
              sx={{
                margin: 0,
                fontFamily: "monospace",
                fontSize: "0.9rem",
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {renderHighlightedYaml(yamlOutput)}
            </Box>
          </Box>
        )}

        {activeTab === 1 && (
          <Box
            sx={{
              height: "100%",
              p: 2,
              position: "relative",
              overflow: "auto",
              background: alpha(colors.background.input, 0.3),
            }}
          >
            {/* Copy Button */}
            <IconButton
              size="small"
              onClick={() => {
                navigator.clipboard.writeText(jsonOutput);
              }}
              aria-label="Copy JSON to clipboard"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                background: alpha(colors.primary.main, 0.1),
                color: colors.primary.main,
                "&:hover": {
                  background: alpha(colors.primary.main, 0.2),
                },
              }}
            >
              <CopyIcon fontSize="small" />
            </IconButton>

            {/* JSON Content */}
            <Box
              component="pre"
              sx={{
                margin: 0,
                fontFamily: "monospace",
                fontSize: "0.9rem",
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {renderHighlightedJson(jsonOutput)}
            </Box>
          </Box>
        )}

        {activeTab === 2 && (
          <Box
            sx={{
              p: 2,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Stack alignItems="center" spacing={2}>
              <KyamlIcon
                sx={{ fontSize: 60, color: alpha(colors.primary.main, 0.3) }}
              />
              <Typography
                sx={{
                  color: colors.text.secondary,
                  textAlign: "center",
                  fontSize: "0.95rem",
                }}
              >
                KYAML (Kubernetes YAML) output
              </Typography>
              <Typography
                sx={{
                  color: colors.text.disabled,
                  textAlign: "center",
                  fontSize: "0.85rem",
                  fontStyle: "italic",
                }}
              >
                Coming soon - Strict YAML subset for Kubernetes
              </Typography>
            </Stack>
          </Box>
        )}
      </Box>

      {/* Actions Bar */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${alpha(colors.primary.main, 0.1)}`,
          background: alpha(colors.background.elevated, 0.3),
          flexShrink: 0,
        }}
      >
        <Stack spacing={2}>
          {validation.valid ? (
            <Button
              fullWidth
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={onDownloadYaml}
              sx={{
                background: colors.semantic.success,
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 700,
                py: 1.5,
                "&:hover": {
                  background: alpha(colors.semantic.success, 0.8),
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              Download YAML Configuration
            </Button>
          ) : (
            <Button
              fullWidth
              variant="contained"
              startIcon={<NextIcon />}
              onClick={() => {
                // Find first validation error and navigate to it
                if (validation.missing.length > 0) {
                  const firstError = validation.missing[0];
                  const match = firstError.match(/\(([^)]+)\)/);
                  if (match) {
                    const path = match[1];
                    setSelectedFieldPath(path);
                    const parts = path.split(".");
                    const pathsToExpand: string[] = [];
                    for (let i = 0; i < parts.length - 1; i++) {
                      pathsToExpand.push(parts.slice(0, i + 1).join("."));
                    }
                    setExpandedItems((prev) => [
                      ...new Set([...prev, ...pathsToExpand]),
                    ]);
                  }
                }
              }}
              sx={{
                background: colors.accent.gold,
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 700,
                py: 1.5,
                "&:hover": {
                  background: alpha(colors.accent.gold, 0.8),
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              Next Required Field ({validation.missing.length})
            </Button>
          )}
        </Stack>
      </Box>
    </Box>
  );
};
