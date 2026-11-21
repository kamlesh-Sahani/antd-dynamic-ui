import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  generateZodSchema,
  getInitialValues,
  isArray,
  isNotEmptyArray,
  isString,
  generateLocaleKey,
  responseError,
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

  test("getInitialValues should extract default values", () => {
    const initial = getInitialValues(mockFields);
    assert.equal(initial.name, "Default Name");
    assert.equal(initial.age, 25);
    assert.equal(initial.active, true);
    assert.equal(initial.email, undefined);
  });

  test("generateZodSchema should validate valid input", () => {
    const schema = generateZodSchema(mockFields);
    const parsed = schema.safeParse({
      name: "Alice",
      email: "alice@example.com",
      age: 30,
      active: true,
    });
    assert.equal(parsed.success, true);
  });

  test("generateZodSchema should fail on invalid email and short name", () => {
    const schema = generateZodSchema(mockFields);
    const parsed = schema.safeParse({
      name: "Al", // minLength 3
      email: "not-an-email",
      age: 15, // min 18
      active: false,
    });
    assert.equal(parsed.success, false);
  });
});

describe("main.utils from dist", () => {
  test("isArray & isNotEmptyArray", () => {
    assert.equal(isArray([]), true);
    assert.equal(isArray("not-an-array"), false);
    assert.equal(isNotEmptyArray([]), false);
    assert.equal(isNotEmptyArray([1]), true);
  });

  test("isString", () => {
    assert.equal(isString("hello"), true);
    assert.equal(isString(123), false);
    assert.equal(isString(null), false);
  });

  test("generateLocaleKey", () => {
    assert.equal(generateLocaleKey("First Name"), "first_name");
    assert.equal(generateLocaleKey("Email Address & Phone"), "email_address_phone");
  });

  test("responseError", () => {
    assert.equal(responseError("Custom error"), "Custom error");
    assert.equal(responseError({ response: { data: { message: "Server error" } } }), "Server error");
    assert.equal(responseError({ message: "Network error" }), "Network error");
    assert.equal(responseError({}), "Something went wrong");
  });
});
