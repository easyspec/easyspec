import pako from "pako";
import type { Field } from "../types";

interface EncodedForm {
  name: string;
  description?: string;
  fields: Field[];
}

/**
 * Base64url encode (URL-safe, no padding)
 */
function base64urlEncode(buffer: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...buffer));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

/**
 * Base64url decode
 */
function base64urlDecode(str: string): Uint8Array {
  // Add back padding and convert to standard base64
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(base64 + padding);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

/**
 * Encode form structure to a compressed URL-safe string
 * Uses gzip compression + base64url encoding for ~40% shorter URLs
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
    // Convert to JSON and compress with gzip
    const json = JSON.stringify(formData);
    const compressed = pako.deflate(json, { level: 9 });
    const encoded = base64urlEncode(compressed);

    // Use fragment (#) instead of path - allows longer URLs
    const baseUrl = window.location.origin;
    return `${baseUrl}/builder#${encoded}`;
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
    // Decode and decompress
    const buffer = base64urlDecode(encodedString);
    const json = pako.inflate(buffer, { to: "string" });
    const formData = JSON.parse(json);
    return formData;
  } catch {
    // Silently return null for invalid data
    return null;
  }
}

/**
 * Check if URL length is within browser limits
 * Fragments can be much longer than paths (~8KB vs ~2KB)
 */
export function isURLSafe(url: string): boolean {
  const MAX_URL_LENGTH = 8000; // Fragment allows longer URLs
  return url.length <= MAX_URL_LENGTH;
}
