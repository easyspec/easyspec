import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config([
  { ignores: ["dist/**"] },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Allow snake_case for properties (to match database schema)
      "@typescript-eslint/naming-convention": [
        "warn",
        {
          selector: "default",
          format: ["camelCase", "PascalCase", "snake_case", "UPPER_CASE"],
        },
        {
          selector: "property",
          format: ["camelCase", "PascalCase", "snake_case", "UPPER_CASE"],
          // Allow any format for quoted properties (like HTTP headers)
          filter: {
            regex: "^[\"'].*[\"']$",
            match: false,
          },
        },
        {
          selector: "objectLiteralProperty",
          format: null, // Allow any format for object literal properties
        },
        {
          selector: "variable",
          format: ["camelCase", "PascalCase", "snake_case", "UPPER_CASE"],
        },
        {
          selector: "parameter",
          format: ["camelCase", "snake_case"],
          leadingUnderscore: "allow",
        },
      ],
    },
  },
]);
