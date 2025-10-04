import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { Box, Button, Typography, Container, Paper } from "@mui/material";
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { colors } from "../styles/tokens";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree and displays a fallback UI
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: colors.background.default,
            backgroundImage: colors.background.gradient,
          }}
        >
          <Container maxWidth="sm">
            <Paper
              sx={{
                p: 4,
                textAlign: "center",
                background: colors.background.elevated,
                border: `1px solid ${colors.primary.main}33`,
              }}
            >
              <ErrorIcon
                sx={{
                  fontSize: 64,
                  color: colors.semantic.error,
                  mb: 2,
                }}
              />
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  color: colors.text.primary,
                  fontWeight: 700,
                }}
              >
                Oops! Something went wrong
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: colors.text.secondary,
                  mb: 3,
                }}
              >
                We encountered an unexpected error. Don't worry, your data is
                safe in your browser.
              </Typography>
              {import.meta.env.DEV && this.state.error && (
                <Paper
                  sx={{
                    p: 2,
                    mb: 3,
                    background: "rgba(0,0,0,0.3)",
                    textAlign: "left",
                    fontFamily: "monospace",
                    fontSize: "0.875rem",
                    color: colors.semantic.error,
                    overflow: "auto",
                    maxHeight: 200,
                  }}
                >
                  <Typography
                    variant="caption"
                    component="div"
                    sx={{ mb: 1, fontWeight: 700 }}
                  >
                    Error Details (Development Only):
                  </Typography>
                  {this.state.error.message}
                </Paper>
              )}
              <Button
                variant="contained"
                size="large"
                startIcon={<RefreshIcon />}
                onClick={this.handleReset}
                sx={{
                  background: colors.primary.main,
                  "&:hover": {
                    background: colors.primary.dark,
                  },
                }}
              >
                Return to Home
              </Button>
            </Paper>
          </Container>
        </Box>
      );
    }

    return this.props.children;
  }
}
