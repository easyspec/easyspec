import LZString from "lz-string";
import type { Field } from "../types";

interface EncodedForm {
  name: string;
  description?: string;
  fields: Field[];
}

/**
 * Encode form structure to a compressed URL-safe string
 */
export function encodeFormToURL(
  fields: Field[],
  name?: string,
  description?: string,
): string {
  const formData: EncodedForm = {
    name: name || "Shared Form",
    description: description,
    fields: fields,
  };

  try {
    // Convert to JSON and compress
    const json = JSON.stringify(formData);
    const compressed = LZString.compressToEncodedURIComponent(json);

    // Create full URL that opens in Builder
    const baseUrl = window.location.origin;
    return `${baseUrl}/builder/${compressed}`;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to generate share link: ${errorMessage}`);
  }
}

/**
 * Decode URL string back to form structure
 */
export function decodeURLToForm(encodedString: string): EncodedForm | null {
  try {
    // Decompress and parse
    const json = LZString.decompressFromEncodedURIComponent(encodedString);
    if (!json) {
      throw new Error("Invalid form data");
    }

    const formData = JSON.parse(json);
    return formData;
  } catch {
    // Silently return null for invalid data
    return null;
  }
}

/**
 * Check if URL length is within browser limits
 */
export function isURLSafe(url: string): boolean {
  // Most browsers support ~2000 characters
  const MAX_URL_LENGTH = 2000;
  return url.length <= MAX_URL_LENGTH;
}
