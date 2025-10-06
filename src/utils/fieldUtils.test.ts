/**
 * Field Utils Tests
 */

import { describe, it, expect } from "vitest";
import type { Field } from "../types";
import {
  buildPath,
  parsePath,
  getParentPath,
  getFieldName,
  isChildPath,
  findFieldByPath,
  validateFieldValue,
  hasValue,
  validateRequiredFields,
  buildDataStructure,
  filterFields,
  yamlToFields,
} from "./fieldUtils";

describe("fieldUtils", () => {
  describe("buildPath", () => {
    it("should build path with parent", () => {
      expect(buildPath("parent", "child")).toBe("parent.child");
    });

    it("should return field name when parent is empty", () => {
      expect(buildPath("", "child")).toBe("child");
    });

    it("should handle nested paths", () => {
      expect(buildPath("a.b.c", "d")).toBe("a.b.c.d");
    });
  });

  describe("parsePath", () => {
    it("should parse simple path", () => {
      expect(parsePath("field")).toEqual(["field"]);
    });

    it("should parse nested path", () => {
      expect(parsePath("parent.child")).toEqual(["parent", "child"]);
    });

    it("should parse deeply nested path", () => {
      expect(parsePath("a.b.c.d")).toEqual(["a", "b", "c", "d"]);
    });
  });

  describe("getParentPath", () => {
    it("should return empty string for top-level field", () => {
      expect(getParentPath("field")).toBe("");
    });

    it("should return parent for nested field", () => {
      expect(getParentPath("parent.child")).toBe("parent");
    });

    it("should return parent path for deeply nested field", () => {
      expect(getParentPath("a.b.c.d")).toBe("a.b.c");
    });
  });

  describe("getFieldName", () => {
    it("should return field name from simple path", () => {
      expect(getFieldName("field")).toBe("field");
    });

    it("should return last component from nested path", () => {
      expect(getFieldName("parent.child")).toBe("child");
    });

    it("should return last component from deeply nested path", () => {
      expect(getFieldName("a.b.c.d")).toBe("d");
    });
  });

  describe("isChildPath", () => {
    it("should return true for all paths when parent is empty", () => {
      expect(isChildPath("anything", "")).toBe(true);
    });

    it("should return true for exact match", () => {
      expect(isChildPath("parent", "parent")).toBe(true);
    });

    it("should return true for child path", () => {
      expect(isChildPath("parent.child", "parent")).toBe(true);
    });

    it("should return false for non-child path", () => {
      expect(isChildPath("other", "parent")).toBe(false);
    });

    it("should return false for sibling path", () => {
      expect(isChildPath("parent.child1", "parent.child2")).toBe(false);
    });
  });

  describe("findFieldByPath", () => {
    const fields: Field[] = [
      { name: "field1", type: "text", value: "value1" },
      {
        name: "parent",
        type: "object",
        children: [
          { name: "child1", type: "text", value: "value2" },
          {
            name: "nested",
            type: "object",
            children: [{ name: "deep", type: "text", value: "value3" }],
          },
        ],
      },
    ];

    it("should find top-level field", () => {
      const result = findFieldByPath(fields, "field1");
      expect(result).toBeDefined();
      expect(result?.name).toBe("field1");
    });

    it("should find nested field", () => {
      const result = findFieldByPath(fields, "parent.child1");
      expect(result).toBeDefined();
      expect(result?.name).toBe("child1");
    });

    it("should find deeply nested field", () => {
      const result = findFieldByPath(fields, "parent.nested.deep");
      expect(result).toBeDefined();
      expect(result?.name).toBe("deep");
    });

    it("should return null for non-existent path", () => {
      const result = findFieldByPath(fields, "nonexistent");
      expect(result).toBeNull();
    });
  });

  describe("validateFieldValue", () => {
    it("should return true when no regex provided", () => {
      expect(validateFieldValue("anything")).toBe(true);
    });

    it("should validate against regex", () => {
      expect(
        validateFieldValue("test@example.com", "^[a-z]+@[a-z]+\\.com$"),
      ).toBe(true);
      expect(validateFieldValue("invalid", "^[a-z]+@[a-z]+\\.com$")).toBe(
        false,
      );
    });

    it("should return true for invalid regex", () => {
      expect(validateFieldValue("anything", "[invalid(regex")).toBe(true);
    });
  });

  describe("hasValue", () => {
    it("should return true for object type", () => {
      const field: Field = { name: "obj", type: "object" };
      expect(hasValue(field)).toBe(true);
    });

    it("should return true for array type", () => {
      const field: Field = { name: "arr", type: "array" };
      expect(hasValue(field)).toBe(true);
    });

    it("should return true for text with value", () => {
      const field: Field = { name: "text", type: "text", value: "some text" };
      expect(hasValue(field)).toBe(true);
    });

    it("should return false for text without value", () => {
      const field: Field = { name: "text", type: "text", value: "" };
      expect(hasValue(field)).toBe(false);
    });

    it("should validate text against regex", () => {
      const field: Field = {
        name: "email",
        type: "text",
        value: "invalid",
        regex: "^[a-z]+@[a-z]+\\.com$",
      };
      expect(hasValue(field)).toBe(false);
    });

    it("should return true for valid regex match", () => {
      const field: Field = {
        name: "email",
        type: "text",
        value: "test@example.com",
        regex: "^[a-z]+@[a-z]+\\.com$",
      };
      expect(hasValue(field)).toBe(true);
    });

    it("should return false for null value", () => {
      const field: Field = { name: "field", type: "text", value: null };
      expect(hasValue(field)).toBe(false);
    });

    it("should return false for undefined value", () => {
      const field: Field = { name: "field", type: "text", value: undefined };
      expect(hasValue(field)).toBe(false);
    });
  });

  describe("validateRequiredFields", () => {
    it("should return valid when all required fields are filled", () => {
      const fields: Field[] = [
        { name: "field1", type: "text", required: true, value: "filled" },
        { name: "field2", type: "number", required: true, value: 42 },
      ];

      const result = validateRequiredFields(fields);
      expect(result.valid).toBe(true);
      expect(result.missing).toHaveLength(0);
    });

    it("should detect missing required fields", () => {
      const fields: Field[] = [
        { name: "field1", type: "text", required: true, value: "" },
        { name: "field2", type: "text", required: false, value: "" },
      ];

      const result = validateRequiredFields(fields);
      expect(result.valid).toBe(false);
      expect(result.missing.length).toBeGreaterThan(0);
    });

    it("should use field title in error message", () => {
      const fields: Field[] = [
        {
          name: "username",
          type: "text",
          title: "User Name",
          required: true,
          value: "",
        },
      ];

      const result = validateRequiredFields(fields);
      expect(result.missing[0]).toContain("User Name");
    });

    it("should include field path in error message", () => {
      const fields: Field[] = [
        { name: "username", type: "text", required: true, value: "" },
      ];

      const result = validateRequiredFields(fields);
      expect(result.missing[0]).toContain("(username)");
    });

    it("should validate nested required fields", () => {
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
      expect(result.valid).toBe(false);
      expect(result.missing[0]).toContain("parent.child");
    });

    it("should indicate empty vs invalid status", () => {
      const fields: Field[] = [
        { name: "empty", type: "text", required: true, value: "" },
        {
          name: "invalid",
          type: "text",
          required: true,
          value: "bad",
          regex: "^\\d+$",
        },
      ];

      const result = validateRequiredFields(fields);
      expect(result.missing[0]).toContain("empty");
      expect(result.missing[1]).toContain("invalid");
    });
  });

  describe("buildDataStructure", () => {
    it("should build flat structure", () => {
      const fields: Field[] = [
        { name: "field1", type: "text", value: "value1" },
        { name: "field2", type: "number", value: 42 },
      ];

      const result = buildDataStructure(fields);
      expect(result).toEqual({
        field1: "value1",
        field2: 42,
      });
    });

    it("should build nested object structure", () => {
      const fields: Field[] = [
        {
          name: "parent",
          type: "object",
          children: [
            { name: "child1", type: "text", value: "value1" },
            { name: "child2", type: "number", value: 42 },
          ],
        },
      ];

      const result = buildDataStructure(fields);
      expect(result).toEqual({
        parent: {
          child1: "value1",
          child2: 42,
        },
      });
    });

    it("should build array structure", () => {
      const fields: Field[] = [
        {
          name: "items",
          type: "array",
          children: [
            { name: "0", type: "text", value: "item1" },
            { name: "1", type: "text", value: "item2" },
          ],
        },
      ];

      const result = buildDataStructure(fields);
      expect(result).toEqual({
        items: ["item1", "item2"],
      });
    });

    it("should build array of objects", () => {
      const fields: Field[] = [
        {
          name: "items",
          type: "array",
          children: [
            {
              name: "0",
              type: "object",
              children: [{ name: "field", type: "text", value: "value1" }],
            },
            {
              name: "1",
              type: "object",
              children: [{ name: "field", type: "text", value: "value2" }],
            },
          ],
        },
      ];

      const result = buildDataStructure(fields);
      expect(result).toEqual({
        items: [{ field: "value1" }, { field: "value2" }],
      });
    });

    it("should use null for undefined values", () => {
      const fields: Field[] = [
        { name: "field1", type: "text", value: undefined },
        { name: "field2", type: "text", value: "" },
      ];

      const result = buildDataStructure(fields);
      expect(result.field1).toBeNull();
      expect(result.field2).toBe("");
    });
  });

  describe("filterFields", () => {
    const fields: Field[] = [
      { name: "username", type: "text", title: "Username" },
      { name: "email", type: "text", title: "Email Address" },
      {
        name: "settings",
        type: "object",
        title: "Settings",
        children: [
          { name: "theme", type: "text", title: "Theme" },
          { name: "language", type: "text", title: "Language" },
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
      const result = filterFields(fields, "Address");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("email");
    });

    it("should be case insensitive", () => {
      const result = filterFields(fields, "USERNAME");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("username");
    });

    it("should include parent when child matches", () => {
      const result = filterFields(fields, "theme");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("settings");
      expect(result[0].children).toHaveLength(1);
      expect(result[0].children?.[0].name).toBe("theme");
    });

    it("should return empty for no matches", () => {
      const result = filterFields(fields, "nonexistent");
      expect(result).toHaveLength(0);
    });
  });

  describe("yamlToFields", () => {
    it("should convert simple object", () => {
      const yaml = {
        username: "john",
        age: 25,
        active: true,
      };

      const result = yamlToFields(yaml);
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        name: "username",
        type: "text",
        value: "john",
      });
      expect(result[1]).toEqual({ name: "age", type: "number", value: 25 });
      expect(result[2]).toEqual({
        name: "active",
        type: "boolean",
        value: true,
      });
    });

    it("should convert nested object", () => {
      const yaml = {
        user: {
          name: "john",
          email: "john@example.com",
        },
      };

      const result = yamlToFields(yaml);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("user");
      expect(result[0].type).toBe("object");
      expect(result[0].children).toHaveLength(2);
    });

    it("should convert array", () => {
      const yaml = {
        items: ["item1", "item2", "item3"],
      };

      const result = yamlToFields(yaml);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("items");
      expect(result[0].type).toBe("array");
      expect(result[0].children).toHaveLength(3);
      expect(result[0].children?.[0].value).toBe("item1");
    });

    it("should convert array of objects", () => {
      const yaml = {
        users: [
          { name: "john", age: 25 },
          { name: "jane", age: 30 },
        ],
      };

      const result = yamlToFields(yaml);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("users");
      expect(result[0].type).toBe("array");
      expect(result[0].children).toHaveLength(2);
      expect(result[0].children?.[0].type).toBe("object");
      expect(result[0].children?.[0].children).toHaveLength(2);
    });

    it("should handle mixed types in array", () => {
      const yaml = {
        mixed: ["text", 123, true],
      };

      const result = yamlToFields(yaml);
      expect(result[0].children?.[0].type).toBe("text");
      expect(result[0].children?.[1].type).toBe("number");
      expect(result[0].children?.[2].type).toBe("boolean");
    });
  });
});
