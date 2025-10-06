/**
 * Monaco Editor Theme Configuration
 * Shared theme for JSON/YAML editor dialogs
 */

import type { editor } from "monaco-editor";

export const EASYSPEC_DARK_THEME: editor.IStandaloneThemeData = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "string.key.json", foreground: "10B981" }, // Primary green
    { token: "string.value.json", foreground: "14B8A6" }, // Teal
    { token: "number", foreground: "FCD34D" }, // Gold
    { token: "keyword", foreground: "84CC16" }, // Lime
    { token: "comment", foreground: "6B7280" }, // Gray
  ],
  colors: {
    "editor.background": "#111918",
    "editor.foreground": "#E5E7EB",
    "editor.lineHighlightBackground": "#1A2421",
    "editorLineNumber.foreground": "#4B5563",
    "editorLineNumber.activeForeground": "#10B981",
    "editor.selectionBackground": "#10B98133",
    "editor.inactiveSelectionBackground": "#10B98119",
    "editorCursor.foreground": "#10B981",
    "editor.wordHighlightBackground": "#10B98119",
    "editor.wordHighlightStrongBackground": "#10B98133",
    "editor.findMatchBackground": "#FCD34D33",
    "editor.findMatchHighlightBackground": "#FCD34D19",
    "editorBracketMatch.background": "#10B98133",
    "editorBracketMatch.border": "#10B981",
    "editorIndentGuide.background": "#1F2937",
    "editorIndentGuide.activeBackground": "#374151",
    "scrollbar.shadow": "#00000033",
    "scrollbarSlider.background": "#4B556333",
    "scrollbarSlider.hoverBackground": "#6B728066",
    "scrollbarSlider.activeBackground": "#9CA3AF66",
  },
};

export const MONACO_EDITOR_OPTIONS: editor.IStandaloneEditorConstructionOptions =
  {
    minimap: { enabled: false },
    fontSize: 14,
    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
    automaticLayout: true,
    formatOnPaste: true,
    formatOnType: true,
    scrollBeyondLastLine: false,
    padding: { top: 16, bottom: 16 },
    lineNumbers: "on",
    renderLineHighlight: "all",
    scrollbar: {
      vertical: "auto",
      horizontal: "auto",
    },
    suggestOnTriggerCharacters: true,
    quickSuggestions: {
      other: true,
      comments: false,
      strings: true,
    },
    wordWrap: "on",
    wordWrapColumn: 80,
    wrappingIndent: "indent",
    tabSize: 2,
  };

/**
 * Register the EasySpec dark theme with Monaco
 */
export const registerEasyspecTheme = (
  monaco: typeof import("monaco-editor"),
) => {
  monaco.editor.defineTheme("easyspec-dark", EASYSPEC_DARK_THEME);
};
