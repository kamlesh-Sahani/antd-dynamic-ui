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

describe("additional utilities from dist", () => {
  it("adjustColor tints and shades hex colors", async () => {
    const { adjustColor } = await import("../dist/utils/adjust-color/index.js");
    const lighter = adjustColor("#000000", 50);
    const darker = adjustColor("#ffffff", -50);
    expect(lighter).toMatch(/^#[0-9a-f]{6}$/i);
    expect(darker).toMatch(/^#[0-9a-f]{6}$/i);
    expect(lighter).not.toBe("#000000");
    expect(darker).not.toBe("#ffffff");
  });

  it("numberToWords converts currency figures to words", async () => {
    const { numberToWords } = await import("../dist/utils/number-to-words/index.js");
    expect(numberToWords(100, "USD")).toBe("One Hundred United States Dollar Only");
    expect(numberToWords(0, "USD")).toBe("Zero United States Dollar Only");
    expect(numberToWords(1250.75, "USD")).toBe("One Thousand Two Hundred Fifty United States Dollar And Seventy Five Cents Only");
  });

  it("main.utils type guards and helpers", async () => {
    const {
      isObject,
      isNotEmptyObject,
      isNotEmpty,
      isNumber,
      isNotEmptyNumber,
      isBoolean,
      isNotEmptyBoolean,
      debounce,
    } = await import("../dist/utils/main/index.js");

    expect(isObject({})).toBe(true);
    expect(isObject([])).toBe(false);
    expect(isNotEmptyObject({})).toBe(false);
    expect(isNotEmptyObject({ a: 1 })).toBe(true);

    expect(isNumber(42)).toBe(true);
    expect(isNumber(NaN)).toBe(false);
    expect(isNotEmptyNumber(0)).toBe(false);
    expect(isNotEmptyNumber(42)).toBe(true);

    expect(isBoolean(true)).toBe(true);
    expect(isNotEmptyBoolean(true)).toBe(true);
    expect(isNotEmptyBoolean(false)).toBe(false);

    expect(isNotEmpty("hello")).toBe(true);
    expect(isNotEmpty("   ")).toBe(false);
    expect(isNotEmpty([1])).toBe(true);
    expect(isNotEmpty([])).toBe(false);
    expect(isNotEmpty({ a: 1 })).toBe(true);
    expect(isNotEmpty({})).toBe(false);

    let called = 0;
    const fn = debounce(() => {
      called++;
    }, 50);
    fn();
    fn();
    expect(called).toBe(0);
  });
});
