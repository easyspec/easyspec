/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: "./src/test/setup.ts",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.test.ts",
        "**/*.test.tsx",
        "src/main.tsx",
        "vite.config.ts",
        "**/*.d.ts",
      ],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 60,
        statements: 60,
      },
    },
  },
  build: {
    target: "es2020",
    chunkSizeWarningLimit: 1000,
    minify: "esbuild",
  },
  optimizeDeps: {
    include: [
      "@mui/material",
      "@mui/icons-material",
      "js-yaml",
      "react",
      "react-dom",
      "react-router-dom",
    ],
    exclude: [
      "@monaco-editor/react", // Lazy load
      "react-syntax-highlighter", // Lazy load
    ],
  },
});
