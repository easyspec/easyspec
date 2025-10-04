import type { Field } from "../types";

const STORAGE_KEY = "easyspec_form_draft";
const STORAGE_TIMESTAMP_KEY = "easyspec_form_draft_timestamp";

/**
 * Browser storage utility for form persistence
 * KISS principle - simple localStorage wrapper
 */
export const formStorage = {
  /**
   * Save form fields to localStorage
   */
  save(fields: Field[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fields));
      localStorage.setItem(STORAGE_TIMESTAMP_KEY, new Date().toISOString());
    } catch (error) {
      console.warn("Failed to save form to localStorage:", error);
    }
  },

  /**
   * Load form fields from localStorage
   */
  load(): Field[] | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn("Failed to load form from localStorage:", error);
      return null;
    }
  },

  /**
   * Get last save timestamp
   */
  getLastSaved(): Date | null {
    try {
      const timestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY);
      return timestamp ? new Date(timestamp) : null;
    } catch {
      return null;
    }
  },

  /**
   * Check if there's a saved draft
   */
  hasDraft(): boolean {
    return localStorage.getItem(STORAGE_KEY) !== null;
  },

  /**
   * Clear saved draft
   */
  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_TIMESTAMP_KEY);
  },
};
