import type { Field } from "../../types";

/**
 * Create a test field with defaults
 */
export function createTestField(overrides: Partial<Field> = {}): Field {
  return {
    name: "testField",
    type: "text",
    title: "Test Field",
    placeholder: "Enter value",
    description: "Test description",
    required: false,
    ...overrides,
  };
}

/**
 * Create array of test fields
 */
export function createTestFields(
  count: number,
  overrides: Partial<Field> = {},
): Field[] {
  return Array.from({ length: count }, (_, i) =>
    createTestField({ name: `field${i}`, title: `Field ${i}`, ...overrides }),
  );
}

/**
 * Create nested object field
 */
export function createObjectField(
  children: Field[],
  overrides: Partial<Field> = {},
): Field {
  return createTestField({
    type: "object",
    children,
    ...overrides,
  });
}

/**
 * Create array field
 */
export function createArrayField(overrides: Partial<Field> = {}): Field {
  return createTestField({
    type: "array",
    children: [createTestField({ name: "item", title: "Item" })],
    ...overrides,
  });
}
