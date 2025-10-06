import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Fade,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material";
import {
  ArrowForward as ArrowIcon,
  AutoAwesome as SparkleIcon,
  Build as BuildIcon,
  Check as CheckIcon,
  Code as CodeIcon,
  ContentCopy as CopyIcon,
  Description as DocIcon,
  Lightbulb as TipIcon,
} from "@mui/icons-material";
import Header from "../landing/components/Header";
import Footer from "../landing/components/Footer";
import {
  landingAnimations,
  landingColors,
  landingStyles,
} from "../../styles/landing.styles";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`doc-tabpanel-${index}`}
      aria-labelledby={`doc-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 4 }}>{children}</Box>}
    </Box>
  );
}

const DocumentationPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    setIsVisible(true);
    // Inject animations
    const style = document.createElement("style");
    style.textContent = Object.values(landingAnimations).join("\n");
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeBlock: React.FC<{ code: string; id: string; title?: string }> = ({
    code,
    id,
    title,
  }) => (
    <Paper
      sx={{
        p: 3,
        background: alpha(landingColors.background.paper, 0.8),
        backdropFilter: "blur(20px)",
        border: `1px solid ${alpha(landingColors.primary.main, 0.3)}`,
        borderRadius: "16px",
        position: "relative",
        mb: 3,
      }}
    >
      {title && (
        <Typography
          variant="subtitle1"
          sx={{
            mb: 2,
            fontWeight: 600,
            color: landingColors.primary.light,
          }}
        >
          {title}
        </Typography>
      )}
      <Box
        sx={{
          p: 2,
          background: landingColors.background.elevated,
          borderRadius: "12px",
          position: "relative",
        }}
      >
        <pre
          style={{
            margin: 0,
            fontSize: "0.875rem",
            fontFamily: "monospace",
            color: alpha("#FFFFFF", 0.8),
            overflow: "auto",
            maxHeight: "400px",
          }}
        >
          <code>{code}</code>
        </pre>
        <Tooltip title={copiedCode === id ? "Copied!" : "Copy code"}>
          <IconButton
            size="small"
            onClick={() => handleCopy(code, id)}
            aria-label={copiedCode === id ? "Code copied" : "Copy code"}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color:
                copiedCode === id
                  ? landingColors.primary.main
                  : alpha("#FFFFFF", 0.5),
              background: alpha(landingColors.background.default, 0.5),
              "&:hover": {
                background: alpha(landingColors.primary.main, 0.1),
              },
            }}
          >
            {copiedCode === id ? (
              <CheckIcon fontSize="small" />
            ) : (
              <CopyIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );

  // Documentation content data
  const fieldTypes = [
    {
      type: "text",
      description: "Single-line text input",
      example: '"type": "text"',
    },
    {
      type: "number",
      description: "Numeric input",
      example: '"type": "number"',
    },
    {
      type: "boolean",
      description: "True/false toggle switch",
      example: '"type": "boolean"',
    },
    {
      type: "enum",
      description: "Dropdown select (single choice)",
      example: '"type": "enum"',
    },
    {
      type: "multiselect",
      description: "Checkbox list (multiple choices)",
      example: '"type": "multiselect"',
    },
    {
      type: "object",
      description: "Container for nested fields",
      example: '"type": "object"',
    },
    {
      type: "array",
      description: "Dynamic list of items",
      example: '"type": "array"',
    },
  ];

  const fieldProperties = [
    {
      property: "name",
      type: "string",
      required: true,
      description: "Unique identifier for the field",
    },
    {
      property: "type",
      type: "FieldType",
      required: true,
      description: "Field type (text, number, boolean, etc.)",
    },
    {
      property: "value",
      type: "any",
      required: false,
      description: "Default value for the field",
    },
    {
      property: "placeholder",
      type: "string",
      required: false,
      description: "Placeholder text for empty fields",
    },
    {
      property: "title",
      type: "string",
      required: false,
      description: "Display name for the field",
    },
    {
      property: "description",
      type: "string",
      required: false,
      description: "Help text explaining the field",
    },
    {
      property: "required",
      type: "boolean",
      required: false,
      description: "Whether the field must have a value",
    },
    {
      property: "regex",
      type: "string",
      required: false,
      description: "Validation pattern (regular expression)",
    },
    {
      property: "validationMessage",
      type: "string",
      required: false,
      description: "Error message for invalid input",
    },
    {
      property: "options",
      type: "SelectOption[]",
      required: false,
      description: "Options for enum/multiselect fields",
    },
    {
      property: "children",
      type: "Field[]",
      required: false,
      description: "Nested fields for object/array types",
    },
    {
      property: "maxItems",
      type: "number",
      required: false,
      description: "Maximum items allowed in arrays",
    },
    {
      property: "links",
      type: "FieldLink[]",
      required: false,
      description: "Related documentation links",
    },
  ];

  const exampleTextField = `{
  "name": "username",
  "type": "text",
  "title": "Username",
  "placeholder": "john_doe",
  "description": "Your unique username",
  "required": true,
  "regex": "^[a-zA-Z0-9_]{3,20}$",
  "validationMessage": "3-20 characters, letters, numbers, and underscores only",
  "links": [
    {
      "text": "Username guidelines",
      "url": "https://example.com/docs/usernames"
    }
  ]
}`;

  const exampleEnumField = `{
  "name": "environment",
  "type": "enum",
  "title": "Environment",
  "placeholder": "Select environment",
  "description": "Deployment environment",
  "required": true,
  "options": [
    {
      "value": "dev",
      "label": "Development",
      "description": "Local development"
    },
    {
      "value": "staging",
      "label": "Staging",
      "description": "Testing environment"
    },
    {
      "value": "prod",
      "label": "Production",
      "description": "Live environment"
    }
  ]
}`;

  const exampleObjectField = `{
  "name": "database",
  "type": "object",
  "title": "Database Configuration",
  "description": "Database connection settings",
  "children": [
    {
      "name": "host",
      "type": "text",
      "title": "Host",
      "placeholder": "localhost",
      "required": true
    },
    {
      "name": "port",
      "type": "number",
      "title": "Port",
      "value": 5432,
      "required": true
    },
    {
      "name": "ssl",
      "type": "boolean",
      "title": "Use SSL",
      "value": false
    }
  ]
}`;

  const completeExample = `[
  {
    "name": "apiConfig",
    "type": "object",
    "title": "API Configuration",
    "description": "Main API settings",
    "children": [
      {
        "name": "serviceName",
        "type": "text",
        "title": "Service Name",
        "placeholder": "my-api",
        "required": true,
        "regex": "^[a-z][a-z0-9-]*$",
        "validationMessage": "Lowercase letters, numbers, and hyphens only"
      },
      {
        "name": "environment",
        "type": "enum",
        "title": "Environment",
        "required": true,
        "options": [
          { "value": "dev", "label": "Development" },
          { "value": "staging", "label": "Staging" },
          { "value": "prod", "label": "Production" }
        ]
      },
      {
        "name": "features",
        "type": "multiselect",
        "title": "Features",
        "options": [
          { "value": "logging", "label": "Logging" },
          { "value": "metrics", "label": "Metrics" },
          { "value": "tracing", "label": "Tracing" }
        ]
      }
    ]
  }
]`;

  return (
    <Box sx={landingStyles.mainContainer}>
      {/* Animated Background Mesh */}
      <Box sx={landingStyles.backgroundMesh} />

      <Header />

      {/* Hero Section */}
      <Container
        maxWidth="lg"
        sx={{ pt: 20, pb: 10, position: "relative", zIndex: 1 }}
      >
        <Fade in={isVisible} timeout={1000}>
          <Stack spacing={4} alignItems="center" textAlign="center">
            <Chip
              label="Documentation"
              size="small"
              sx={landingStyles.hero.badge}
            />
            <Typography
              variant="h1"
              sx={{
                ...landingStyles.hero.title,
                fontSize: { xs: "2.5rem", md: "3.5rem" },
              }}
            >
              Master Infrastructure Forms
              <Box component="span" sx={{ display: "block", color: "white" }}>
                With EasySpec
              </Box>
            </Typography>
            <Typography variant="h5" sx={landingStyles.hero.subtitle}>
              Everything you need to know about creating powerful forms and
              collecting data
            </Typography>
          </Stack>
        </Fade>
      </Container>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ pb: 10, position: "relative", zIndex: 1 }}>
        <Paper
          sx={{
            background: alpha(landingColors.background.paper, 0.8),
            backdropFilter: "blur(20px)",
            border: `1px solid ${alpha(landingColors.primary.main, 0.3)}`,
            borderRadius: "24px",
            overflow: "hidden",
          }}
        >
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: `1px solid ${alpha(
                landingColors.primary.main,
                0.2,
              )}`,
              background: landingColors.background.elevated,
              "& .MuiTab-root": {
                color: alpha("#FFFFFF", 0.7),
                textTransform: "none",
                fontWeight: 500,
                fontSize: "1rem",
                px: 3,
                "&.Mui-selected": {
                  color: landingColors.primary.main,
                },
                "&:hover": {
                  color: landingColors.primary.light,
                },
              },
              "& .MuiTabs-indicator": {
                backgroundColor: landingColors.primary.main,
                height: 3,
              },
            }}
          >
            <Tab
              label="Getting Started"
              icon={<SparkleIcon />}
              iconPosition="start"
            />
            <Tab label="Field Types" icon={<CodeIcon />} iconPosition="start" />
            <Tab label="Properties" icon={<BuildIcon />} iconPosition="start" />
            <Tab label="Examples" icon={<DocIcon />} iconPosition="start" />
            <Tab
              label="Best Practices"
              icon={<TipIcon />}
              iconPosition="start"
            />
            <Tab
              label="Common Fields"
              icon={<CodeIcon />}
              iconPosition="start"
            />
          </Tabs>

          <Box sx={{ px: 4 }}>
            {/* Getting Started Tab */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={4}>
                {[
                  {
                    icon: <DocIcon />,
                    title: "1. Build Form",
                    description:
                      "Define your form structure in JSON. Set field types, validation rules, and nested objects.",
                  },
                  {
                    icon: <BuildIcon />,
                    title: "2. Share Link",
                    description:
                      'Click "Public Link" to get a shareable URL. The form definition is encoded in the link itself.',
                  },
                  {
                    icon: <CodeIcon />,
                    title: "3. Download YAML",
                    description:
                      "Recipients fill the form and download clean YAML or JSON files. No server, everything stays local.",
                  },
                ].map((step, index) => (
                  <Grid key={index} size={{ xs: 12, md: 4 }}>
                    <Card sx={landingStyles.featureCard}>
                      <CardContent sx={{ p: 3 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: "12px",
                            background: landingColors.primary.gradient,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 2,
                          }}
                        >
                          {React.cloneElement(step.icon, {
                            sx: { color: "white" },
                          })}
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, mb: 1, color: "white" }}
                        >
                          {step.title}
                        </Typography>
                        <Typography sx={{ color: alpha("#FFFFFF", 0.6) }}>
                          {step.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ mt: 6 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: "white",
                    mb: 3,
                  }}
                >
                  Quick Start Guide
                </Typography>
                <List>
                  {[
                    {
                      primary: "Open the Builder",
                      secondary:
                        'Go to /builder or click "Create Form" from the home page',
                    },
                    {
                      primary: "Edit JSON Structure",
                      secondary:
                        'Click "Edit Form" to modify the JSON schema. Define fields, types, and validation rules',
                    },
                    {
                      primary: "Get Share Link",
                      secondary:
                        'Click "Public Link" button. The form is encoded in the URL - copy and share it',
                    },
                    {
                      primary: "Recipient Downloads YAML",
                      secondary:
                        "They open the link, fill the form, and download the YAML file to send back to you",
                    },
                    {
                      primary: "Auto-Save",
                      secondary:
                        "Your work is automatically saved in your browser's localStorage. Close the tab anytime - it'll be there when you return",
                    },
                  ].map((item, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <ArrowIcon sx={{ color: landingColors.primary.main }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.primary}
                        secondary={item.secondary}
                        primaryTypographyProps={{
                          sx: { color: "white", fontWeight: 600 },
                        }}
                        secondaryTypographyProps={{
                          sx: { color: alpha("#FFFFFF", 0.6) },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </TabPanel>

            {/* Field Types Tab */}
            <TabPanel value={tabValue} index={1}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "white",
                  mb: 4,
                }}
              >
                Available Field Types
              </Typography>

              <TableContainer
                component={Paper}
                sx={{
                  background: alpha(landingColors.background.elevated, 0.5),
                  border: `1px solid ${alpha(landingColors.primary.main, 0.2)}`,
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{ background: landingColors.background.elevated }}
                    >
                      <TableCell
                        sx={{
                          color: landingColors.primary.light,
                          fontWeight: 600,
                        }}
                      >
                        Type
                      </TableCell>
                      <TableCell
                        sx={{
                          color: landingColors.primary.light,
                          fontWeight: 600,
                        }}
                      >
                        Description
                      </TableCell>
                      <TableCell
                        sx={{
                          color: landingColors.primary.light,
                          fontWeight: 600,
                        }}
                      >
                        Example
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fieldTypes.map((field) => (
                      <TableRow key={field.type}>
                        <TableCell>
                          <Chip
                            label={field.type}
                            size="small"
                            sx={{
                              background: alpha(
                                landingColors.primary.main,
                                0.2,
                              ),
                              color: landingColors.primary.main,
                              border: `1px solid ${landingColors.primary.main}`,
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: alpha("#FFFFFF", 0.8) }}>
                          {field.description}
                        </TableCell>
                        <TableCell>
                          <code
                            style={{
                              fontSize: "0.875rem",
                              fontFamily: "monospace",
                              color: landingColors.accent.teal,
                            }}
                          >
                            {field.example}
                          </code>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            {/* Properties Tab */}
            <TabPanel value={tabValue} index={2}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "white",
                  mb: 4,
                }}
              >
                Field Properties Reference
              </Typography>

              <TableContainer
                component={Paper}
                sx={{
                  background: alpha(landingColors.background.elevated, 0.5),
                  border: `1px solid ${alpha(landingColors.primary.main, 0.2)}`,
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{ background: landingColors.background.elevated }}
                    >
                      <TableCell
                        sx={{
                          color: landingColors.primary.light,
                          fontWeight: 600,
                        }}
                      >
                        Property
                      </TableCell>
                      <TableCell
                        sx={{
                          color: landingColors.primary.light,
                          fontWeight: 600,
                        }}
                      >
                        Type
                      </TableCell>
                      <TableCell
                        sx={{
                          color: landingColors.primary.light,
                          fontWeight: 600,
                        }}
                      >
                        Required
                      </TableCell>
                      <TableCell
                        sx={{
                          color: landingColors.primary.light,
                          fontWeight: 600,
                        }}
                      >
                        Description
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fieldProperties.map((prop) => (
                      <TableRow key={prop.property}>
                        <TableCell>
                          <code
                            style={{
                              fontFamily: "monospace",
                              fontSize: "0.875rem",
                              fontWeight: 600,
                              color: landingColors.accent.lime,
                            }}
                          >
                            {prop.property}
                          </code>
                        </TableCell>
                        <TableCell sx={{ color: alpha("#FFFFFF", 0.7) }}>
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: "monospace",
                              color: landingColors.accent.teal,
                            }}
                          >
                            {prop.type}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {prop.required ? (
                            <Chip
                              label="Required"
                              size="small"
                              sx={{
                                background: alpha(
                                  landingColors.accent.gold,
                                  0.2,
                                ),
                                color: landingColors.accent.gold,
                                border: `1px solid ${landingColors.accent.gold}`,
                              }}
                            />
                          ) : (
                            <Chip
                              label="Optional"
                              size="small"
                              sx={{
                                background: alpha(
                                  landingColors.accent.lime,
                                  0.1,
                                ),
                                color: landingColors.accent.lime,
                                border: `1px solid ${landingColors.accent.lime}`,
                              }}
                            />
                          )}
                        </TableCell>
                        <TableCell sx={{ color: alpha("#FFFFFF", 0.8) }}>
                          {prop.description}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            {/* Examples Tab */}
            <TabPanel value={tabValue} index={3}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "white",
                  mb: 2,
                }}
              >
                Field Examples
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: alpha("#FFFFFF", 0.7),
                  mb: 4,
                }}
              >
                Examples demonstrating each field type and its capabilities.
              </Typography>

              <Grid container spacing={3}>
                {/* Text Field */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography
                    variant="h6"
                    sx={{ color: landingColors.accent.teal, mb: 2 }}
                  >
                    Text Field
                  </Typography>
                  <CodeBlock code={exampleTextField} id="text-example" />
                </Grid>

                {/* Number Field */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography
                    variant="h6"
                    sx={{ color: landingColors.accent.teal, mb: 2 }}
                  >
                    Number Field
                  </Typography>
                  <CodeBlock
                    code={`{
  "name": "port",
  "type": "number",
  "title": "Port",
  "value": 3000,
  "description": "Service port number"
}`}
                    id="number-example"
                  />
                </Grid>

                {/* Boolean Field */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography
                    variant="h6"
                    sx={{ color: landingColors.accent.teal, mb: 2 }}
                  >
                    Boolean Field
                  </Typography>
                  <CodeBlock
                    code={`{
  "name": "debugMode",
  "type": "boolean",
  "title": "Debug Mode",
  "value": false,
  "description": "Enable verbose logging"
}`}
                    id="boolean-example"
                  />
                </Grid>

                {/* Enum Field */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography
                    variant="h6"
                    sx={{ color: landingColors.accent.teal, mb: 2 }}
                  >
                    Enum (Dropdown)
                  </Typography>
                  <CodeBlock code={exampleEnumField} id="enum-example" />
                </Grid>

                {/* Multiselect Field */}
                <Grid size={12}>
                  <Typography
                    variant="h6"
                    sx={{ color: landingColors.accent.teal, mb: 2 }}
                  >
                    Multiselect (Checkboxes)
                  </Typography>
                  <CodeBlock
                    code={`{
  "name": "features",
  "type": "multiselect",
  "title": "Features",
  "description": "Enable features",
  "options": [
    { "value": "auth", "label": "Authentication" },
    { "value": "api", "label": "REST API" },
    { "value": "websockets", "label": "WebSockets" },
    { "value": "cache", "label": "Caching" },
    { "value": "metrics", "label": "Metrics" }
  ],
  "value": ["auth", "api"]
}`}
                    id="multiselect-example"
                  />
                </Grid>

                {/* Object Field */}
                <Grid size={12}>
                  <Typography
                    variant="h6"
                    sx={{ color: landingColors.accent.teal, mb: 2 }}
                  >
                    Object (Nested Fields)
                  </Typography>
                  <CodeBlock code={exampleObjectField} id="object-example" />
                </Grid>

                {/* Array Field */}
                <Grid size={12}>
                  <Typography
                    variant="h6"
                    sx={{ color: landingColors.accent.teal, mb: 2 }}
                  >
                    Array (Dynamic List)
                  </Typography>
                  <CodeBlock
                    code={`{
  "name": "endpoints",
  "type": "array",
  "title": "API Endpoints",
  "description": "List of endpoints",
  "maxItems": 5,
  "children": [
    {
      "name": "0",
      "type": "object",
      "title": "Endpoint",
      "children": [
        {
          "name": "path",
          "type": "text",
          "title": "Path",
          "placeholder": "/api/users",
          "required": true
        },
        {
          "name": "method",
          "type": "enum",
          "title": "Method",
          "options": [
            { "value": "GET", "label": "GET" },
            { "value": "POST", "label": "POST" },
            { "value": "PUT", "label": "PUT" },
            { "value": "DELETE", "label": "DELETE" }
          ],
          "value": "GET"
        },
        {
          "name": "public",
          "type": "boolean",
          "title": "Public",
          "value": false
        }
      ]
    }
  ]
}`}
                    id="array-example"
                  />
                </Grid>

                <Grid size={12}>
                  <Divider
                    sx={{
                      borderColor: alpha(landingColors.primary.main, 0.2),
                      my: 4,
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{ color: landingColors.accent.lime, mb: 2 }}
                  >
                    Complete Form Example
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: alpha("#FFFFFF", 0.6), mb: 2 }}
                  >
                    A full form demonstrating all field types working together
                  </Typography>
                  <CodeBlock
                    code={completeExample}
                    id="complete-example"
                    title="Full Form Structure (JSON)"
                  />
                </Grid>
              </Grid>
            </TabPanel>

            {/* Best Practices Tab */}
            <TabPanel value={tabValue} index={4}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "white",
                  mb: 4,
                }}
              >
                Tips & Best Practices
              </Typography>

              <Grid container spacing={3}>
                {[
                  {
                    title: "Use Descriptive Names",
                    description:
                      'Use clear, descriptive names for fields. Prefer "databaseHost" over "dbh" or "host".',
                  },
                  {
                    title: "Add Helpful Descriptions",
                    description:
                      "Always include descriptions to guide users on what each field does and expects.",
                  },
                  {
                    title: "Set Sensible Defaults",
                    description:
                      "Provide default values where appropriate to make form filling easier.",
                  },
                  {
                    title: "Use Validation Wisely",
                    description:
                      "Add regex validation for critical fields, but include clear error messages.",
                  },
                  {
                    title: "Group Related Fields",
                    description:
                      "Use object types to logically group related form fields together.",
                  },
                  {
                    title: "Limit Array Items",
                    description:
                      "Use maxItems on arrays to prevent unlimited growth and maintain performance.",
                  },
                ].map((tip, index) => (
                  <Grid key={index} size={{ xs: 12, md: 6 }}>
                    <Paper
                      sx={{
                        p: 3,
                        background: alpha(
                          landingColors.background.elevated,
                          0.8,
                        ),
                        backdropFilter: "blur(20px)",
                        border: `1px solid ${alpha(
                          landingColors.primary.main,
                          0.2,
                        )}`,
                        borderRadius: "16px",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          border: `1px solid ${landingColors.primary.main}`,
                        },
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="flex-start"
                      >
                        <TipIcon
                          sx={{ color: landingColors.primary.main, mt: 0.5 }}
                        />
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, color: "white", mb: 1 }}
                          >
                            {tip.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: alpha("#FFFFFF", 0.7) }}
                          >
                            {tip.description}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              <Box
                sx={{
                  mt: 6,
                  p: 3,
                  background: alpha(landingColors.primary.main, 0.1),
                  border: `1px solid ${landingColors.primary.main}`,
                  borderRadius: "16px",
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <SparkleIcon
                    sx={{ color: landingColors.primary.main, mt: 0.5 }}
                  />
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "white", mb: 1 }}
                    >
                      Pro Tip: Form Templates
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: alpha("#FFFFFF", 0.8) }}
                    >
                      You can import existing JSON form structures and reuse
                      them as templates. Create once, share many times - perfect
                      for standardizing data collection across your
                      organization.
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </TabPanel>

            {/* Common Fields Tab */}
            <TabPanel value={tabValue} index={5}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "white",
                  mb: 2,
                }}
              >
                Common Field Patterns
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: alpha("#FFFFFF", 0.7),
                  mb: 4,
                }}
              >
                Ready-to-use field patterns with built-in validation regex for
                common use cases.
              </Typography>

              <Grid container spacing={3}>
                {/* Email */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper
                    sx={{
                      p: 3,
                      background: alpha(landingColors.background.elevated, 0.8),
                      backdropFilter: "blur(20px)",
                      border: `1px solid ${alpha(landingColors.primary.main, 0.2)}`,
                      borderRadius: "16px",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "white", mb: 2 }}
                    >
                      Email Address
                    </Typography>
                    <CodeBlock
                      id="common-email"
                      code={`{
  "name": "email",
  "type": "text",
  "title": "Email Address",
  "placeholder": "user@example.com",
  "description": "Valid email address",
  "required": true,
  "regex": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}$",
  "validationMessage": "Must be a valid email address"
}`}
                    />
                  </Paper>
                </Grid>

                {/* Username */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper
                    sx={{
                      p: 3,
                      background: alpha(landingColors.background.elevated, 0.8),
                      backdropFilter: "blur(20px)",
                      border: `1px solid ${alpha(landingColors.primary.main, 0.2)}`,
                      borderRadius: "16px",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "white", mb: 2 }}
                    >
                      Username
                    </Typography>
                    <CodeBlock
                      id="common-username"
                      code={`{
  "name": "username",
  "type": "text",
  "title": "Username",
  "placeholder": "john_doe",
  "description": "Alphanumeric with underscores",
  "required": true,
  "regex": "^[a-zA-Z0-9_]{3,20}$",
  "validationMessage": "3-20 characters, letters, numbers, underscores"
}`}
                    />
                  </Paper>
                </Grid>

                {/* Port Number */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper
                    sx={{
                      p: 3,
                      background: alpha(landingColors.background.elevated, 0.8),
                      backdropFilter: "blur(20px)",
                      border: `1px solid ${alpha(landingColors.primary.main, 0.2)}`,
                      borderRadius: "16px",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "white", mb: 2 }}
                    >
                      Port Number
                    </Typography>
                    <CodeBlock
                      id="common-port"
                      code={`{
  "name": "port",
  "type": "text",
  "title": "Port",
  "placeholder": "8080",
  "description": "Valid port (1-65535)",
  "required": true,
  "regex": "^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$",
  "validationMessage": "Port must be between 1 and 65535"
}`}
                    />
                  </Paper>
                </Grid>

                {/* URL */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper
                    sx={{
                      p: 3,
                      background: alpha(landingColors.background.elevated, 0.8),
                      backdropFilter: "blur(20px)",
                      border: `1px solid ${alpha(landingColors.primary.main, 0.2)}`,
                      borderRadius: "16px",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "white", mb: 2 }}
                    >
                      URL
                    </Typography>
                    <CodeBlock
                      id="common-url"
                      code={`{
  "name": "url",
  "type": "text",
  "title": "URL",
  "placeholder": "https://example.com",
  "description": "Valid HTTP/HTTPS URL",
  "required": true,
  "regex": "^https?:\\\\/\\\\/[a-zA-Z0-9.-]+(:[0-9]+)?(\\\\/.*)?$",
  "validationMessage": "Must be a valid HTTP or HTTPS URL"
}`}
                    />
                  </Paper>
                </Grid>

                {/* IP Address */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper
                    sx={{
                      p: 3,
                      background: alpha(landingColors.background.elevated, 0.8),
                      backdropFilter: "blur(20px)",
                      border: `1px solid ${alpha(landingColors.primary.main, 0.2)}`,
                      borderRadius: "16px",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "white", mb: 2 }}
                    >
                      IP Address (IPv4)
                    </Typography>
                    <CodeBlock
                      id="common-ip"
                      code={`{
  "name": "ipAddress",
  "type": "text",
  "title": "IP Address",
  "placeholder": "192.168.1.1",
  "description": "IPv4 address",
  "required": true,
  "regex": "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$",
  "validationMessage": "Must be a valid IPv4 address"
}`}
                    />
                  </Paper>
                </Grid>

                {/* Slug */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper
                    sx={{
                      p: 3,
                      background: alpha(landingColors.background.elevated, 0.8),
                      backdropFilter: "blur(20px)",
                      border: `1px solid ${alpha(landingColors.primary.main, 0.2)}`,
                      borderRadius: "16px",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "white", mb: 2 }}
                    >
                      URL Slug
                    </Typography>
                    <CodeBlock
                      id="common-slug"
                      code={`{
  "name": "slug",
  "type": "text",
  "title": "Slug",
  "placeholder": "my-blog-post",
  "description": "URL-friendly identifier",
  "required": true,
  "regex": "^[a-z0-9]+(?:-[a-z0-9]+)*$",
  "validationMessage": "Lowercase letters, numbers, hyphens only"
}`}
                    />
                  </Paper>
                </Grid>

                {/* Semantic Version */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper
                    sx={{
                      p: 3,
                      background: alpha(landingColors.background.elevated, 0.8),
                      backdropFilter: "blur(20px)",
                      border: `1px solid ${alpha(landingColors.primary.main, 0.2)}`,
                      borderRadius: "16px",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "white", mb: 2 }}
                    >
                      Semantic Version
                    </Typography>
                    <CodeBlock
                      id="common-semver"
                      code={`{
  "name": "version",
  "type": "text",
  "title": "Version",
  "placeholder": "1.2.3",
  "description": "Semantic version (semver)",
  "required": true,
  "regex": "^(0|[1-9]\\\\d*)\\\\.(0|[1-9]\\\\d*)\\\\.(0|[1-9]\\\\d*)(?:-((?:0|[1-9]\\\\d*|\\\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\\\.(?:0|[1-9]\\\\d*|\\\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\\\+([0-9a-zA-Z-]+(?:\\\\.[0-9a-zA-Z-]+)*))?$",
  "validationMessage": "Must follow semantic versioning (e.g., 1.2.3)"
}`}
                    />
                  </Paper>
                </Grid>

                {/* Hex Color */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper
                    sx={{
                      p: 3,
                      background: alpha(landingColors.background.elevated, 0.8),
                      backdropFilter: "blur(20px)",
                      border: `1px solid ${alpha(landingColors.primary.main, 0.2)}`,
                      borderRadius: "16px",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "white", mb: 2 }}
                    >
                      Hex Color
                    </Typography>
                    <CodeBlock
                      id="common-color"
                      code={`{
  "name": "color",
  "type": "text",
  "title": "Color",
  "placeholder": "#FF5733",
  "description": "Hex color code",
  "required": true,
  "regex": "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
  "validationMessage": "Must be a valid hex color (e.g., #FF5733)"
}`}
                    />
                  </Paper>
                </Grid>

                {/* API Path */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper
                    sx={{
                      p: 3,
                      background: alpha(landingColors.background.elevated, 0.8),
                      backdropFilter: "blur(20px)",
                      border: `1px solid ${alpha(landingColors.primary.main, 0.2)}`,
                      borderRadius: "16px",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "white", mb: 2 }}
                    >
                      API Path
                    </Typography>
                    <CodeBlock
                      id="common-api-path"
                      code={`{
  "name": "apiPath",
  "type": "text",
  "title": "API Path",
  "placeholder": "/api/v1/users",
  "description": "REST API endpoint path",
  "required": true,
  "regex": "^\\\\/[a-zA-Z0-9/_-]*$",
  "validationMessage": "Must start with / and contain valid path characters"
}`}
                    />
                  </Paper>
                </Grid>

                {/* Environment Variable */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper
                    sx={{
                      p: 3,
                      background: alpha(landingColors.background.elevated, 0.8),
                      backdropFilter: "blur(20px)",
                      border: `1px solid ${alpha(landingColors.primary.main, 0.2)}`,
                      borderRadius: "16px",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "white", mb: 2 }}
                    >
                      Environment Variable
                    </Typography>
                    <CodeBlock
                      id="common-env-var"
                      code={`{
  "name": "envVar",
  "type": "text",
  "title": "Environment Variable",
  "placeholder": "DATABASE_URL",
  "description": "Environment variable name",
  "required": true,
  "regex": "^[A-Z][A-Z0-9_]*$",
  "validationMessage": "Uppercase letters, numbers, underscores only"
}`}
                    />
                  </Paper>
                </Grid>

                {/* UUID */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper
                    sx={{
                      p: 3,
                      background: alpha(landingColors.background.elevated, 0.8),
                      backdropFilter: "blur(20px)",
                      border: `1px solid ${alpha(landingColors.primary.main, 0.2)}`,
                      borderRadius: "16px",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "white", mb: 2 }}
                    >
                      UUID
                    </Typography>
                    <CodeBlock
                      id="common-uuid"
                      code={`{
  "name": "id",
  "type": "text",
  "title": "ID",
  "placeholder": "550e8400-e29b-41d4-a716-446655440000",
  "description": "Unique identifier (UUID v4)",
  "required": true,
  "regex": "^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$",
  "validationMessage": "Must be a valid UUID v4"
}`}
                    />
                  </Paper>
                </Grid>

                {/* Docker Image */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper
                    sx={{
                      p: 3,
                      background: alpha(landingColors.background.elevated, 0.8),
                      backdropFilter: "blur(20px)",
                      border: `1px solid ${alpha(landingColors.primary.main, 0.2)}`,
                      borderRadius: "16px",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "white", mb: 2 }}
                    >
                      Docker Image
                    </Typography>
                    <CodeBlock
                      id="common-docker"
                      code={`{
  "name": "dockerImage",
  "type": "text",
  "title": "Docker Image",
  "placeholder": "nginx:latest",
  "description": "Docker image name with optional tag",
  "required": true,
  "regex": "^[a-z0-9]+(?:[._-][a-z0-9]+)*(?:\\\\/[a-z0-9]+(?:[._-][a-z0-9]+)*)*(?::[a-zA-Z0-9_.-]+)?$",
  "validationMessage": "Valid Docker image format (e.g., nginx:1.21)"
}`}
                    />
                  </Paper>
                </Grid>

                {/* Field with Documentation Links */}
                <Grid size={12}>
                  <Paper
                    sx={{
                      p: 3,
                      background: alpha(landingColors.background.elevated, 0.8),
                      backdropFilter: "blur(20px)",
                      border: `1px solid ${alpha(landingColors.primary.main, 0.2)}`,
                      borderRadius: "16px",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "white", mb: 2 }}
                    >
                      Field with Documentation Links
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: alpha("#FFFFFF", 0.6), mb: 2 }}
                    >
                      Add clickable documentation links to help users understand
                      complex fields
                    </Typography>
                    <CodeBlock
                      id="common-links-example"
                      code={`{
  "name": "apiKey",
  "type": "text",
  "title": "API Key",
  "placeholder": "sk_live_...",
  "description": "Your service API authentication key",
  "required": true,
  "regex": "^sk_(test|live)_[a-zA-Z0-9]{24,}$",
  "validationMessage": "Must be a valid API key format",
  "links": [
    {
      "text": "How to generate an API key",
      "url": "https://docs.example.com/api/authentication"
    },
    {
      "text": "API key security best practices",
      "url": "https://docs.example.com/security/api-keys"
    }
  ]
}`}
                    />
                  </Paper>
                </Grid>
              </Grid>
            </TabPanel>
          </Box>
        </Paper>
      </Container>

      <Footer />
    </Box>
  );
};

export default DocumentationPage;
