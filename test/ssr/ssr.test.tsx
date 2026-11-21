import React from "react";
import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import {
  DynamicForm,
  DynamicTable,
  InputField,
  ButtonField,
  DynamicUIProvider,
  AntdProvider,
  ErrorApi,
  generateZodSchema,
  getInitialValues,
  isSafeUrl,
} from "../../src/index";

describe("SSR (Server-Side Rendering) Compatibility", () => {
  it("renders ButtonField to HTML string on server", () => {
    const html = renderToString(
      <AntdProvider>
        <ButtonField type="primary">Server Button</ButtonField>
      </AntdProvider>
    );
    expect(html).toContain("Server Button");
    expect(html).toContain("ant-btn");
  });

  it("renders ErrorApi to HTML string on server", () => {
    const html = renderToString(
      <ErrorApi message="Something went wrong" onRetry={() => {}} />
    );
    expect(html).toContain("Something went wrong");
  });

  it("renders DynamicForm to HTML string on server without crashing", () => {
    const html = renderToString(
      <AntdProvider>
        <DynamicForm
          schema={{
            rows: [
              [
                { id: "firstName", type: "input", label: "First Name" },
                { id: "lastName", type: "input", label: "Last Name" },
              ],
            ],
          }}
          submitText="Submit Profile"
        />
      </AntdProvider>
    );
    expect(html).toContain("First Name");
    expect(html).toContain("Last Name");
    expect(html).toContain("Submit Profile");
  });

  it("renders DynamicTable to HTML string on server without crashing", () => {
    const html = renderToString(
      <AntdProvider>
        <DynamicUIProvider>
          <DynamicTable
            filterKey="ssr_table"
            apiData={{
              total: 1,
              columns: [{ id: "title", title: "Item Title" }],
              rows: [{ id: "1", title: "Item 1" }],
            }}
          />
        </DynamicUIProvider>
      </AntdProvider>
    );
    expect(html).toContain("Item Title");
  });

  it("executes schema generator utilities on server", () => {
    const schema = generateZodSchema([
      [{ id: "email", type: "email", required: true }],
    ]);
    expect(schema.safeParse({ email: "test@example.com" }).success).toBe(true);
    expect(schema.safeParse({ email: "invalid" }).success).toBe(false);
  });
});
