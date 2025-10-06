import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import {
  Box,
  CircularProgress,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import { theme } from "./styles";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Lazy load heavy components
const LandingPage = lazy(() => import("./features/landing/LandingPage"));
const Builder = lazy(() => import("./features/builder/Builder"));
const DocumentationPage = lazy(
  () => import("./features/documentation/DocumentationPage"),
);

// Legal and support pages (not lazy loaded - lightweight)
import TermsOfService from "./features/legal/TermsOfService";
import PrivacyPolicy from "./features/legal/PrivacyPolicy";
import FAQPage from "./features/faq/FAQPage";
import NotFoundPage from "./features/errors/NotFoundPage";

// Loading fallback component
const LoadingFallback = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <CircularProgress />
  </Box>
);

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Router>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                {/* Builder - uses URL fragment (#) for sharing */}
                <Route path="/builder" element={<Builder />} />
                <Route path="/docs" element={<DocumentationPage />} />

                {/* Legal pages */}
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />

                {/* Support pages */}
                <Route path="/faq" element={<FAQPage />} />

                {/* 404 - Must be last */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </Router>
        </SnackbarProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
