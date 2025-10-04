/**
 * Tree Utilities
 * Helper functions for tree navigation and expansion
 */

import type { Field } from "../types";
import { buildPath } from "./fieldUtils";

/**
 * Get all expandable paths up to a specified depth
 * @param fields - Array of fields to traverse
 * @param levels - Number of levels to expand (1 = first level only, 2 = first and second, etc.)
 * @param parentPath - Current parent path (used for recursion)
 * @returns Array of paths that can be expanded
 */
export const getExpandablePaths = (
  fields: Field[],
  levels: number = 1,
  parentPath: string = "",
): string[] => {
  if (levels <= 0) return [];

  const paths: string[] = [];

  fields.forEach((field) => {
    const fieldPath = buildPath(parentPath, field.name);

    // If field has children, it's expandable
    if (field.children && field.children.length > 0) {
      paths.push(fieldPath);

      // If we need to go deeper, recurse
      if (levels > 1) {
        const childPaths = getExpandablePaths(
          field.children,
          levels - 1,
          fieldPath,
        );
        paths.push(...childPaths);
      }
    }
  });

  return paths;
};

/**
 * Get all expandable paths (fully expand tree)
 */
export const getAllExpandablePaths = (
  fields: Field[],
  parentPath: string = "",
): string[] => {
  const paths: string[] = [];

  fields.forEach((field) => {
    const fieldPath = buildPath(parentPath, field.name);

    if (field.children && field.children.length > 0) {
      paths.push(fieldPath);
      const childPaths = getAllExpandablePaths(field.children, fieldPath);
      paths.push(...childPaths);
    }
  });

  return paths;
};

/**
 * Check if a path is currently expanded
 */
export const isPathExpanded = (
  path: string,
  expandedItems: string[],
): boolean => {
  return expandedItems.includes(path);
};

/**
 * Toggle expansion of a single path
 */
export const togglePathExpansion = (
  path: string,
  expandedItems: string[],
): string[] => {
  if (expandedItems.includes(path)) {
    return expandedItems.filter((p) => p !== path);
  }
  return [...expandedItems, path];
};

/**
 * Expand all paths in the tree
 */
export const expandAll = (fields: Field[]): string[] => {
  return getAllExpandablePaths(fields);
};

/**
 * Collapse all paths in the tree
 */
export const collapseAll = (): string[] => {
  return [];
};

/**
 * Get depth of a path (number of levels)
 */
export const getPathDepth = (path: string): number => {
  if (!path) return 0;
  return path.split(".").length;
};

/**
 * Get parent paths for a given path
 * Example: 'a.b.c' returns ['a', 'a.b']
 */
export const getParentPaths = (path: string): string[] => {
  const parts = path.split(".");
  const parentPaths: string[] = [];

  for (let i = 1; i < parts.length; i++) {
    parentPaths.push(parts.slice(0, i).join("."));
  }

  return parentPaths;
};

/**
 * Ensure all parent paths are expanded for a given path
 */
export const expandParents = (
  path: string,
  expandedItems: string[],
): string[] => {
  const parents = getParentPaths(path);
  const newExpanded = new Set(expandedItems);

  parents.forEach((parent) => newExpanded.add(parent));

  return Array.from(newExpanded);
};

/**
 * Check if any children of a path are expanded
 */
export const hasExpandedChildren = (
  path: string,
  expandedItems: string[],
): boolean => {
  return expandedItems.some((item) => item.startsWith(path + "."));
};
