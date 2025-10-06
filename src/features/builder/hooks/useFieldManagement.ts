import { useState, useCallback, useMemo, useEffect } from "react";
import YAML from "js-yaml";
import { stringify as kyamlStringify } from "@alnpir/kyaml";
import type { Field } from "../../../types";
import {
  findFieldByPath,
  validateFieldValue,
  validateRequiredFields,
  buildDataStructure,
  filterFields,
  yamlToFields,
} from "../../../utils";

export const useFieldManagement = (initialFields: Field[]) => {
  const [fields, setFields] = useState<Field[]>(initialFields);
  const [selectedFieldPath, setSelectedFieldPath] = useState<string | null>(
    null,
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const [yamlOutput, setYamlOutput] = useState("");
  const [kyamlOutput, setKyamlOutput] = useState("");

  // Get selected field
  const selectedField = useMemo(
    () =>
      selectedFieldPath ? findFieldByPath(fields, selectedFieldPath) : null,
    [fields, selectedFieldPath],
  );

  // Validate all required fields
  const validation = useMemo(() => validateRequiredFields(fields), [fields]);

  // Generate JSON output
  const jsonOutput = useMemo(() => {
    const data = buildDataStructure(fields);
    return JSON.stringify(data, null, 2);
  }, [fields]);

  // Generate YAML output when fields change
  useEffect(() => {
    const data = buildDataStructure(fields);
    try {
      const yaml = YAML.dump(data, { indent: 2, noRefs: true });
      setYamlOutput(yaml);
    } catch {
      setYamlOutput("# Error generating YAML");
    }

    // Generate KYAML output
    try {
      const kyaml = kyamlStringify(data);
      setKyamlOutput(kyaml);
    } catch {
      setKyamlOutput("# Error generating KYAML");
    }
  }, [fields]);

  // Handle field value update
  const handleUpdateValue = useCallback(
    (path: string, value: unknown) => {
      const updateFieldValue = (
        fields: Field[],
        targetPath: string,
        newValue: unknown,
      ): Field[] => {
        return fields.map((field) => {
          const currentPath = field.name;

          if (currentPath === targetPath) {
            return { ...field, value: newValue };
          }

          if (targetPath.startsWith(currentPath + ".") && field.children) {
            return {
              ...field,
              children: updateFieldValue(
                field.children,
                targetPath.replace(currentPath + ".", ""),
                newValue,
              ),
            };
          }

          return field;
        });
      };

      setFields((prev) => updateFieldValue(prev, path, value));

      // Validate the new value
      const field = findFieldByPath(fields, path);
      if (field && field.regex) {
        const validationResult = validateFieldValue(String(value), field.regex);
        if (!validationResult) {
          setValidationError(field.validationMessage || "Invalid value format");
        } else {
          setValidationError(null);
        }
      } else {
        setValidationError(null);
      }
    },
    [fields],
  );

  // Handle adding item to array
  const handleAddArrayItem = useCallback((arrayPath: string) => {
    const addItemToArray = (
      fields: Field[],
      currentPath: string = "",
    ): Field[] => {
      return fields.map((field) => {
        const fieldPath = currentPath
          ? `${currentPath}.${field.name}`
          : field.name;

        if (
          fieldPath === arrayPath &&
          field.type === "array" &&
          field.children
        ) {
          if (field.maxItems && field.children.length >= field.maxItems) {
            // Cannot add more items. Maximum reached.
            return field;
          }

          const template = field.children[0];
          if (!template) return field;

          const nextIndex = field.children.length;
          const newItem: Field = {
            ...JSON.parse(JSON.stringify(template)),
            name: String(nextIndex),
            value:
              template.type === "text"
                ? ""
                : template.type === "number"
                  ? 0
                  : template.type === "boolean"
                    ? false
                    : template.type === "object"
                      ? undefined
                      : template.type === "array"
                        ? undefined
                        : "",
          };

          const resetValues = (field: Field): Field => {
            const resetField = { ...field };
            if (field.type === "text") resetField.value = "";
            else if (field.type === "number")
              resetField.value = field.value || 0;
            else if (field.type === "boolean") resetField.value = false;

            if (field.children) {
              resetField.children = field.children.map((child) =>
                resetValues(child),
              );
            }
            return resetField;
          };

          return {
            ...field,
            children: [...field.children, resetValues(newItem)],
          };
        }

        if (field.children) {
          return {
            ...field,
            children: addItemToArray(field.children, fieldPath),
          };
        }

        return field;
      });
    };

    setFields((prev) => addItemToArray(prev));
  }, []);

  // Handle removing item from array
  const handleRemoveArrayItem = useCallback(
    (arrayPath: string, itemPath: string) => {
      const removeItemFromArray = (
        fields: Field[],
        currentPath: string = "",
      ): Field[] => {
        return fields.map((field) => {
          const fieldPath = currentPath
            ? `${currentPath}.${field.name}`
            : field.name;

          if (
            fieldPath === arrayPath &&
            field.type === "array" &&
            field.children
          ) {
            const itemIndex = field.children.findIndex((child) => {
              const childPath = `${fieldPath}.${child.name}`;
              return childPath === itemPath;
            });

            if (itemIndex > 0) {
              const newChildren = field.children
                .filter((_, index) => index !== itemIndex)
                .map((child, index) => ({
                  ...child,
                  name: String(index),
                }));

              return {
                ...field,
                children: newChildren,
              };
            }
          }

          if (field.children) {
            return {
              ...field,
              children: removeItemFromArray(field.children, fieldPath),
            };
          }

          return field;
        });
      };

      setFields((prev) => removeItemFromArray(prev));
    },
    [],
  );

  // Import JSON
  const importFromJson = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);

      if (!Array.isArray(parsed)) {
        throw new Error("JSON must be an array of field objects");
      }

      const isValidField = (field: unknown): field is Field => {
        if (typeof field !== "object" || field === null) return false;
        const f = field as Partial<Field>;
        if (!f.name || !f.type) return false;
        if (f.children && Array.isArray(f.children)) {
          return f.children.every(isValidField);
        }
        return true;
      };

      if (!parsed.every(isValidField)) {
        throw new Error(
          "Invalid field structure. Each field must have name and type properties.",
        );
      }

      setFields(parsed);
      return { success: true, fields: parsed };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: errorMessage };
    }
  };

  // Import YAML
  const importFromYaml = (yamlString: string) => {
    try {
      const parsed = YAML.load(yamlString) as Record<string, unknown>;
      const importedFields = yamlToFields(parsed);
      setFields(importedFields);
      return { success: true, fields: importedFields };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: errorMessage };
    }
  };

  // Export as YAML
  const exportAsYaml = () => {
    const blob = new Blob([yamlOutput], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "config.yaml";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter fields based on search
  const getFilteredFields = (searchQuery: string) => {
    if (!searchQuery) return fields;
    return filterFields(JSON.parse(JSON.stringify(fields)), searchQuery);
  };

  return {
    fields,
    setFields,
    selectedField,
    selectedFieldPath,
    setSelectedFieldPath,
    validationError,
    validation,
    yamlOutput,
    kyamlOutput,
    jsonOutput,
    handleUpdateValue,
    handleAddArrayItem,
    handleRemoveArrayItem,
    importFromJson,
    importFromYaml,
    exportAsYaml,
    getFilteredFields,
  };
};
