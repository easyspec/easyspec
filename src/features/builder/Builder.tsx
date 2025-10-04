import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import {
  Share as ShareIcon,
  Layers as LayersIcon,
  Edit as EditIcon,
  Visibility as PreviewIcon,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { decodeURLToForm } from "../../utils/formUrlEncoder";
import { formStorage } from "../../utils/formStorage";
import { landingColors } from "../../styles/landing.styles";
import { BuilderTreePanel } from "./components/panels/BuilderTreePanel";
import { BuilderEditor } from "./components/panels/BuilderEditor";
import { BuilderPreview } from "./components/panels/BuilderPreview";
import { JsonEditDialog } from "./components/dialogs/JsonEditDialog";
import { ImportDialog } from "./components/dialogs/ImportDialog";
import { AnonymousShareDialog } from "./components/dialogs/AnonymousShareDialog";
import { ConfirmReplaceDialog } from "./components/dialogs/ConfirmReplaceDialog";
import { BuilderHeader } from "./components/BuilderHeader";
import { BackgroundAnimation } from "./components/BackgroundAnimation";
import { FabMenu } from "./components/FabMenu";
import { useFieldManagement } from "./hooks/useFieldManagement";
import { useTreeNavigation } from "./hooks/useTreeNavigation";
import { DEFAULT_FORM_FIELDS } from "../../constants/fieldConfig";
import { EXAMPLE_FORM_FIELDS } from "../../constants/exampleForm";
import type { Field } from "../../types";

export default function Builder() {
  const { encodedForm } = useParams<{ encodedForm?: string }>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("md", "lg"));

  // UI State
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [previewTab, setPreviewTab] = useState(0);

  // Dialog states
  const [jsonDialogOpen, setJsonDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [anonymousShareOpen, setAnonymousShareOpen] = useState(false);
  const [confirmReplaceOpen, setConfirmReplaceOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    "new" | "example" | "import" | null
  >(null);

  // Core hooks
  const {
    fields,
    setFields,
    selectedField,
    selectedFieldPath,
    setSelectedFieldPath,
    validationError,
    validation,
    yamlOutput,
    jsonOutput,
    handleUpdateValue,
    handleAddArrayItem,
    handleRemoveArrayItem,
    importFromJson,
    importFromYaml,
    exportAsYaml,
    getFilteredFields,
  } = useFieldManagement(DEFAULT_FORM_FIELDS);

  const {
    expandedItems,
    setExpandedItems,
    toggleNodeExpansion,
    handleToggleTreeExpansion,
    isTreeExpanded,
  } = useTreeNavigation();

  // Filtered fields
  const displayFields = useMemo(
    () => getFilteredFields(searchQuery),
    [searchQuery, getFilteredFields],
  );

  // Auto-save to localStorage
  useEffect(() => {
    if (!encodedForm && fields.length > 0) {
      formStorage.save(fields);
    }
  }, [fields, encodedForm]);

  // Load form from URL or localStorage
  useEffect(() => {
    if (encodedForm) {
      // Load from encoded URL (public share)
      try {
        const decodedForm = decodeURLToForm(encodedForm);
        if (decodedForm) {
          setFields(decodedForm.fields);
        }
      } catch {
        enqueueSnackbar("Invalid form link", { variant: "error" });
      }
    } else {
      // Load from localStorage on first mount
      const savedForm = formStorage.load();
      if (savedForm && savedForm.length > 0) {
        setFields(savedForm);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encodedForm]);

  // Auto-expand first level on load
  useEffect(() => {
    if (fields?.length > 0) {
      const firstLevelParents = fields
        .filter((field) => field.children && field.children.length > 0)
        .map((field) => field.name);

      if (firstLevelParents.length > 0) {
        setExpandedItems((prev) => [
          ...new Set([...prev, ...firstLevelParents]),
        ]);
      }
    }
  }, [fields, setExpandedItems]);

  // Handlers
  const handleJsonSave = (updatedJson: string) => {
    const result = importFromJson(updatedJson);
    if (result.success && result.fields) {
      setFields(result.fields);
    } else {
      enqueueSnackbar(result.error || "Invalid JSON format", {
        variant: "error",
      });
    }
  };

  const handleImport = (content: string, format: "json" | "yaml") => {
    try {
      const result =
        format === "yaml" ? importFromYaml(content) : importFromJson(content);

      if (result.success && result.fields) {
        setFields(result.fields);
        setSelectedFieldPath(null);

        const firstLevelPaths = result.fields
          .filter((f: Field) => f.children && f.children.length > 0)
          .map((f: Field) => f.name);
        setExpandedItems(firstLevelPaths);
        setImportDialogOpen(false);
      } else {
        enqueueSnackbar(
          result.error || `Invalid ${format.toUpperCase()} format`,
          {
            variant: "error",
          },
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      enqueueSnackbar(`Failed to import: ${errorMessage}`, {
        variant: "error",
      });
    }
  };

  // Confirmation handlers
  const executeNewForm = useCallback(() => {
    setFields(DEFAULT_FORM_FIELDS);
    setSelectedFieldPath(null);
    setExpandedItems([]);
    formStorage.clear();
  }, [setFields, setSelectedFieldPath, setExpandedItems]);

  const requestNewForm = useCallback(() => {
    if (formStorage.hasDraft() && fields.length > 0) {
      setPendingAction("new");
      setConfirmReplaceOpen(true);
    } else {
      executeNewForm();
    }
  }, [fields.length, executeNewForm]);

  const executeExample = useCallback(() => {
    setFields(EXAMPLE_FORM_FIELDS);
    setSelectedFieldPath(null);
    setExpandedItems([]);
  }, [setFields, setSelectedFieldPath, setExpandedItems]);

  const requestExample = useCallback(() => {
    if (formStorage.hasDraft() && fields.length > 0) {
      setPendingAction("example");
      setConfirmReplaceOpen(true);
    } else {
      executeExample();
    }
  }, [fields.length, executeExample]);

  const requestImport = useCallback(() => {
    if (formStorage.hasDraft() && fields.length > 0) {
      setPendingAction("import");
      setConfirmReplaceOpen(true);
    } else {
      setImportDialogOpen(true);
    }
  }, [fields.length]);

  const handleConfirmReplace = () => {
    setConfirmReplaceOpen(false);
    if (pendingAction === "new") {
      executeNewForm();
    } else if (pendingAction === "example") {
      executeExample();
    } else if (pendingAction === "import") {
      setImportDialogOpen(true);
    }
    setPendingAction(null);
  };

  const handleCancelReplace = () => {
    setConfirmReplaceOpen(false);
    setPendingAction(null);
  };

  const fabActions = [
    {
      icon: <ShareIcon />,
      label: "Share",
      onClick: () => {},
      color: landingColors.accent.gold,
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: landingColors.background.gradient,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <BackgroundAnimation />

      <BuilderHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onNewForm={requestNewForm}
        onExample={requestExample}
        onImport={requestImport}
        onEditForm={() => setJsonDialogOpen(true)}
        onShare={() => setAnonymousShareOpen(true)}
        showTabs={isMobile}
      />

      {/* Main Content */}
      {!isMobile ? (
        // Desktop Layout
        <Box
          sx={{
            display: "flex",
            height: "calc(100vh - 64px)",
            gap: 2,
            p: 2,
          }}
        >
          {/* Tree Panel */}
          <Paper
            sx={{
              width: "25%",
              minWidth: 320,
              maxWidth: 400,
              height: "100%",
              background: alpha(landingColors.background.paper, 0.7),
              backdropFilter: "blur(10px)",
              borderRadius: "16px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                p: 2,
                borderBottom: `1px solid ${alpha(landingColors.primary.main, 0.1)}`,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <LayersIcon sx={{ color: landingColors.accent.teal }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Form Structure
                </Typography>
              </Stack>
            </Box>
            <BuilderTreePanel
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              displayFields={displayFields}
              selectedFieldPath={selectedFieldPath}
              expandedItems={expandedItems}
              isTreeExpanded={isTreeExpanded}
              hoveredNode={hoveredNode}
              onNodeClick={(_, path) => setSelectedFieldPath(path)}
              onNodeHover={setHoveredNode}
              onToggleExpansion={toggleNodeExpansion}
              onToggleTreeExpansion={() =>
                handleToggleTreeExpansion(displayFields)
              }
              onAddArrayItem={handleAddArrayItem}
              onRemoveArrayItem={handleRemoveArrayItem}
            />
          </Paper>

          {/* Editor Panel */}
          <Paper
            sx={{
              flex: 1,
              height: "100%",
              background: alpha(landingColors.background.paper, 0.7),
              backdropFilter: "blur(10px)",
              borderRadius: "16px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                p: 2,
                borderBottom: `1px solid ${alpha(landingColors.primary.main, 0.1)}`,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <EditIcon sx={{ color: landingColors.primary.main }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Field Editor
                </Typography>
              </Stack>
            </Box>
            <BuilderEditor
              selectedField={selectedField}
              selectedFieldPath={selectedFieldPath}
              validationError={validationError}
              onUpdateValue={handleUpdateValue}
              onAddArrayItem={handleAddArrayItem}
              onRemoveArrayItem={handleRemoveArrayItem}
              onClose={() => setSelectedFieldPath(null)}
            />
          </Paper>

          {/* Preview Panel */}
          <Paper
            sx={{
              width: "30%",
              minWidth: 360,
              maxWidth: 450,
              height: "100%",
              background: alpha(landingColors.background.paper, 0.7),
              backdropFilter: "blur(10px)",
              borderRadius: "16px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                p: 2,
                borderBottom: `1px solid ${alpha(landingColors.primary.main, 0.1)}`,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <PreviewIcon sx={{ color: landingColors.accent.mint }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Live Preview
                </Typography>
              </Stack>
            </Box>
            <BuilderPreview
              activeTab={previewTab}
              onTabChange={setPreviewTab}
              yamlOutput={yamlOutput}
              jsonOutput={jsonOutput}
              validation={validation}
              onCopyYaml={() => navigator.clipboard.writeText(yamlOutput)}
              onDownloadYaml={exportAsYaml}
              setSelectedFieldPath={setSelectedFieldPath}
              setExpandedItems={setExpandedItems}
            />
          </Paper>
        </Box>
      ) : (
        // Mobile Layout
        <Box sx={{ height: "calc(100vh - 112px)", overflow: "hidden" }}>
          {activeTab === 0 && (
            <Box sx={{ height: "100%", p: 2 }}>
              <BuilderTreePanel
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                displayFields={displayFields}
                selectedFieldPath={selectedFieldPath}
                expandedItems={expandedItems}
                isTreeExpanded={isTreeExpanded}
                hoveredNode={hoveredNode}
                onNodeClick={(_, path) => setSelectedFieldPath(path)}
                onNodeHover={setHoveredNode}
                onToggleExpansion={toggleNodeExpansion}
                onToggleTreeExpansion={() =>
                  handleToggleTreeExpansion(displayFields)
                }
                onAddArrayItem={handleAddArrayItem}
                onRemoveArrayItem={handleRemoveArrayItem}
              />
            </Box>
          )}
          {activeTab === 1 && (
            <Box sx={{ height: "100%", p: 2 }}>
              <BuilderEditor
                selectedField={selectedField}
                selectedFieldPath={selectedFieldPath}
                validationError={validationError}
                onUpdateValue={handleUpdateValue}
                onAddArrayItem={handleAddArrayItem}
                onRemoveArrayItem={handleRemoveArrayItem}
                onClose={() => setSelectedFieldPath(null)}
              />
            </Box>
          )}
          {activeTab === 2 && (
            <Box sx={{ height: "100%", p: 2 }}>
              <BuilderPreview
                activeTab={previewTab}
                onTabChange={setPreviewTab}
                yamlOutput={yamlOutput}
                jsonOutput={jsonOutput}
                validation={validation}
                onCopyYaml={() => navigator.clipboard.writeText(yamlOutput)}
                onDownloadYaml={exportAsYaml}
                setSelectedFieldPath={setSelectedFieldPath}
                setExpandedItems={setExpandedItems}
              />
            </Box>
          )}
        </Box>
      )}

      {/* Mobile FAB */}
      {(isMobile || isTablet) && <FabMenu actions={fabActions} />}

      {/* Dialogs */}
      <JsonEditDialog
        open={jsonDialogOpen}
        onClose={() => setJsonDialogOpen(false)}
        onSave={handleJsonSave}
        initialContent={JSON.stringify(fields, null, 2)}
      />

      <ImportDialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        onImport={handleImport}
      />

      <AnonymousShareDialog
        open={anonymousShareOpen}
        onClose={() => setAnonymousShareOpen(false)}
        fields={fields}
        formName="Untitled Form"
        formDescription=""
      />

      <ConfirmReplaceDialog
        open={confirmReplaceOpen}
        onConfirm={handleConfirmReplace}
        onCancel={handleCancelReplace}
        action={pendingAction || "new"}
      />
    </Box>
  );
}
