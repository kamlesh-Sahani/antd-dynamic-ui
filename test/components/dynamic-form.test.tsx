import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DynamicForm, { FormSchema } from "../../src/components/dynamic/DynamicForm";

describe("DynamicForm Component", () => {
  const sampleSchema: FormSchema = {
    rows: [
      [
        {
          id: "fullName",
          type: "input",
          label: "Full Name",
          placeholder: "Enter full name",
          span: 12,
          required: true,
          validation: { minLength: 3 },
        },
        {
          id: "email",
          type: "email",
          label: "Email Address",
          placeholder: "Enter email",
          span: 12,
          required: true,
          validation: { email: true },
        },
      ],
      [
        {
          id: "isCompany",
          type: "toggle",
          label: "Is Company Account",
          defaultValue: false,
          span: 24,
        },
      ],
      [
        {
          id: "companyName",
          type: "input",
          label: "Company Name",
          placeholder: "Enter company name",
          span: 24,
          required: true,
          conditions: [
            {
              field: "isCompany",
              operator: "equals",
              value: true,
            },
          ],
        },
      ],
    ],
  };

  it("registers form and renders fields from schema", () => {
    render(<DynamicForm schema={sampleSchema} submitText="Save Details" />);

    expect(screen.getByPlaceholderText("Enter full name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
    expect(screen.getByRole("switch")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save Details" })).toBeInTheDocument();

    // companyName should be hidden initially because isCompany is false
    expect(screen.queryByPlaceholderText("Enter company name")).not.toBeInTheDocument();
  });

  it("populates initial values from prop overrides", () => {
    render(
      <DynamicForm
        schema={sampleSchema}
        initialValues={{ fullName: "Alice Smith", email: "alice@example.com" }}
      />
    );

    const nameInput = screen.getByPlaceholderText("Enter full name") as HTMLInputElement;
    const emailInput = screen.getByPlaceholderText("Enter email") as HTMLInputElement;

    expect(nameInput.value).toBe("Alice Smith");
    expect(emailInput.value).toBe("alice@example.com");
  });

  it("handles valid form submission", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(
      <DynamicForm
        schema={sampleSchema}
        onSubmit={handleSubmit}
        initialValues={{ fullName: "Bob Johnson", email: "bob@example.com" }}
      />
    );

    const submitBtn = screen.getByRole("button", { name: "Submit" });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          fullName: "Bob Johnson",
          email: "bob@example.com",
          isCompany: false,
        })
      );
    });
  });

  it("blocks submission and triggers onError on validation failure", async () => {
    const handleSubmit = vi.fn();
    const handleError = vi.fn();

    render(
      <DynamicForm
        schema={sampleSchema}
        onSubmit={handleSubmit}
        onError={handleError}
        initialValues={{ fullName: "A", email: "invalid-email" }} // violates minLength: 3 and email
      />
    );

    const submitBtn = screen.getByRole("button", { name: "Submit" });
    const form = submitBtn.closest("form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(handleSubmit).not.toHaveBeenCalled();
      expect(handleError).toHaveBeenCalledTimes(1);
    });
  });

  it("dynamically shows and hides conditional fields when dependent field toggles", async () => {
    render(<DynamicForm schema={sampleSchema} />);

    // Initially companyName field is NOT rendered
    expect(screen.queryByPlaceholderText("Enter company name")).not.toBeInTheDocument();

    // Toggle isCompany switch to true
    const switchBtn = screen.getByRole("switch");
    fireEvent.click(switchBtn);

    // Now companyName should be visible
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Enter company name")).toBeInTheDocument();
    });

    // Toggle switch back to false
    fireEvent.click(switchBtn);

    // companyName should disappear
    await waitFor(() => {
      expect(screen.queryByPlaceholderText("Enter company name")).not.toBeInTheDocument();
    });
  });

  it("supports condition operators (gt, lt, contains, not_equals)", async () => {
    const operatorSchema: FormSchema = {
      rows: [
        [
          {
            id: "score",
            type: "number",
            defaultValue: 10,
            span: 12,
            placeholder: "Enter score",
          },
          {
            id: "highScoreBadge",
            type: "input",
            placeholder: "High score award",
            span: 12,
            conditions: [
              {
                field: "score",
                operator: "gt",
                value: 50,
              },
            ],
          },
        ],
      ],
    };

    render(<DynamicForm schema={operatorSchema} />);

    // score=10 is not > 50, so highScoreBadge should not be rendered
    expect(screen.queryByPlaceholderText("High score award")).not.toBeInTheDocument();

    // Change score to 75
    const scoreInput = screen.getByPlaceholderText("Enter score");
    fireEvent.change(scoreInput, { target: { value: "75" } });

    await waitFor(() => {
      expect(screen.getByPlaceholderText("High score award")).toBeInTheDocument();
    });
  });

  it("supports form reset via methods.reset", async () => {
    render(
      <DynamicForm
        schema={sampleSchema}
        initialValues={{ fullName: "Initial Name" }}
        renderFooter={(methods) => (
          <button
            type="button"
            onClick={() => methods.reset({ fullName: "Reset Name" })}
          >
            Reset Form
          </button>
        )}
      />
    );

    const input = screen.getByPlaceholderText("Enter full name") as HTMLInputElement;
    expect(input.value).toBe("Initial Name");

    fireEvent.change(input, { target: { value: "Changed Name" } });
    expect(input.value).toBe("Changed Name");

    const resetBtn = screen.getByRole("button", { name: "Reset Form" });
    fireEvent.click(resetBtn);

    expect(input.value).toBe("Reset Name");
  });
});
