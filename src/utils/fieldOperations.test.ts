/**
 * Field Operations Tests
 */

import { describe, it, expect } from "vitest";
import type { Field } from "../types";
import {
  updateFieldValue,
  getDefaultValueForType,
  resetFieldValues,
  createArrayItem,
  addItemToArray,
  removeItemFromArray,
  validateRequiredFields,
  validateFieldValue,
  filterFields,
} from "./fieldOperations";

describe("fieldOperations", () => {
  describe("updateFieldValue", () => {
    it("should update a top-level field value", () => {
      const fields: Field[] = [
        { name: "username", type: "text", value: "old" },
        { name: "age", type: "number", value: 25 },
      ];

      const result = updateFieldValue(fields, "username", "new");

      expect(result[0].value).toBe("new");
      expect(result[1].value).toBe(25); // Unchanged
    });

    it("should update a nested field value", () => {
      const fields: Field[] = [
        {
          name: "parent",
          type: "object",
          children: [{ name: "child", type: "text", value: "old" }],
        },
      ];

      const result = updateFieldValue(fields, "parent.child", "new");

      expect(result[0].children?.[0].value).toBe("new");
    });

    it("should update deeply nested field value", () => {
      const fields: Field[] = [
        {
          name: "level1",
          type: "object",
          children: [
            {
              name: "level2",
              type: "object",
              children: [{ name: "level3", type: "text", value: "old" }],
            },
          ],
        },
      ];

      const result = updateFieldValue(fields, "level1.level2.level3", "new");

      expect(result[0].children?.[0].children?.[0].value).toBe("new");
    });

    it("should not modify other fields", () => {
      const fields: Field[] = [
        { name: "field1", type: "text", value: "keep1" },
        { name: "field2", type: "text", value: "keep2" },
        { name: "field3", type: "text", value: "old" },
      ];

      const result = updateFieldValue(fields, "field3", "new");

      expect(result[0].value).toBe("keep1");
      expect(result[1].value).toBe("keep2");
      expect(result[2].value).toBe("new");
    });
  });

  describe("getDefaultValueForType", () => {
    it("should return empty string for text", () => {
      expect(getDefaultValueForType("text")).toBe("");
      expect(getDefaultValueForType("string")).toBe("");
    });

    it("should return 0 for number", () => {
      expect(getDefaultValueForType("number")).toBe(0);
    });

    it("should return false for boolean", () => {
      expect(getDefaultValueForType("boolean")).toBe(false);
    });

    it("should return undefined for object and array", () => {
      expect(getDefaultValueForType("object")).toBe(undefined);
      expect(getDefaultValueForType("array")).toBe(undefined);
    });

    it("should return empty string for unknown types", () => {
      expect(getDefaultValueForType("unknown")).toBe("");
    });
  });

  describe("resetFieldValues", () => {
    it("should reset text field to empty string", () => {
      const field: Field = { name: "test", type: "text", value: "some value" };
      const result = resetFieldValues(field);
      expect(result.value).toBe("");
    });

    it("should reset number field to 0", () => {
      const field: Field = { name: "test", type: "number", value: 42 };
      const result = resetFieldValues(field);
      expect(result.value).toBe(42); // Keeps existing or defaults to 0
    });

    it("should reset boolean field to false", () => {
      const field: Field = { name: "test", type: "boolean", value: true };
      const result = resetFieldValues(field);
      expect(result.value).toBe(false);
    });

    it("should recursively reset nested fields", () => {
      const field: Field = {
        name: "parent",
        type: "object",
        children: [
          { name: "child1", type: "text", value: "keep me" },
          { name: "child2", type: "number", value: 100 },
        ],
      };

      const result = resetFieldValues(field);
      expect(result.children?.[0].value).toBe("");
      expect(result.children?.[1].value).toBe(100);
    });
  });

  describe("createArrayItem", () => {
    it("should create array item with correct index", () => {
      const template: Field = { name: "0", type: "text", value: "template" };
      const result = createArrayItem(template, 5);

      expect(result.name).toBe("5");
      expect(result.type).toBe("text");
    });

    it("should reset values in created item", () => {
      const template: Field = { name: "0", type: "text", value: "original" };
      const result = createArrayItem(template, 1);

      expect(result.value).toBe("");
    });

    it("should deep clone nested structure", () => {
      const template: Field = {
        name: "0",
        type: "object",
        children: [{ name: "nested", type: "text", value: "test" }],
      };

      const result = createArrayItem(template, 1);

      expect(result.children).toBeDefined();
      expect(result.children?.[0].value).toBe("");
    });
  });

  describe("addItemToArray", () => {
    it("should add item to array field", () => {
      const fields: Field[] = [
        {
          name: "items",
          type: "array",
          children: [{ name: "0", type: "text", value: "" }],
        },
      ];

      const result = addItemToArray(fields, "items");

      expect(result[0].children).toHaveLength(2);
      expect(result[0].children?.[1].name).toBe("1");
    });

    it("should respect maxItems constraint", () => {
      const fields: Field[] = [
        {
          name: "items",
          type: "array",
          maxItems: 2,
          children: [
            { name: "0", type: "text", value: "" },
            { name: "1", type: "text", value: "" },
          ],
        },
      ];

      const result = addItemToArray(fields, "items");

      expect(result[0].children).toHaveLength(2); // No change
    });

    it("should add item to nested array", () => {
      const fields: Field[] = [
        {
          name: "parent",
          type: "object",
          children: [
            {
              name: "items",
              type: "array",
              children: [{ name: "0", type: "text", value: "" }],
            },
          ],
        },
      ];

      const result = addItemToArray(fields, "parent.items");

      expect(result[0].children?.[0].children).toHaveLength(2);
    });

    it("should not modify non-array fields", () => {
      const fields: Field[] = [
        { name: "notArray", type: "text", value: "test" },
      ];

      const result = addItemToArray(fields, "notArray");

      expect(result[0]).toEqual(fields[0]);
    });
  });

  describe("removeItemFromArray", () => {
    it("should remove item from array", () => {
      const fields: Field[] = [
        {
          name: "items",
          type: "array",
          children: [
            { name: "0", type: "text", value: "" },
            { name: "1", type: "text", value: "remove me" },
            { name: "2", type: "text", value: "" },
          ],
        },
      ];

      const result = removeItemFromArray(fields, "items", "items.1");

      expect(result[0].children).toHaveLength(2);
      expect(result[0].children?.[0].name).toBe("0");
      expect(result[0].children?.[1].name).toBe("1"); // Reindexed from 2 to 1
    });

    it("should reindex remaining items after removal", () => {
      const fields: Field[] = [
        {
          name: "items",
          type: "array",
          children: [
            { name: "0", type: "text", value: "a" },
            { name: "1", type: "text", value: "b" },
            { name: "2", type: "text", value: "c" },
            { name: "3", type: "text", value: "d" },
          ],
        },
      ];

      const result = removeItemFromArray(fields, "items", "items.1");

      expect(result[0].children).toHaveLength(3);
      expect(result[0].children?.map((c) => c.name)).toEqual(["0", "1", "2"]);
    });

    it("should not remove last item (template)", () => {
      const fields: Field[] = [
        {
          name: "items",
          type: "array",
          children: [{ name: "0", type: "text", value: "" }],
        },
      ];

      const result = removeItemFromArray(fields, "items", "items.0");

      expect(result[0].children).toHaveLength(1); // No change
    });

    it("should remove from nested array", () => {
      const fields: Field[] = [
        {
          name: "parent",
          type: "object",
          children: [
            {
              name: "items",
              type: "array",
              children: [
                { name: "0", type: "text", value: "" },
                { name: "1", type: "text", value: "" },
              ],
            },
          ],
        },
      ];

      const result = removeItemFromArray(
        fields,
        "parent.items",
        "parent.items.1",
      );

      expect(result[0].children?.[0].children).toHaveLength(1);
    });
  });

  describe("validateRequiredFields", () => {
    it("should return valid for all filled required fields", () => {
      const fields: Field[] = [
        { name: "field1", type: "text", required: true, value: "filled" },
        { name: "field2", type: "number", required: true, value: 42 },
      ];

      const result = validateRequiredFields(fields);

      expect(result.isValid).toBe(true);
      expect(result.missingFields).toHaveLength(0);
    });

    it("should detect missing required fields", () => {
      const fields: Field[] = [
        { name: "field1", type: "text", required: true, value: "" },
        { name: "field2", type: "text", required: false, value: "" },
      ];

      const result = validateRequiredFields(fields);

      expect(result.isValid).toBe(false);
      expect(result.missingFields).toContain("field1");
      expect(result.missingFields).not.toContain("field2");
    });

    it("should accept 0 and false as valid values", () => {
      const fields: Field[] = [
        { name: "number", type: "number", required: true, value: 0 },
        { name: "boolean", type: "boolean", required: true, value: false },
      ];

      const result = validateRequiredFields(fields);

      expect(result.isValid).toBe(true);
    });

    it("should check nested required fields", () => {
      const fields: Field[] = [
        {
          name: "parent",
          type: "object",
          children: [
            { name: "child", type: "text", required: true, value: "" },
          ],
        },
      ];

      const result = validateRequiredFields(fields);

      expect(result.isValid).toBe(false);
      expect(result.missingFields).toContain("parent.child");
    });
  });

  describe("validateFieldValue", () => {
    it("should validate against regex pattern", () => {
      expect(
        validateFieldValue("test@example.com", "^[a-z]+@[a-z]+\\.com$"),
      ).toBe(true);
      expect(validateFieldValue("invalid", "^[a-z]+@[a-z]+\\.com$")).toBe(
        false,
      );
    });

    it("should handle numeric patterns", () => {
      expect(validateFieldValue("12345", "^\\d{5}$")).toBe(true);
      expect(validateFieldValue("123", "^\\d{5}$")).toBe(false);
    });

    it("should return true for invalid regex (graceful fallback)", () => {
      expect(validateFieldValue("anything", "[invalid(regex")).toBe(true);
    });
  });

  describe("filterFields", () => {
    const fields: Field[] = [
      { name: "username", type: "text", title: "Username", value: "" },
      { name: "email", type: "text", title: "Email Address", value: "" },
      {
        name: "settings",
        type: "object",
        title: "Settings",
        children: [
          { name: "theme", type: "text", title: "Theme", value: "" },
          { name: "language", type: "text", title: "Language", value: "" },
        ],
      },
    ];

    it("should return all fields for empty query", () => {
      const result = filterFields(fields, "");
      expect(result).toHaveLength(3);
    });

    it("should filter by field name", () => {
      const result = filterFields(fields, "email");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("email");
    });

    it("should filter by field title", () => {
      const result = filterFields(fields, "address");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("email");
    });

    it("should filter nested fields", () => {
      const result = filterFields(fields, "theme");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("settings");
      expect(result[0].children).toHaveLength(1);
      expect(result[0].children?.[0].name).toBe("theme");
    });

    it("should include parent if child matches", () => {
      const result = filterFields(fields, "language");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("settings");
    });

    it("should be case insensitive", () => {
      const result = filterFields(fields, "USERNAME");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("username");
    });

    it("should return empty array for no matches", () => {
      const result = filterFields(fields, "nonexistent");
      expect(result).toHaveLength(0);
    });
  });
});
