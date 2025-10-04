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
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split vendor chunks for better caching
          if (id.includes("node_modules")) {
            // React core
            if (
              id.includes("react-dom") ||
              id.includes("react/") ||
              id.includes("react-router")
            ) {
              return "react-vendor";
            }
            // MUI components
            if (id.includes("@mui/material")) {
              return "mui-core";
            }
            // MUI icons (separate for better caching)
            if (id.includes("@mui/icons-material")) {
              return "mui-icons";
            }
            // Monaco editor (large, separate chunk)
            if (id.includes("monaco-editor")) {
              return "monaco-editor";
            }
            // Syntax highlighter (large, separate chunk)
            if (id.includes("react-syntax-highlighter")) {
              return "syntax-highlighter";
            }
            // Data processing
            if (id.includes("js-yaml")) {
              return "data-utils";
            }
            // Everything else in vendor
            return "vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 500,
    // Better minification
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
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
