import React from "react";
import {
  alpha,
  Box,
  Chip,
  Collapse,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Add as AddIcon,
  ChevronRight as ChevronIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandIcon,
  Search as SearchIcon,
  UnfoldLess as CollapseAllIcon,
  UnfoldMore as ExpandAllIcon,
} from "@mui/icons-material";
import type { Field } from "../../../../types";
import { colors } from "../../../../styles/tokens";
import { getFieldIcon, getFieldColor } from "../../constants/fieldConstants";

interface BuilderTreePanelProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  displayFields: Field[];
  selectedFieldPath: string | null;
  expandedItems: string[];
  isTreeExpanded: boolean;
  hoveredNode: string | null;
  onNodeClick: (field: Field, path: string) => void;
  onNodeHover: (path: string | null) => void;
  onToggleExpansion: (path: string) => void;
  onToggleTreeExpansion: () => void;
  onAddArrayItem: (path: string) => void;
  onRemoveArrayItem: (parentPath: string, itemIndex: string) => void;
}

export const BuilderTreePanel: React.FC<BuilderTreePanelProps> = ({
  searchQuery,
  onSearchChange,
  displayFields,
  selectedFieldPath,
  expandedItems,
  isTreeExpanded,
  hoveredNode,
  onNodeClick,
  onNodeHover,
  onToggleExpansion,
  onToggleTreeExpansion,
  onAddArrayItem,
  onRemoveArrayItem,
}) => {
  // Render tree node
  const renderTreeNode = (
    field: Field,
    path: string,
    depth: number = 0,
    isArrayItem: boolean = false,
    arrayIndex: number = -1,
  ) => {
    const hasChildren = field.children && field.children.length > 0;
    const isExpanded = expandedItems.includes(path);
    const isSelected = selectedFieldPath === path;
    const isHovered = hoveredNode === path;
    const isFiltered =
      searchQuery &&
      !field.name.toLowerCase().includes(searchQuery.toLowerCase());
    const isRequiredButEmpty =
      field.required &&
      !field.value &&
      field.type !== "object" &&
      field.type !== "array";
    const isArray = field.type === "array";
    const canRemove = isArrayItem && arrayIndex > 0; // Can remove all items except the first one

    if (isFiltered) return null;

    return (
      <Box key={path}>
        <ListItemButton
          onClick={() => onNodeClick(field, path)}
          onMouseEnter={() => onNodeHover(path)}
          onMouseLeave={() => onNodeHover(null)}
          sx={{
            pl: depth * 2 + 2,
            py: 0.75,
            borderRadius: "12px",
            mb: 0.5,
            background: isSelected
              ? alpha(colors.primary.main, 0.15)
              : isHovered
                ? alpha(colors.primary.main, 0.05)
                : "transparent",
            borderLeft: isSelected
              ? `3px solid ${colors.primary.main}`
              : "3px solid transparent",
            transition: "all 0.2s ease",
            "&:hover": {
              background: alpha(colors.primary.main, 0.1),
            },
          }}
        >
          {hasChildren && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpansion(path);
              }}
              aria-label={isExpanded ? "Collapse field" : "Expand field"}
              aria-expanded={isExpanded}
              sx={{
                p: 0.25,
                mr: 0.5,
                color: colors.primary.main,
              }}
            >
              {isExpanded ? (
                <ExpandIcon fontSize="small" />
              ) : (
                <ChevronIcon fontSize="small" />
              )}
            </IconButton>
          )}

          <ListItemIcon
            sx={{
              minWidth: 32,
              color: getFieldColor(field.type),
            }}
          >
            {React.createElement(getFieldIcon(field.type), {
              sx: { fontSize: 18 },
            })}
          </ListItemIcon>

          <ListItemText
            primary={
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ flex: 1 }}
              >
                <Typography
                  sx={{
                    fontWeight: isSelected ? 600 : field.required ? 500 : 400,
                    color: isSelected
                      ? colors.primary.main
                      : field.required
                        ? colors.text.primary
                        : colors.text.secondary,
                    fontSize: "0.95rem",
                    opacity: field.required ? 1 : 0.8,
                  }}
                >
                  {field.title || field.name}
                </Typography>
                {isRequiredButEmpty && (
                  <Tooltip title="Required field">
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: colors.accent.gold,
                        boxShadow: `0 0 8px ${alpha(colors.accent.gold, 0.6)}`,
                      }}
                    />
                  </Tooltip>
                )}
                {canRemove && (
                  <Tooltip title="Remove item">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        const parentPath = path.substring(
                          0,
                          path.lastIndexOf("."),
                        );
                        onRemoveArrayItem(parentPath, path);
                      }}
                      aria-label="Remove array item"
                      sx={{
                        width: 20,
                        height: 20,
                        color: colors.semantic.error,
                        opacity: 0.6,
                        "&:hover": {
                          opacity: 1,
                          background: alpha(colors.semantic.error, 0.1),
                        },
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Tooltip>
                )}
                {isArray && (
                  <>
                    <Chip
                      label={`${field.children?.length || 0}/${field.maxItems || "∞"}`}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: "0.7rem",
                        background: alpha(colors.primary.main, 0.1),
                        color: colors.primary.main,
                        border: `1px solid ${alpha(colors.primary.main, 0.3)}`,
                        "& .MuiChip-label": {
                          px: 1,
                        },
                      }}
                    />
                    <Tooltip title="Add item">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddArrayItem(path);
                        }}
                        disabled={
                          field.maxItems
                            ? (field.children?.length || 0) >= field.maxItems
                            : false
                        }
                        aria-label="Add array item"
                        sx={{
                          width: 20,
                          height: 20,
                          color: colors.primary.main,
                          "&:hover": {
                            background: alpha(colors.primary.main, 0.1),
                          },
                          "&.Mui-disabled": {
                            color: colors.text.disabled,
                          },
                        }}
                      >
                        <AddIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </Stack>
            }
          />
        </ListItemButton>

        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            {field.children!.map((child, index) => {
              const childPath = `${path}.${child.name}`;
              // For array items, override the title to show "Item 0", "Item 1", etc.
              if (field.type === "array") {
                const childWithTitle = {
                  ...child,
                  title: `Item ${index}`,
                };
                return renderTreeNode(
                  childWithTitle,
                  childPath,
                  depth + 1,
                  true,
                  index,
                );
              }
              return renderTreeNode(child, childPath, depth + 1, false, -1);
            })}
          </Collapse>
        )}
      </Box>
    );
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
      {/* Search Bar */}
      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            fullWidth
            size="small"
            placeholder="Search fields..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ color: colors.text.secondary, mr: 1 }} />
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                background: alpha(colors.background.input, 0.5),
                borderRadius: "12px",
                "& fieldset": {
                  borderColor: alpha(colors.primary.main, 0.2),
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
          <Tooltip title={isTreeExpanded ? "Collapse All" : "Expand All"}>
            <IconButton
              size="small"
              onClick={onToggleTreeExpansion}
              aria-label={
                isTreeExpanded ? "Collapse all fields" : "Expand all fields"
              }
              sx={{
                color: colors.primary.main,
                background: alpha(colors.primary.main, 0.1),
                "&:hover": {
                  background: alpha(colors.primary.main, 0.2),
                },
              }}
            >
              {isTreeExpanded ? (
                <CollapseAllIcon fontSize="small" />
              ) : (
                <ExpandAllIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* Tree Content */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          px: 1,
          pb: 2,
          "&::-webkit-scrollbar": {
            width: 8,
          },
          "&::-webkit-scrollbar-track": {
            background: alpha(colors.background.elevated, 0.5),
            borderRadius: 4,
          },
          "&::-webkit-scrollbar-thumb": {
            background: alpha(colors.primary.main, 0.3),
            borderRadius: 4,
            "&:hover": {
              background: alpha(colors.primary.main, 0.5),
            },
          },
        }}
      >
        <List>
          {displayFields.map((field) => {
            const path = field.name;
            return renderTreeNode(field, path);
          })}
        </List>
      </Box>
    </Box>
  );
};
