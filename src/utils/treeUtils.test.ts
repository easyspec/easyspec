/**
 * Tree Utilities Tests
 */

import { describe, it, expect } from "vitest";
import type { Field } from "../types";
import {
  getExpandablePaths,
  getAllExpandablePaths,
  isPathExpanded,
  togglePathExpansion,
  expandAll,
  collapseAll,
  getPathDepth,
  getParentPaths,
  expandParents,
  hasExpandedChildren,
} from "./treeUtils";

describe("treeUtils", () => {
  const testFields: Field[] = [
    {
      name: "user",
      type: "object",
      children: [
        { name: "name", type: "text", value: "" },
        {
          name: "address",
          type: "object",
          children: [
            { name: "street", type: "text", value: "" },
            { name: "city", type: "text", value: "" },
          ],
        },
      ],
    },
    {
      name: "settings",
      type: "object",
      children: [{ name: "theme", type: "text", value: "" }],
    },
    { name: "email", type: "text", value: "" },
  ];

  describe("getExpandablePaths", () => {
    it("should get first level expandable paths", () => {
      const paths = getExpandablePaths(testFields, 1);

      expect(paths).toContain("user");
      expect(paths).toContain("settings");
      expect(paths).not.toContain("email"); // No children
      expect(paths).not.toContain("user.address"); // Second level
    });

    it("should get two levels of expandable paths", () => {
      const paths = getExpandablePaths(testFields, 2);

      expect(paths).toContain("user");
      expect(paths).toContain("user.address");
      expect(paths).toContain("settings");
    });

    it("should return empty array for 0 levels", () => {
      const paths = getExpandablePaths(testFields, 0);
      expect(paths).toHaveLength(0);
    });

    it("should handle nested fields correctly", () => {
      const paths = getExpandablePaths(testFields, 2);

      expect(paths).toHaveLength(3); // user, user.address, settings
    });
  });

  describe("getAllExpandablePaths", () => {
    it("should get all expandable paths", () => {
      const paths = getAllExpandablePaths(testFields);

      expect(paths).toContain("user");
      expect(paths).toContain("user.address");
      expect(paths).toContain("settings");
      expect(paths).toHaveLength(3);
    });

    it("should handle deeply nested structures", () => {
      const deepFields: Field[] = [
        {
          name: "a",
          type: "object",
          children: [
            {
              name: "b",
              type: "object",
              children: [
                {
                  name: "c",
                  type: "object",
                  children: [{ name: "d", type: "text", value: "" }],
                },
              ],
            },
          ],
        },
      ];

      const paths = getAllExpandablePaths(deepFields);
      expect(paths).toContain("a");
      expect(paths).toContain("a.b");
      expect(paths).toContain("a.b.c");
      expect(paths).toHaveLength(3);
    });
  });

  describe("isPathExpanded", () => {
    it("should return true for expanded paths", () => {
      const expanded = ["user", "settings"];
      expect(isPathExpanded("user", expanded)).toBe(true);
      expect(isPathExpanded("settings", expanded)).toBe(true);
    });

    it("should return false for non-expanded paths", () => {
      const expanded = ["user"];
      expect(isPathExpanded("settings", expanded)).toBe(false);
      expect(isPathExpanded("user.address", expanded)).toBe(false);
    });
  });

  describe("togglePathExpansion", () => {
    it("should add path if not expanded", () => {
      const expanded = ["user"];
      const result = togglePathExpansion("settings", expanded);

      expect(result).toContain("user");
      expect(result).toContain("settings");
      expect(result).toHaveLength(2);
    });

    it("should remove path if already expanded", () => {
      const expanded = ["user", "settings"];
      const result = togglePathExpansion("user", expanded);

      expect(result).not.toContain("user");
      expect(result).toContain("settings");
      expect(result).toHaveLength(1);
    });

    it("should not modify original array", () => {
      const expanded = ["user"];
      togglePathExpansion("settings", expanded);

      expect(expanded).toHaveLength(1);
      expect(expanded).toContain("user");
    });
  });

  describe("expandAll", () => {
    it("should return all expandable paths", () => {
      const result = expandAll(testFields);

      expect(result).toContain("user");
      expect(result).toContain("user.address");
      expect(result).toContain("settings");
    });
  });

  describe("collapseAll", () => {
    it("should return empty array", () => {
      const result = collapseAll();
      expect(result).toHaveLength(0);
    });
  });

  describe("getPathDepth", () => {
    it("should return 0 for empty path", () => {
      expect(getPathDepth("")).toBe(0);
    });

    it("should return 1 for top-level path", () => {
      expect(getPathDepth("user")).toBe(1);
    });

    it("should return 2 for second-level path", () => {
      expect(getPathDepth("user.address")).toBe(2);
    });

    it("should return correct depth for deep paths", () => {
      expect(getPathDepth("a.b.c.d.e")).toBe(5);
    });
  });

  describe("getParentPaths", () => {
    it("should return empty array for top-level path", () => {
      expect(getParentPaths("user")).toHaveLength(0);
    });

    it("should return parent for second-level path", () => {
      const parents = getParentPaths("user.address");
      expect(parents).toEqual(["user"]);
    });

    it("should return all parents for deep path", () => {
      const parents = getParentPaths("a.b.c.d");
      expect(parents).toEqual(["a", "a.b", "a.b.c"]);
    });
  });

  describe("expandParents", () => {
    it("should add all parent paths", () => {
      const expanded: string[] = [];
      const result = expandParents("user.address.street", expanded);

      expect(result).toContain("user");
      expect(result).toContain("user.address");
      expect(result).toHaveLength(2);
    });

    it("should not duplicate existing expanded paths", () => {
      const expanded = ["user"];
      const result = expandParents("user.address.street", expanded);

      expect(result).toContain("user");
      expect(result).toContain("user.address");
      expect(result).toHaveLength(2);
    });

    it("should handle top-level paths", () => {
      const expanded: string[] = [];
      const result = expandParents("user", expanded);

      expect(result).toHaveLength(0);
    });
  });

  describe("hasExpandedChildren", () => {
    it("should return true if children are expanded", () => {
      const expanded = ["user", "user.address"];
      expect(hasExpandedChildren("user", expanded)).toBe(true);
    });

    it("should return false if no children are expanded", () => {
      const expanded = ["user"];
      expect(hasExpandedChildren("user", expanded)).toBe(false);
    });

    it("should work with deep nesting", () => {
      const expanded = ["a.b.c"];
      expect(hasExpandedChildren("a", expanded)).toBe(true);
      expect(hasExpandedChildren("a.b", expanded)).toBe(true);
      expect(hasExpandedChildren("a.b.c", expanded)).toBe(false);
    });
  });
});
