import { describe, it, expect } from "vitest";
import {
  generateZodSchema,
  getInitialValues,
  isArray,
  isNotEmptyArray,
  isString,
  generateLocaleKey,
  responseError,
  isSafeUrl,
} from "../dist/index.js";

describe("generateZodSchema & getInitialValues from dist", () => {
  const mockFields = [
    [
      {
        id: "name",
        type: "text",
        label: "Name",
        defaultValue: "Default Name",
        validation: { required: true, minLength: 3 },
      },
      {
        id: "email",
        type: "email",
        label: "Email",
        validation: { required: true },
      },
    ],
    [
      {
        id: "age",
        type: "number",
        label: "Age",
        defaultValue: 25,
        validation: { min: 18 },
      },
      {
        id: "active",
        type: "toggle",
        defaultValue: true,
      },
    ],
  ];

  it("getInitialValues should extract default values", () => {
    const initial = getInitialValues(mockFields as any);
    expect(initial.name).toBe("Default Name");
    expect(initial.age).toBe(25);
    expect(initial.active).toBe(true);
    expect(initial.email).toBeUndefined();
  });

  it("generateZodSchema should validate valid input", () => {
    const schema = generateZodSchema(mockFields as any);
    const parsed = schema.safeParse({
      name: "Alice",
      email: "alice@example.com",
      age: 30,
      active: true,
    });
    expect(parsed.success).toBe(true);
  });

  it("generateZodSchema should fail on invalid email and short name", () => {
    const schema = generateZodSchema(mockFields as any);
    const parsed = schema.safeParse({
      name: "Al", // minLength 3
      email: "not-an-email",
      age: 15, // min 18
      active: false,
    });
    expect(parsed.success).toBe(false);
  });
});

describe("main.utils from dist", () => {
  it("isArray & isNotEmptyArray", () => {
    expect(isArray([])).toBe(true);
    expect(isArray("not-an-array")).toBe(false);
    expect(isNotEmptyArray([])).toBe(false);
    expect(isNotEmptyArray([1])).toBe(true);
  });

  it("isString", () => {
    expect(isString("hello")).toBe(true);
    expect(isString(123)).toBe(false);
    expect(isString(null)).toBe(false);
  });

  it("generateLocaleKey", () => {
    expect(generateLocaleKey("First Name")).toBe("first_name");
    expect(generateLocaleKey("Email Address & Phone")).toBe("email_address_phone");
  });

  it("responseError", () => {
    expect(responseError("Custom error")).toBe("Custom error");
    expect(responseError({ response: { data: { message: "Server error" } } })).toBe("Server error");
    expect(responseError({ message: "Network error" })).toBe("Network error");
  });

  it("isSafeUrl protocol protection", () => {
    expect(isSafeUrl("https://example.com")).toBe(true);
    expect(isSafeUrl("/dashboard")).toBe(true);
    expect(isSafeUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeUrl("JAVASCRIPT:alert(1)")).toBe(false);
    expect(isSafeUrl("data:text/html,<script>alert(1)</script>")).toBe(false);
    expect(isSafeUrl("vbscript:msgbox(1)")).toBe(false);
  });
});
