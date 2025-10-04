/**
 * useFieldManagement Hook Tests
 */

import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { Field } from "../../../types";
import { useFieldManagement } from "./useFieldManagement";

describe("useFieldManagement", () => {
  const mockFields: Field[] = [
    { name: "username", type: "text", value: "john", required: true },
    { name: "age", type: "number", value: 25 },
    {
      name: "address",
      type: "object",
      children: [
        { name: "street", type: "text", value: "123 Main St" },
        { name: "city", type: "text", value: "Boston" },
      ],
    },
    {
      name: "tags",
      type: "array",
      children: [
        { name: "0", type: "text", value: "tag1" },
        { name: "1", type: "text", value: "tag2" },
      ],
    },
  ];

  describe("initialization", () => {
    it("should initialize with provided fields", () => {
      const { result } = renderHook(() => useFieldManagement(mockFields));

      expect(result.current.fields).toEqual(mockFields);
      expect(result.current.selectedField).toBeNull();
      expect(result.current.selectedFieldPath).toBeNull();
      expect(result.current.validationError).toBeNull();
    });

    it("should generate initial JSON output", () => {
      const { result } = renderHook(() => useFieldManagement(mockFields));

      const json = JSON.parse(result.current.jsonOutput);
      expect(json.username).toBe("john");
      expect(json.age).toBe(25);
      expect(json.address.street).toBe("123 Main St");
    });

    it("should generate initial YAML output", () => {
      const { result } = renderHook(() => useFieldManagement(mockFields));

      expect(result.current.yamlOutput).toContain("username: john");
      expect(result.current.yamlOutput).toContain("age: 25");
    });

    it("should initialize validation", () => {
      const { result } = renderHook(() => useFieldManagement(mockFields));

      expect(result.current.validation).toBeDefined();
      expect(result.current.validation.valid).toBe(true);
    });
  });

  describe("field selection", () => {
    it("should select a field by path", () => {
      const { result } = renderHook(() => useFieldManagement(mockFields));

      act(() => {
        result.current.setSelectedFieldPath("username");
      });

      expect(result.current.selectedFieldPath).toBe("username");
      expect(result.current.selectedField?.name).toBe("username");
      expect(result.current.selectedField?.value).toBe("john");
    });

    it("should select a nested field", () => {
      const { result } = renderHook(() => useFieldManagement(mockFields));

      act(() => {
        result.current.setSelectedFieldPath("address.street");
      });

      expect(result.current.selectedField?.name).toBe("street");
      expect(result.current.selectedField?.value).toBe("123 Main St");
    });

    it("should return null for invalid path", () => {
      const { result } = renderHook(() => useFieldManagement(mockFields));

      act(() => {
        result.current.setSelectedFieldPath("nonexistent");
      });

      expect(result.current.selectedField).toBeNull();
    });
  });

  describe("handleUpdateValue", () => {
    it("should update top-level field value", () => {
      const { result } = renderHook(() => useFieldManagement(mockFields));

      act(() => {
        result.current.handleUpdateValue("username", "jane");
      });

      const updatedField = result.current.fields.find(
        (f) => f.name === "username",
      );
      expect(updatedField?.value).toBe("jane");
    });

    it("should update nested field value", () => {
      const { result } = renderHook(() => useFieldManagement(mockFields));

      act(() => {
        result.current.handleUpdateValue("address.city", "New York");
      });

      const json = JSON.parse(result.current.jsonOutput);
      expect(json.address.city).toBe("New York");
    });

    it("should update YAML output after value change", () => {
      const { result } = renderHook(() => useFieldManagement(mockFields));

      act(() => {
        result.current.handleUpdateValue("username", "alice");
      });

      expect(result.current.yamlOutput).toContain("username: alice");
    });

    it("should validate value against regex", () => {
      const fieldsWithRegex: Field[] = [
        {
          name: "email",
          type: "text",
          value: "",
          regex: "^[a-z]+@[a-z]+\\.com$",
          validationMessage: "Invalid email format",
        },
      ];

      const { result } = renderHook(() => useFieldManagement(fieldsWithRegex));

      act(() => {
        result.current.handleUpdateValue("email", "invalid");
      });

      expect(result.current.validationError).toBe("Invalid email format");

      act(() => {
        result.current.handleUpdateValue("email", "test@example.com");
      });

      expect(result.current.validationError).toBeNull();
    });
  });

  describe("handleAddArrayItem", () => {
    it("should add item to array", () => {
      const { result } = renderHook(() => useFieldManagement(mockFields));

      act(() => {
        result.current.handleAddArrayItem("tags");
      });

      const tagsField = result.current.fields.find((f) => f.name === "tags");
      expect(tagsField?.children).toHaveLength(3);
      expect(tagsField?.children?.[2].name).toBe("2");
    });

    it("should reset values for new array item", () => {
      const { result } = renderHook(() => useFieldManagement(mockFields));

      act(() => {
        result.current.handleAddArrayItem("tags");
      });

      const tagsField = result.current.fields.find((f) => f.name === "tags");
      expect(tagsField?.children?.[2].value).toBe("");
    });

    it("should respect maxItems constraint", () => {
      const limitedArray: Field[] = [
        {
          name: "items",
          type: "array",
          maxItems: 2,
          children: [
            { name: "0", type: "text", value: "item1" },
            { name: "1", type: "text", value: "item2" },
          ],
        },
      ];

      const { result } = renderHook(() => useFieldManagement(limitedArray));

      act(() => {
        result.current.handleAddArrayItem("items");
      });

      const itemsField = result.current.fields.find((f) => f.name === "items");
      expect(itemsField?.children).toHaveLength(2);
    });

    it("should handle adding object items to array", () => {
      const objectArray: Field[] = [
        {
          name: "users",
          type: "array",
          children: [
            {
              name: "0",
              type: "object",
              children: [
                { name: "name", type: "text", value: "John" },
                { name: "age", type: "number", value: 25 },
              ],
            },
          ],
        },
      ];

      const { result } = renderHook(() => useFieldManagement(objectArray));

      act(() => {
        result.current.handleAddArrayItem("users");
      });

      const usersField = result.current.fields.find((f) => f.name === "users");
      expect(usersField?.children).toHaveLength(2);
      expect(usersField?.children?.[1].type).toBe("object");
      expect(usersField?.children?.[1].children?.[0].value).toBe("");
    });
  });

  describe("handleRemoveArrayItem", () => {
    it("should remove item from array", () => {
      const { result } = renderHook(() => useFieldManagement(mockFields));

      act(() => {
        result.current.handleRemoveArrayItem("tags", "tags.1");
      });

      const tagsField = result.current.fields.find((f) => f.name === "tags");
      expect(tagsField?.children).toHaveLength(1);
    });

    it("should reindex remaining items", () => {
      const { result } = renderHook(() => useFieldManagement(mockFields));

      act(() => {
        result.current.handleRemoveArrayItem("tags", "tags.1");
      });

      const tagsField = result.current.fields.find((f) => f.name === "tags");
      expect(tagsField?.children?.[0].name).toBe("0");
    });

    it("should not remove first item (index 0)", () => {
      const { result } = renderHook(() => useFieldManagement(mockFields));

      act(() => {
        result.current.handleRemoveArrayItem("tags", "tags.0");
      });

      const tagsField = result.current.fields.find((f) => f.name === "tags");
      expect(tagsField?.children).toHaveLength(2);
    });
  });

  describe("importFromJson", () => {
    it("should import valid JSON", () => {
      const { result } = renderHook(() => useFieldManagement(mockFields));

      const newFields: Field[] = [
        { name: "field1", type: "text", value: "value1" },
        { name: "field2", type: "number", value: 42 },
      ];

      let importResult:
        | { success: boolean; fields?: Field[]; error?: string }
        | undefined;
      act(() => {
        importResult = result.current.importFromJson(JSON.stringify(newFields));
      });

      expect(importResult?.success).toBe(true);
      expect(result.current.fields).toHaveLength(2);
    });

    it("should reject invalid JSON", () => {
      const { result } = renderHook(() => useFieldManagement(mockFields));

      let importResult:
        | { success: boolean; fields?: Field[]; error?: string }
        | undefined;
      act(() => {
        importResult = result.current.importFromJson("invalid json");
      });

      expect(importResult?.success).toBe(false);
      expect(importResult?.error).toBeDefined();
    });

    it("should reject non-array JSON", () => {
      const { result } = renderHook(() => useFieldManagement(mockFields));

      let importResult:
        | { success: boolean; fields?: Field[]; error?: string }
        | undefined;
      act(() => {
        importResult = result.current.importFromJson('{"field": "value"}');
      });

      expect(importResult?.success).toBe(false);
      expect(importResult?.error).toContain("array");
    });

    it("should validate field structure", () => {
      const { result } = renderHook(() => useFieldManagement(mockFields));

      let importResult:
        | { success: boolean; fields?: Field[]; error?: string }
        | undefined;
      act(() => {
        importResult = result.current.importFromJson('[{"invalid": "field"}]');
      });

      expect(importResult?.success).toBe(false);
      expect(importResult?.error).toContain("Invalid field structure");
    });
  });

  describe("importFromYaml", () => {
    it("should import valid YAML", () => {
      const { result } = renderHook(() => useFieldManagement(mockFields));

      const yaml = "username: alice\nage: 30\nactive: true";

      let importResult:
        | { success: boolean; fields?: Field[]; error?: string }
        | undefined;
      act(() => {
        importResult = result.current.importFromYaml(yaml);
      });

      expect(importResult?.success).toBe(true);
      expect(result.current.fields.length).toBeGreaterThan(0);
    });

    it("should reject invalid YAML", () => {
      const { result } = renderHook(() => useFieldManagement(mockFields));

      let importResult:
        | { success: boolean; fields?: Field[]; error?: string }
        | undefined;
      act(() => {
        importResult = result.current.importFromYaml(
          "invalid: [yaml: structure",
        );
      });

      expect(importResult?.success).toBe(false);
      expect(importResult?.error).toBeDefined();
    });

    it("should handle nested YAML structures", () => {
      const { result } = renderHook(() => useFieldManagement(mockFields));

      const yaml = `
user:
  name: john
  email: john@example.com
settings:
  theme: dark
`;

      let importResult:
        | { success: boolean; fields?: Field[]; error?: string }
        | undefined;
      act(() => {
        importResult = result.current.importFromYaml(yaml);
      });

      expect(importResult?.success).toBe(true);
      const userField = result.current.fields.find((f) => f.name === "user");
      expect(userField?.type).toBe("object");
      expect(userField?.children).toBeDefined();
    });
  });

  describe("exportAsYaml", () => {
    it("should generate YAML output for export", () => {
      const { result } = renderHook(() => useFieldManagement(mockFields));

      // Just verify that yamlOutput is available and contains expected content
      expect(result.current.yamlOutput).toBeDefined();
      expect(result.current.yamlOutput).toContain("username");
      expect(result.current.yamlOutput.length).toBeGreaterThan(0);
    });
  });

  describe("validation", () => {
    it("should validate required fields", () => {
      const fieldsWithRequired: Field[] = [
        { name: "required1", type: "text", required: true, value: "" },
        { name: "required2", type: "text", required: true, value: "filled" },
        { name: "optional", type: "text", required: false, value: "" },
      ];

      const { result } = renderHook(() =>
        useFieldManagement(fieldsWithRequired),
      );

      expect(result.current.validation.valid).toBe(false);
      expect(result.current.validation.missing.length).toBeGreaterThan(0);
    });

    it("should update validation when fields change", () => {
      const fieldsWithRequired: Field[] = [
        { name: "required1", type: "text", required: true, value: "" },
      ];

      const { result } = renderHook(() =>
        useFieldManagement(fieldsWithRequired),
      );

      expect(result.current.validation.valid).toBe(false);

      act(() => {
        result.current.handleUpdateValue("required1", "filled");
      });

      expect(result.current.validation.valid).toBe(true);
    });
  });
});
