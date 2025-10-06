import { useState, useCallback } from "react";
import type { Field } from "../../../types";

export const useTreeNavigation = (initialExpandedItems: string[] = []) => {
  const [expandedItems, setExpandedItems] =
    useState<string[]>(initialExpandedItems);
  const [isTreeExpanded, setIsTreeExpanded] = useState(false);

  // Get all expandable paths
  const getAllExpandablePaths = useCallback(
    (fields: Field[], parentPath: string = ""): string[] => {
      let paths: string[] = [];
      fields.forEach((field) => {
        const fieldPath = parentPath
          ? `${parentPath}.${field.name}`
          : field.name;
        if (field.children && field.children.length > 0) {
          paths.push(fieldPath);
          paths = paths.concat(
            getAllExpandablePaths(field.children, fieldPath),
          );
        }
      });
      return paths;
    },
    [],
  );

  // Toggle tree expansion
  const handleToggleTreeExpansion = useCallback(
    (fields: Field[]) => {
      if (isTreeExpanded) {
        setExpandedItems([]);
        setIsTreeExpanded(false);
      } else {
        const allPaths = getAllExpandablePaths(fields);
        setExpandedItems(allPaths);
        setIsTreeExpanded(true);
      }
    },
    [getAllExpandablePaths, isTreeExpanded],
  );

  // Toggle node expansion
  const toggleNodeExpansion = useCallback((path: string) => {
    setExpandedItems((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path],
    );
  }, []);

  return {
    expandedItems,
    isTreeExpanded,
    toggleNodeExpansion,
    handleToggleTreeExpansion,
    setExpandedItems,
  };
};
