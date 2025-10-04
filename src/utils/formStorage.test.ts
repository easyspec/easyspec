import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { formStorage } from "./formStorage";
import type { Field } from "../types";

describe("formStorage", () => {
  const testFields: Field[] = [
    { name: "username", type: "text", title: "Username" },
    { name: "email", type: "email", title: "Email" },
  ];

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("saves fields to localStorage", () => {
    formStorage.save(testFields);

    const saved = localStorage.getItem("easyspec_form_draft");
    expect(saved).toBeTruthy();
    expect(JSON.parse(saved!)).toEqual(testFields);
  });

  it("loads fields from localStorage", () => {
    formStorage.save(testFields);

    const loaded = formStorage.load();
    expect(loaded).toEqual(testFields);
  });

  it("returns null when no draft exists", () => {
    const loaded = formStorage.load();
    expect(loaded).toBeNull();
  });

  it("checks if draft exists", () => {
    expect(formStorage.hasDraft()).toBe(false);

    formStorage.save(testFields);
    expect(formStorage.hasDraft()).toBe(true);
  });

  it("clears saved draft", () => {
    formStorage.save(testFields);
    expect(formStorage.hasDraft()).toBe(true);

    formStorage.clear();
    expect(formStorage.hasDraft()).toBe(false);
  });

  it("stores timestamp when saving", () => {
    formStorage.save(testFields);

    const timestamp = formStorage.getLastSaved();
    expect(timestamp).toBeInstanceOf(Date);
  });

  it("handles invalid JSON gracefully", () => {
    localStorage.setItem("easyspec_form_draft", "invalid json");

    const loaded = formStorage.load();
    expect(loaded).toBeNull();
  });
});
