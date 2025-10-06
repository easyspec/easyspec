import type { Field } from "../../../types";

/**
 * Field templates for quick insertion in JSON editor
 * These are minimal but complete templates with sensible defaults
 */

export interface FieldTemplate {
  label: string;
  icon: string;
  category: "basic" | "common";
  template: Partial<Field>;
}

// Basic field type templates
export const basicTemplates: FieldTemplate[] = [
  {
    label: "Text",
    icon: "📝",
    category: "basic",
    template: {
      name: "fieldName",
      type: "text",
      title: "Field Title",
      placeholder: "Enter value...",
      description: "Field description",
      required: false,
    },
  },
  {
    label: "Number",
    icon: "🔢",
    category: "basic",
    template: {
      name: "fieldName",
      type: "number",
      title: "Field Title",
      value: 0,
      description: "Numeric value",
      required: false,
    },
  },
  {
    label: "Boolean",
    icon: "☑️",
    category: "basic",
    template: {
      name: "fieldName",
      type: "boolean",
      title: "Field Title",
      value: false,
      description: "True/false toggle",
      required: false,
    },
  },
  {
    label: "Enum",
    icon: "📋",
    category: "basic",
    template: {
      name: "fieldName",
      type: "enum",
      title: "Field Title",
      placeholder: "Select option...",
      description: "Select one option",
      required: false,
      options: [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
        { value: "option3", label: "Option 3" },
      ],
    },
  },
  {
    label: "Multiselect",
    icon: "☑️",
    category: "basic",
    template: {
      name: "fieldName",
      type: "multiselect",
      title: "Field Title",
      description: "Select multiple options",
      required: false,
      options: [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
        { value: "option3", label: "Option 3" },
      ],
      value: [],
    },
  },
  {
    label: "Object",
    icon: "📦",
    category: "basic",
    template: {
      name: "section",
      type: "object",
      title: "Section Title",
      description: "Grouped fields",
      children: [],
    },
  },
  {
    label: "Array",
    icon: "📚",
    category: "basic",
    template: {
      name: "items",
      type: "array",
      title: "List Items",
      description: "Dynamic list of items",
      maxItems: 10,
      children: [
        {
          name: "0",
          type: "text",
          title: "Item",
          placeholder: "Enter item...",
        },
      ],
    },
  },
];
