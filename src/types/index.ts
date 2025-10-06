// Field types supported by the builder
export type FieldType =
  | "text"
  | "number"
  | "boolean"
  | "object"
  | "array"
  | "enum"
  | "multiselect";

// Validation result for builder (different from forms.ValidationResult)
export interface ValidationResult {
  valid: boolean;
  missing: string[];
}

export interface Field {
  name: string;
  type: FieldType;
  value?: unknown;
  defaultValue?: unknown;
  placeholder?: string;
  title?: string;
  description?: string;
  links?: FieldLink[];
  required?: boolean;
  regex?: string;
  validationMessage?: string;
  children?: Field[];
  maxItems?: number;
  options?: SelectOption[];
  multiple?: boolean;
  // Additional properties for compatibility
  helperText?: string;
  multiline?: boolean;
  min?: number;
  max?: number;
  step?: number;
  reference?: string;
  example?: string;
  label?: string;
  id?: string;
}

export interface FieldLink {
  text: string;
  url: string;
}

export interface FieldTypeConfig {
  icon: React.ComponentType;
  color: string;
  label: string;
}

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

// Helper type for YAML generation
export interface YamlGenerationResult {
  yaml: string;
  json: Record<string, unknown>;
  isValid: boolean;
  errors?: string[];
}
