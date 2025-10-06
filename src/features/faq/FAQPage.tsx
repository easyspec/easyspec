import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Paper,
  Fade,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  Chip,
  Button,
  alpha,
} from "@mui/material";
import {
  ExpandMore as ExpandIcon,
  Search as SearchIcon,
  QuestionMark as QuestionIcon,
  Lightbulb as TipIcon,
  Build as BuildIcon,
  Security as SecurityIcon,
  ContactSupport as SupportIcon,
} from "@mui/icons-material";
import {
  landingStyles,
  landingColors,
  landingAnimations,
} from "../../styles/landing.styles";
import Header from "../landing/components/Header";
import Footer from "../landing/components/Footer";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedPanel, setExpandedPanel] = useState<string | false>(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
    // Inject animations
    const style = document.createElement("style");
    style.textContent = Object.values(landingAnimations).join("\n");
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const categories = [
    {
      id: "all",
      label: "All Questions",
      icon: <QuestionIcon />,
      color: landingColors.primary.main,
    },
    {
      id: "getting-started",
      label: "Getting Started",
      icon: <TipIcon />,
      color: landingColors.accent.teal,
    },
    {
      id: "features",
      label: "Features",
      icon: <BuildIcon />,
      color: landingColors.accent.lime,
    },
    {
      id: "privacy",
      label: "Privacy",
      icon: <SecurityIcon />,
      color: landingColors.semantic.success,
    },
  ];

  const faqs: FAQItem[] = [
    // Getting Started
    {
      category: "getting-started",
      question: "What is EasySpec?",
      answer:
        "EasySpec is a browser-based form builder. Create a form, share the link, and get back clean YAML files. Perfect for collecting structured data without needing technical knowledge.",
    },
    {
      category: "getting-started",
      question: "How do I get started?",
      answer:
        'Click "Create Form" in the builder, define your fields, then click "Public Link" to share. Recipients fill the form and download their YAML file. No signup needed.',
    },
    {
      category: "getting-started",
      question: "Do I need to create an account?",
      answer:
        "No! EasySpec works entirely in your browser. No signup, no login, no account needed.",
    },

    // Features
    {
      category: "features",
      question: "What file formats are supported?",
      answer:
        "Currently YAML and JSON. The form builder lets you create forms, and recipients can download their filled data as YAML or JSON files.",
    },
    {
      category: "features",
      question: "How does sharing work?",
      answer:
        'Click "Public Link" to get a shareable URL. The form definition is encoded in the URL itself. Share it with anyone - they can fill it and download the result.',
    },
    {
      category: "features",
      question: "Is there a limit on form size?",
      answer:
        "The form definition is encoded in the URL, so very large forms might hit browser URL length limits (typically ~2000 characters). For normal forms, this is not an issue.",
    },

    // Privacy
    {
      category: "privacy",
      question: "Where is my data stored?",
      answer:
        "Your form is auto-saved in your browser's localStorage. Nothing is sent to our servers. We have no backend API, no database. Your form data never touches our servers — all processing is client-side.",
    },
    {
      category: "features",
      question: "Is my work auto-saved?",
      answer:
        "Yes! Your form is automatically saved in your browser's localStorage as you work. If you close the tab or browser, your work will be there when you return. You'll get a confirmation if you try to replace it with a new form or example.",
    },
    {
      category: "privacy",
      question: "Do you track me?",
      answer:
        "No tracking, no analytics, no cookies. We literally cannot see your data or track your usage. Everything happens client-side.",
    },
    {
      category: "privacy",
      question: "Can shared forms be password protected?",
      answer:
        "Shared links are public by design to keep the tool simple and privacy-focused. Anyone with the link can access the form. For sensitive configs, consider sharing links over secure channels.",
    },
    {
      category: "privacy",
      question: "Can I use this for sensitive data?",
      answer:
        "Only if you trust the recipient. Since everything is client-side, we can't control what recipients do with downloaded files. For sensitive configs, share links over secure channels and consider encrypting the config files yourself.",
    },

    // More Features
    {
      category: "features",
      question: "Can I edit a form after sharing the link?",
      answer:
        "No. The form definition is embedded in the URL itself. To make changes, create a new form and share a new link.",
    },
    {
      category: "features",
      question: "How do I know my form works correctly?",
      answer:
        "Use the Preview tab in the builder to test your form before sharing. You can fill it out yourself and verify the YAML/JSON output.",
    },
    {
      category: "features",
      question: "Is there a mobile app?",
      answer:
        "No app needed — it works in any mobile browser. Both creating and filling forms work on phones and tablets.",
    },
    {
      category: "features",
      question: "Can I integrate this with my CI/CD pipeline?",
      answer:
        "Not directly. EasySpec is for human-friendly data collection. Recipients download YAML/JSON files which they can then commit to repos or upload to systems.",
    },
    {
      category: "features",
      question: "What field types are supported?",
      answer:
        "Text, number, boolean (checkbox), single-select (dropdown), multi-select, arrays, and nested objects. Each field can have validation rules, descriptions, and be marked as required.",
    },
  ];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleAccordionChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedPanel(isExpanded ? panel : false);
    };

  return (
    <Box sx={landingStyles.mainContainer}>
      {/* Animated Background Mesh */}
      <Box sx={landingStyles.backgroundMesh} />

      {/* Header */}
      <Header />

      {/* Content */}
      <Container
        maxWidth="lg"
        sx={{ pt: 10, pb: 8, position: "relative", zIndex: 1 }}
      >
        <Fade in={isVisible} timeout={1000}>
          <Stack spacing={6}>
            {/* Hero Section */}
            <Stack alignItems="center" spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <SupportIcon
                  sx={{ color: landingColors.primary.main, fontSize: 24 }}
                />
                <Typography
                  variant="subtitle1"
                  sx={{ color: landingColors.primary.main, fontWeight: 600 }}
                >
                  Help Center
                </Typography>
              </Stack>

              <Typography
                variant="h3"
                align="center"
                sx={{
                  ...landingStyles.hero.title,
                  fontSize: { xs: "2rem", md: "2.5rem" },
                }}
              >
                Frequently Asked Questions
              </Typography>

              <Typography
                variant="body1"
                align="center"
                sx={{
                  color: alpha("#FFFFFF", 0.7),
                  maxWidth: 600,
                }}
              >
                Find answers to common questions about EasySpec. Can't find what
                you're looking for?{" "}
                <Box
                  component="a"
                  href="https://github.com/easyspec/easyspec/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: landingColors.primary.main,
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Open an issue on GitHub
                </Box>
              </Typography>

              {/* Search Bar */}
              <Paper
                sx={{
                  p: 1,
                  mt: 3,
                  width: "100%",
                  maxWidth: 600,
                  background: alpha(landingColors.background.paper, 0.9),
                  backdropFilter: "blur(20px)",
                  border: `1px solid ${alpha(landingColors.primary.main, 0.2)}`,
                  borderRadius: "16px",
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Search for answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon
                          sx={{ color: landingColors.primary.main }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      border: "none",
                      "& fieldset": {
                        border: "none",
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "white",
                    },
                  }}
                />
              </Paper>
            </Stack>

            {/* Category Filters */}
            <Stack
              direction="row"
              spacing={2}
              sx={{
                justifyContent: "center",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              {categories.map((cat) => (
                <Chip
                  key={cat.id}
                  label={cat.label}
                  icon={cat.icon}
                  onClick={() => setSelectedCategory(cat.id)}
                  sx={{
                    px: 2,
                    py: 0.5,
                    background:
                      selectedCategory === cat.id
                        ? alpha(cat.color, 0.2)
                        : alpha(landingColors.background.paper, 0.8),
                    color:
                      selectedCategory === cat.id
                        ? cat.color
                        : alpha("#FFFFFF", 0.7),
                    border: `1px solid ${alpha(cat.color, selectedCategory === cat.id ? 0.5 : 0.2)}`,
                    fontWeight: 600,
                    "&:hover": {
                      background: alpha(cat.color, 0.15),
                      borderColor: alpha(cat.color, 0.4),
                    },
                  }}
                />
              ))}
            </Stack>

            {/* FAQ Accordions */}
            <Stack spacing={2}>
              {filteredFAQs.length === 0 ? (
                <Paper
                  sx={{
                    p: 6,
                    textAlign: "center",
                    background: alpha(landingColors.background.paper, 0.9),
                    backdropFilter: "blur(20px)",
                    border: `1px solid ${alpha(landingColors.primary.main, 0.2)}`,
                    borderRadius: "24px",
                  }}
                >
                  <Typography variant="h6" sx={{ color: "white", mb: 2 }}>
                    No questions found
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: alpha("#FFFFFF", 0.7), mb: 3 }}
                  >
                    Try adjusting your search or filter criteria
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                    sx={{
                      borderColor: landingColors.primary.main,
                      color: landingColors.primary.main,
                      textTransform: "none",
                    }}
                  >
                    Clear Filters
                  </Button>
                </Paper>
              ) : (
                filteredFAQs.map((faq, index) => (
                  <Fade key={index} in={isVisible} timeout={1000 + index * 50}>
                    <Accordion
                      expanded={expandedPanel === `panel${index}`}
                      onChange={handleAccordionChange(`panel${index}`)}
                      sx={{
                        background: alpha(landingColors.background.paper, 0.9),
                        backdropFilter: "blur(20px)",
                        border: `1px solid ${alpha(landingColors.primary.main, 0.2)}`,
                        borderRadius: "16px !important",
                        mb: 2,
                        "&:before": {
                          display: "none",
                        },
                        "&.Mui-expanded": {
                          borderColor: alpha(landingColors.primary.main, 0.4),
                        },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={
                          <ExpandIcon
                            sx={{ color: landingColors.primary.main }}
                          />
                        }
                        sx={{
                          "& .MuiAccordionSummary-content": {
                            alignItems: "center",
                            gap: 2,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: landingColors.primary.gradient,
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          sx={{ color: "white", fontWeight: 600, flex: 1 }}
                        >
                          {faq.question}
                        </Typography>
                        <Chip
                          label={
                            categories.find((c) => c.id === faq.category)?.label
                          }
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: "0.7rem",
                            background: alpha(landingColors.primary.main, 0.1),
                            color: landingColors.primary.light,
                          }}
                        />
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography
                          sx={{
                            color: alpha("#FFFFFF", 0.7),
                            lineHeight: 1.8,
                            pl: 3,
                          }}
                        >
                          {faq.answer}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  </Fade>
                ))
              )}
            </Stack>
          </Stack>
        </Fade>
      </Container>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default FAQPage;
