/**
 * Field Operations - Pure utility functions for field manipulation
 * Extracted from useFieldManagement hook for testability and reusability
 */

import type { Field } from "../types";
import { buildPath } from "./fieldUtils";

/**
 * Update a field value at the specified path
 */
export const updateFieldValue = (
  fields: Field[],
  targetPath: string,
  newValue: unknown,
  parentPath: string = "",
): Field[] => {
  return fields.map((field) => {
    const currentPath = buildPath(parentPath, field.name);

    if (currentPath === targetPath) {
      return { ...field, value: newValue };
    }

    if (targetPath.startsWith(currentPath + ".") && field.children) {
      return {
        ...field,
        children: updateFieldValue(
          field.children,
          targetPath,
          newValue,
          currentPath,
        ),
      };
    }

    return field;
  });
};

/**
 * Get default value for a field type
 */
export const getDefaultValueForType = (type: string): unknown => {
  const defaults: Record<string, unknown> = {
    text: "",
    string: "",
    number: 0,
    boolean: false,
    object: undefined,
    array: undefined,
    enum: "",
    multiselect: [],
  };
  return type in defaults ? defaults[type] : "";
};

/**
 * Reset field values to defaults (for cloning array items)
 */
export const resetFieldValues = (field: Field): Field => {
  const resetField = { ...field };

  if (field.type === "text") {
    resetField.value = "";
  } else if (field.type === "number") {
    resetField.value = field.value || 0;
  } else if (field.type === "boolean") {
    resetField.value = false;
  } else if (field.type === "enum") {
    resetField.value = "";
  } else if (field.type === "multiselect") {
    resetField.value = [];
  }

  if (field.children) {
    resetField.children = field.children.map(resetFieldValues);
  }

  return resetField;
};

/**
 * Create a new array item from template
 */
export const createArrayItem = (template: Field, index: number): Field => {
  // Deep clone the template
  const newItem: Field = JSON.parse(JSON.stringify(template));

  // Set the index as name
  newItem.name = String(index);

  // Reset all values to defaults
  return resetFieldValues(newItem);
};

/**
 * Add an item to an array field
 */
export const addItemToArray = (
  fields: Field[],
  arrayPath: string,
  parentPath: string = "",
): Field[] => {
  return fields.map((field) => {
    const fieldPath = buildPath(parentPath, field.name);

    if (fieldPath === arrayPath && field.type === "array" && field.children) {
      // Check max items constraint
      if (field.maxItems && field.children.length >= field.maxItems) {
        return field;
      }

      // Get template (first child)
      const template = field.children[0];
      if (!template) return field;

      // Create new item
      const nextIndex = field.children.length;
      const newItem = createArrayItem(template, nextIndex);

      return {
        ...field,
        children: [...field.children, newItem],
      };
    }

    // Recurse into children
    if (field.children) {
      return {
        ...field,
        children: addItemToArray(field.children, arrayPath, fieldPath),
      };
    }

    return field;
  });
};

/**
 * Remove an item from an array field
 */
export const removeItemFromArray = (
  fields: Field[],
  arrayPath: string,
  itemPath: string,
  parentPath: string = "",
): Field[] => {
  return fields.map((field) => {
    const fieldPath = buildPath(parentPath, field.name);

    if (fieldPath === arrayPath && field.type === "array" && field.children) {
      // Filter out the item to remove
      const filtered = field.children.filter((child) => {
        const childPath = buildPath(fieldPath, child.name);
        return childPath !== itemPath;
      });

      // Don't allow removing the template (first item)
      if (filtered.length === 0) {
        return field;
      }

      // Reindex remaining items
      const reindexed = filtered.map((child, idx) => ({
        ...child,
        name: String(idx),
      }));

      return {
        ...field,
        children: reindexed,
      };
    }

    // Recurse into children
    if (field.children) {
      return {
        ...field,
        children: removeItemFromArray(
          field.children,
          arrayPath,
          itemPath,
          fieldPath,
        ),
      };
    }

    return field;
  });
};

/**
 * Validate required fields
 */
export interface ValidationResult {
  isValid: boolean;
  missingFields: string[];
}

export const validateRequiredFields = (
  fields: Field[],
  parentPath: string = "",
): ValidationResult => {
  const missingFields: string[] = [];

  const checkField = (field: Field, path: string) => {
    const fieldPath = buildPath(path, field.name);

    if (
      field.required &&
      !field.value &&
      field.value !== 0 &&
      field.value !== false
    ) {
      missingFields.push(fieldPath);
    }

    if (field.children) {
      field.children.forEach((child) => checkField(child, fieldPath));
    }
  };

  fields.forEach((field) => checkField(field, parentPath));

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
};

/**
 * Validate field value against regex pattern
 */
export const validateFieldValue = (value: string, pattern: string): boolean => {
  try {
    const regex = new RegExp(pattern);
    return regex.test(value);
  } catch {
    return true; // Invalid regex, skip validation
  }
};

/**
 * Filter fields by search query (recursive)
 */
export const filterFields = (fields: Field[], searchQuery: string): Field[] => {
  if (!searchQuery.trim()) {
    return fields;
  }

  const query = searchQuery.toLowerCase();

  const filtered: Field[] = [];

  fields.forEach((field) => {
    // Check if field matches
    const nameMatches = field.name.toLowerCase().includes(query);
    const titleMatches = field.title?.toLowerCase().includes(query);
    const descMatches = field.description?.toLowerCase().includes(query);
    const matches = nameMatches || titleMatches || descMatches;

    // Check if any children match
    let matchingChildren: Field[] = [];
    if (field.children) {
      matchingChildren = filterFields(field.children, searchQuery);
    }

    // Include field if it matches or has matching children
    if (matches || matchingChildren.length > 0) {
      filtered.push({
        ...field,
        children:
          matchingChildren.length > 0 ? matchingChildren : field.children,
      });
    }
  });

  return filtered;
};
