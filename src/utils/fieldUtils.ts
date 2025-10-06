import type { Field, ValidationResult } from "../types";

/**
 * Build a field path from parent path and field name.
 * @param parentPath - The parent path (empty string for root level)
 * @param fieldName - The field name to append
 * @returns The complete field path (e.g., "parent.child")
 * @example
 * buildPath('user', 'name') // Returns 'user.name'
 * buildPath('', 'user') // Returns 'user'
 */
export const buildPath = (parentPath: string, fieldName: string): string => {
  return parentPath ? `${parentPath}.${fieldName}` : fieldName;
};

/**
 * Parse a field path into its component parts.
 * @param path - The field path to parse
 * @returns Array of path components
 * @example
 * parsePath('user.address.city') // Returns ['user', 'address', 'city']
 */
export const parsePath = (path: string): string[] => {
  return path.split(".");
};

/**
 * Get the parent path from a field path.
 * @param path - The field path
 * @returns The parent path (empty string if no parent)
 * @example
 * getParentPath('user.address.city') // Returns 'user.address'
 * getParentPath('user') // Returns ''
 */
export const getParentPath = (path: string): string => {
  const parts = parsePath(path);
  return parts.slice(0, -1).join(".");
};

/**
 * Extract the field name from a path (last component).
 * @param path - The field path
 * @returns The field name
 * @example
 * getFieldName('user.address.city') // Returns 'city'
 */
export const getFieldName = (path: string): string => {
  const parts = parsePath(path);
  return parts[parts.length - 1];
};

/**
 * Check if a path is a child or descendant of another path.
 * @param childPath - The potential child path
 * @param parentPath - The parent path to check against
 * @returns True if childPath is a descendant of parentPath
 * @example
 * isChildPath('user.name', 'user') // Returns true
 * isChildPath('user', 'profile') // Returns false
 */
export const isChildPath = (childPath: string, parentPath: string): boolean => {
  if (!parentPath) return true; // Empty parent means all paths are children
  return childPath.startsWith(parentPath + ".") || childPath === parentPath;
};

/**
 * Find a field by its path in the field tree.
 * @param fields - Array of fields to search
 * @param path - The field path to find
 * @param parentPath - Current parent path (used internally for recursion)
 * @returns The field if found, null otherwise
 * @example
 * findFieldByPath(fields, 'user.address.city')
 */
export const findFieldByPath = (
  fields: Field[],
  path: string,
  parentPath: string = "",
): Field | null => {
  for (const field of fields) {
    const currentPath = buildPath(parentPath, field.name);
    if (currentPath === path) {
      return field;
    }
    if (field.children) {
      const found = findFieldByPath(field.children, path, currentPath);
      if (found) return found;
    }
  }
  return null;
};

/**
 * Validate a field value against a regex pattern.
 * @param value - The value to validate
 * @param regex - Optional regex pattern as a string
 * @returns True if valid or no regex provided, false if validation fails
 */
export const validateFieldValue = (value: string, regex?: string): boolean => {
  if (!regex) return true;
  try {
    return new RegExp(regex).test(value);
  } catch {
    return true;
  }
};

/**
 * Check if a field has a valid value.
 * For object/array types, always returns true.
 * For other types, checks if value exists and matches regex if provided.
 * @param field - The field to check
 * @returns True if field has a valid value
 */
export const hasValue = (field: Field): boolean => {
  if (field.type === "object" || field.type === "array") {
    return true;
  }
  if (field.type === "text" && field.regex && field.value) {
    return validateFieldValue(String(field.value), field.regex);
  }
  return (
    field.value !== undefined && field.value !== null && field.value !== ""
  );
};

/**
 * Validate all required fields in a field tree.
 * @param fields - Array of fields to validate
 * @param path - Current path (used internally for recursion)
 * @returns ValidationResult with valid flag and array of missing field descriptions
 */
export const validateRequiredFields = (
  fields: Field[],
  path: string = "",
): ValidationResult => {
  let missing: string[] = [];

  for (const field of fields) {
    const fieldPath = path ? `${path}.${field.name}` : field.name;
    const displayName = field.title || field.name;

    if (field.required && !hasValue(field)) {
      const isEmpty =
        field.value === undefined || field.value === null || field.value === "";
      const status = isEmpty ? "empty" : "invalid";
      missing.push(`${displayName} (${fieldPath}) - ${status}`);
    }

    if (field.children) {
      const childResult = validateRequiredFields(field.children, fieldPath);
      missing = [...missing, ...childResult.missing];
    }
  }

  return { valid: missing.length === 0, missing };
};

/**
 * Build a data structure from field definitions.
 * Converts field tree into a plain object/array structure with actual values.
 * @param fields - Array of fields to convert
 * @returns Plain JavaScript object representing the data
 * @example
 * // Input: [{ name: 'user', type: 'text', value: 'john' }]
 * // Output: { user: 'john' }
 */
export const buildDataStructure = (
  fields: Field[],
): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  fields.forEach((field) => {
    if (field.type === "object" && field.children) {
      result[field.name] = buildDataStructure(field.children);
    } else if (field.type === "array" && field.children) {
      result[field.name] = field.children.map((child) =>
        child.type === "object" && child.children
          ? buildDataStructure(child.children)
          : child.value,
      );
    } else {
      result[field.name] = field.value ?? null;
    }
  });
  return result;
};

/**
 * Filter fields by search query.
 * Searches field names and titles (case-insensitive).
 * Includes parent fields if any child matches.
 * @param fields - Array of fields to filter
 * @param query - Search query string
 * @returns Filtered array of fields
 * @example
 * filterFields(fields, 'email') // Returns fields matching 'email'
 */
export const filterFields = (fields: Field[], query: string): Field[] => {
  if (!query) return fields;

  return fields.filter((field) => {
    const matchesSearch =
      field.name.toLowerCase().includes(query.toLowerCase()) ||
      field.title?.toLowerCase().includes(query.toLowerCase());

    if (matchesSearch) return true;

    if (field.children) {
      const filteredChildren = filterFields(field.children, query);
      if (filteredChildren.length > 0) {
        field.children = filteredChildren;
        return true;
      }
    }

    return false;
  });
};

/**
 * Convert YAML/JSON object to field definitions.
 * Automatically infers field types from values.
 * @param obj - Plain JavaScript object to convert
 * @returns Array of field definitions
 * @example
 * yamlToFields({ name: 'john', age: 25 })
 * // Returns: [
 * //   { name: 'name', type: 'text', value: 'john' },
 * //   { name: 'age', type: 'number', value: 25 }
 * // ]
 */
export const yamlToFields = (obj: Record<string, unknown>): Field[] => {
  return Object.entries(obj).map(([key, value]) => {
    const field: Field = {
      name: key,
      type: Array.isArray(value)
        ? "array"
        : typeof value === "object" && value !== null
          ? "object"
          : typeof value === "boolean"
            ? "boolean"
            : typeof value === "number"
              ? "number"
              : "text",
    };

    if (field.type === "object" && value && typeof value === "object") {
      field.children = yamlToFields(value as Record<string, unknown>);
    } else if (field.type === "array" && Array.isArray(value)) {
      field.children = value.map((item, index) => {
        if (typeof item === "object" && item !== null) {
          return {
            name: `[${index}]`,
            type: "object" as const,
            children: yamlToFields(item as Record<string, unknown>),
          };
        }
        return {
          name: `[${index}]`,
          type:
            typeof item === "boolean"
              ? "boolean"
              : typeof item === "number"
                ? "number"
                : ("text" as const),
          value: item,
        };
      });
    } else {
      field.value = value;
    }

    return field;
  });
};
