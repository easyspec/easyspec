/**
 * Form URL Encoder Tests
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import type { Field } from "../types";
import { encodeFormToURL, decodeURLToForm, isURLSafe } from "./formUrlEncoder";

describe("formUrlEncoder", () => {
  // Mock window.location
  const originalLocation = window.location;

  beforeEach(() => {
    Object.defineProperty(window, "location", {
      value: { origin: "https://example.com" },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: true,
      configurable: true,
    });
  });

  describe("encodeFormToURL", () => {
    it("should encode simple form structure", () => {
      const fields: Field[] = [
        { name: "field1", type: "text", value: "value1" },
        { name: "field2", type: "number", value: 42 },
      ];

      const result = encodeFormToURL(fields, "Test Form", "A test description");

      expect(result).toContain("https://example.com/builder#");
      expect(result.length).toBeGreaterThan(
        "https://example.com/builder#".length,
      );
    });

    it("should use default name when not provided", () => {
      const fields: Field[] = [
        { name: "field1", type: "text", value: "value1" },
      ];

      const url = encodeFormToURL(fields);
      const encoded = url.replace("https://example.com/builder#", "");
      const decoded = decodeURLToForm(encoded);

      expect(decoded?.name).toBe("Shared Form");
    });

    it("should include description when provided", () => {
      const fields: Field[] = [
        { name: "field1", type: "text", value: "value1" },
      ];

      const url = encodeFormToURL(fields, "My Form", "My Description");
      const encoded = url.replace("https://example.com/builder#", "");
      const decoded = decodeURLToForm(encoded);

      expect(decoded?.description).toBe("My Description");
    });

    it("should encode nested field structure", () => {
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

      const url = encodeFormToURL(fields, "Nested Form");
      const encoded = url.replace("https://example.com/builder#", "");
      const decoded = decodeURLToForm(encoded);

      expect(decoded?.fields).toHaveLength(1);
      expect(decoded?.fields[0].children).toHaveLength(2);
    });

    it("should handle array fields", () => {
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

      const url = encodeFormToURL(fields, "Array Form");
      const encoded = url.replace("https://example.com/builder#", "");
      const decoded = decodeURLToForm(encoded);

      expect(decoded?.fields[0].type).toBe("array");
      expect(decoded?.fields[0].children).toHaveLength(2);
    });

    it("should throw error on encoding failure", () => {
      // Create a circular reference that will fail JSON.stringify
      const circularField: Field = { name: "circular", type: "object" };
      circularField.children = [circularField];

      expect(() => encodeFormToURL([circularField])).toThrow(
        "Failed to generate share link",
      );
    });
  });

  describe("decodeURLToForm", () => {
    it("should decode valid encoded string", () => {
      const fields: Field[] = [
        { name: "field1", type: "text", value: "value1" },
        { name: "field2", type: "number", value: 42 },
      ];

      const url = encodeFormToURL(fields, "Test Form", "Test Description");
      const encoded = url.replace("https://example.com/builder#", "");
      const decoded = decodeURLToForm(encoded);

      expect(decoded).toBeDefined();
      expect(decoded?.name).toBe("Test Form");
      expect(decoded?.description).toBe("Test Description");
      expect(decoded?.fields).toHaveLength(2);
    });

    it("should preserve field values", () => {
      const fields: Field[] = [
        { name: "text", type: "text", value: "hello" },
        { name: "number", type: "number", value: 123 },
        { name: "boolean", type: "boolean", value: true },
      ];

      const url = encodeFormToURL(fields);
      const encoded = url.replace("https://example.com/builder#", "");
      const decoded = decodeURLToForm(encoded);

      expect(decoded?.fields[0].value).toBe("hello");
      expect(decoded?.fields[1].value).toBe(123);
      expect(decoded?.fields[2].value).toBe(true);
    });

    it("should preserve field metadata", () => {
      const fields: Field[] = [
        {
          name: "field1",
          type: "text",
          title: "Field Title",
          description: "Field description",
          required: true,
          regex: "^[a-z]+$",
          value: "test",
        },
      ];

      const url = encodeFormToURL(fields);
      const encoded = url.replace("https://example.com/builder#", "");
      const decoded = decodeURLToForm(encoded);

      const field = decoded?.fields[0];
      expect(field?.title).toBe("Field Title");
      expect(field?.description).toBe("Field description");
      expect(field?.required).toBe(true);
      expect(field?.regex).toBe("^[a-z]+$");
    });

    it("should return null for invalid encoded string", () => {
      const result = decodeURLToForm("invalid-encoded-string");
      expect(result).toBeNull();
    });

    it("should return null for empty string", () => {
      const result = decodeURLToForm("");
      expect(result).toBeNull();
    });

    it("should handle decode errors gracefully", () => {
      const result = decodeURLToForm("completely-invalid-data!!!");

      expect(result).toBeNull();
    });

    it("should preserve nested structures", () => {
      const fields: Field[] = [
        {
          name: "level1",
          type: "object",
          children: [
            {
              name: "level2",
              type: "object",
              children: [{ name: "level3", type: "text", value: "deep value" }],
            },
          ],
        },
      ];

      const url = encodeFormToURL(fields);
      const encoded = url.replace("https://example.com/builder#", "");
      const decoded = decodeURLToForm(encoded);

      expect(decoded?.fields[0].children?.[0].children?.[0].value).toBe(
        "deep value",
      );
    });
  });

  describe("isURLSafe", () => {
    it("should return true for short URLs", () => {
      const shortURL = "https://example.com/builder#abc123";
      expect(isURLSafe(shortURL)).toBe(true);
    });

    it("should return true for URLs under 8000 characters", () => {
      const url = "https://example.com/" + "a".repeat(7900);
      expect(isURLSafe(url)).toBe(true);
    });

    it("should return true for URLs exactly 8000 characters", () => {
      const url = "a".repeat(8000);
      expect(isURLSafe(url)).toBe(true);
    });

    it("should return false for URLs over 8000 characters", () => {
      const url = "a".repeat(8001);
      expect(isURLSafe(url)).toBe(false);
    });

    it("should return false for very long URLs", () => {
      const url = "https://example.com/" + "a".repeat(10000);
      expect(isURLSafe(url)).toBe(false);
    });
  });

  describe("round-trip encoding/decoding", () => {
    it("should maintain data integrity through encode/decode cycle", () => {
      const fields: Field[] = [
        { name: "text", type: "text", value: "hello world" },
        { name: "number", type: "number", value: 42 },
        { name: "boolean", type: "boolean", value: false },
        {
          name: "nested",
          type: "object",
          children: [{ name: "child", type: "text", value: "nested value" }],
        },
        {
          name: "array",
          type: "array",
          children: [
            { name: "0", type: "text", value: "item1" },
            { name: "1", type: "text", value: "item2" },
          ],
        },
      ];

      const url = encodeFormToURL(
        fields,
        "Complex Form",
        "A complex test form",
      );
      const encoded = url.replace("https://example.com/builder#", "");
      const decoded = decodeURLToForm(encoded);

      expect(decoded?.name).toBe("Complex Form");
      expect(decoded?.description).toBe("A complex test form");
      expect(decoded?.fields).toHaveLength(5);
      expect(decoded?.fields[0].value).toBe("hello world");
      expect(decoded?.fields[1].value).toBe(42);
      expect(decoded?.fields[2].value).toBe(false);
      expect(decoded?.fields[3].children?.[0].value).toBe("nested value");
      expect(decoded?.fields[4].children).toHaveLength(2);
    });

    it("should handle special characters", () => {
      const fields: Field[] = [
        {
          name: "special",
          type: "text",
          value: "!@#$%^&*(){}[]|\\:\";'<>,.?/",
        },
      ];

      const url = encodeFormToURL(fields);
      const encoded = url.replace("https://example.com/builder#", "");
      const decoded = decodeURLToForm(encoded);

      expect(decoded?.fields[0].value).toBe("!@#$%^&*(){}[]|\\:\";'<>,.?/");
    });

    it("should handle unicode characters", () => {
      const fields: Field[] = [
        { name: "unicode", type: "text", value: "你好世界 🌍 Здравствуй мир" },
      ];

      const url = encodeFormToURL(fields);
      const encoded = url.replace("https://example.com/builder#", "");
      const decoded = decodeURLToForm(encoded);

      expect(decoded?.fields[0].value).toBe("你好世界 🌍 Здравствуй мир");
    });

    it("should handle empty fields", () => {
      const fields: Field[] = [
        { name: "empty", type: "text", value: "" },
        { name: "null", type: "text", value: null },
        { name: "undefined", type: "text", value: undefined },
      ];

      const url = encodeFormToURL(fields);
      const encoded = url.replace("https://example.com/builder#", "");
      const decoded = decodeURLToForm(encoded);

      expect(decoded?.fields[0].value).toBe("");
      expect(decoded?.fields[1].value).toBeNull();
      expect(decoded?.fields[2].value).toBeUndefined();
    });
  });
});
