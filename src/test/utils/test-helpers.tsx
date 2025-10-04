import { render, RenderOptions } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { theme } from "../../styles";
import type { ReactElement } from "react";

/**
 * Renders component with all required providers
 */
export function renderWithProviders(
  ui: ReactElement,
  { route = "/", ...options }: RenderOptions & { route?: string } = {},
) {
  window.history.pushState({}, "Test page", route);

  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>{ui}</SnackbarProvider>
      </ThemeProvider>
    </BrowserRouter>,
    options,
  );
}

/**
 * Mock clipboard API
 */
export function mockClipboard() {
  Object.defineProperty(navigator, "clipboard", {
    value: {
      writeText: vi.fn().mockResolvedValue(undefined),
      readText: vi.fn().mockResolvedValue(""),
    },
    writable: true,
    configurable: true,
  });
}

/**
 * Mock window.location
 */
export function mockLocation(href = "http://localhost:3000") {
  delete (window as Record<string, unknown>).location;
  window.location = { href } as Location;
}
