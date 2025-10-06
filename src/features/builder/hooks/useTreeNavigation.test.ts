/**
 * useTreeNavigation Hook Tests
 */

import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { Field } from "../../../types";
import { useTreeNavigation } from "./useTreeNavigation";

describe("useTreeNavigation", () => {
  const mockFields: Field[] = [
    { name: "field1", type: "text", value: "value1" },
    {
      name: "parent1",
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
    {
      name: "array1",
      type: "array",
      children: [
        { name: "0", type: "text", value: "item1" },
        { name: "1", type: "text", value: "item2" },
      ],
    },
  ];

  describe("initialization", () => {
    it("should initialize with empty expanded items", () => {
      const { result } = renderHook(() => useTreeNavigation());

      expect(result.current.expandedItems).toEqual([]);
      expect(result.current.isTreeExpanded).toBe(false);
    });

    it("should initialize with provided expanded items", () => {
      const initialExpanded = ["parent1", "array1"];
      const { result } = renderHook(() => useTreeNavigation(initialExpanded));

      expect(result.current.expandedItems).toEqual(initialExpanded);
      expect(result.current.isTreeExpanded).toBe(false);
    });
  });

  describe("toggleNodeExpansion", () => {
    it("should expand a collapsed node", () => {
      const { result } = renderHook(() => useTreeNavigation());

      act(() => {
        result.current.toggleNodeExpansion("parent1");
      });

      expect(result.current.expandedItems).toContain("parent1");
    });

    it("should collapse an expanded node", () => {
      const { result } = renderHook(() => useTreeNavigation(["parent1"]));

      act(() => {
        result.current.toggleNodeExpansion("parent1");
      });

      expect(result.current.expandedItems).not.toContain("parent1");
    });

    it("should toggle multiple nodes independently", () => {
      const { result } = renderHook(() => useTreeNavigation());

      act(() => {
        result.current.toggleNodeExpansion("parent1");
        result.current.toggleNodeExpansion("array1");
      });

      expect(result.current.expandedItems).toContain("parent1");
      expect(result.current.expandedItems).toContain("array1");

      act(() => {
        result.current.toggleNodeExpansion("parent1");
      });

      expect(result.current.expandedItems).not.toContain("parent1");
      expect(result.current.expandedItems).toContain("array1");
    });
  });

  describe("handleToggleTreeExpansion", () => {
    it("should expand all nodes when tree is collapsed", () => {
      const { result } = renderHook(() => useTreeNavigation());

      act(() => {
        result.current.handleToggleTreeExpansion(mockFields);
      });

      expect(result.current.isTreeExpanded).toBe(true);
      expect(result.current.expandedItems).toContain("parent1");
      expect(result.current.expandedItems).toContain("parent1.nested");
      expect(result.current.expandedItems).toContain("array1");
    });

    it("should collapse all nodes when tree is expanded", () => {
      const { result } = renderHook(() => useTreeNavigation());

      // First expand all
      act(() => {
        result.current.handleToggleTreeExpansion(mockFields);
      });

      expect(result.current.isTreeExpanded).toBe(true);

      // Then collapse all
      act(() => {
        result.current.handleToggleTreeExpansion(mockFields);
      });

      expect(result.current.isTreeExpanded).toBe(false);
      expect(result.current.expandedItems).toEqual([]);
    });

    it("should not include leaf nodes in expanded items", () => {
      const { result } = renderHook(() => useTreeNavigation());

      act(() => {
        result.current.handleToggleTreeExpansion(mockFields);
      });

      expect(result.current.expandedItems).not.toContain("field1");
      expect(result.current.expandedItems).not.toContain("parent1.child1");
    });

    it("should handle empty fields array", () => {
      const { result } = renderHook(() => useTreeNavigation());

      act(() => {
        result.current.handleToggleTreeExpansion([]);
      });

      expect(result.current.expandedItems).toEqual([]);
    });

    it("should handle deeply nested structures", () => {
      const deepFields: Field[] = [
        {
          name: "level1",
          type: "object",
          children: [
            {
              name: "level2",
              type: "object",
              children: [
                {
                  name: "level3",
                  type: "object",
                  children: [{ name: "level4", type: "text", value: "deep" }],
                },
              ],
            },
          ],
        },
      ];

      const { result } = renderHook(() => useTreeNavigation());

      act(() => {
        result.current.handleToggleTreeExpansion(deepFields);
      });

      expect(result.current.expandedItems).toContain("level1");
      expect(result.current.expandedItems).toContain("level1.level2");
      expect(result.current.expandedItems).toContain("level1.level2.level3");
    });
  });

  describe("setExpandedItems", () => {
    it("should allow manually setting expanded items", () => {
      const { result } = renderHook(() => useTreeNavigation());

      act(() => {
        result.current.setExpandedItems(["parent1", "array1"]);
      });

      expect(result.current.expandedItems).toEqual(["parent1", "array1"]);
    });

    it("should replace existing expanded items", () => {
      const { result } = renderHook(() => useTreeNavigation(["parent1"]));

      act(() => {
        result.current.setExpandedItems(["array1"]);
      });

      expect(result.current.expandedItems).toEqual(["array1"]);
    });
  });

  describe("edge cases", () => {
    it("should handle fields with no children", () => {
      const leafFields: Field[] = [
        { name: "field1", type: "text", value: "value1" },
        { name: "field2", type: "number", value: 42 },
      ];

      const { result } = renderHook(() => useTreeNavigation());

      act(() => {
        result.current.handleToggleTreeExpansion(leafFields);
      });

      expect(result.current.expandedItems).toEqual([]);
    });

    it("should handle fields with empty children arrays", () => {
      const emptyChildrenFields: Field[] = [
        { name: "parent", type: "object", children: [] },
      ];

      const { result } = renderHook(() => useTreeNavigation());

      act(() => {
        result.current.handleToggleTreeExpansion(emptyChildrenFields);
      });

      expect(result.current.expandedItems).toEqual([]);
    });

    it("should maintain state across multiple operations", () => {
      const { result } = renderHook(() => useTreeNavigation());

      // Expand specific nodes
      act(() => {
        result.current.toggleNodeExpansion("parent1");
        result.current.toggleNodeExpansion("array1");
      });

      expect(result.current.expandedItems).toHaveLength(2);

      // Expand all
      act(() => {
        result.current.handleToggleTreeExpansion(mockFields);
      });

      expect(result.current.isTreeExpanded).toBe(true);
      expect(result.current.expandedItems.length).toBeGreaterThan(2);

      // Collapse all
      act(() => {
        result.current.handleToggleTreeExpansion(mockFields);
      });

      expect(result.current.expandedItems).toHaveLength(0);
    });
  });
});
