import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm, FormProvider } from "react-hook-form";
import InputField from "../../src/components/form/InputField";
import PasswordField from "../../src/components/form/PasswordField";
import NumberField from "../../src/components/form/NumberField";
import TextAreaField from "../../src/components/form/TextAreaField";
import SwitchField from "../../src/components/form/SwitchField";
import CheckboxField from "../../src/components/form/CheckboxField";
import RadioField from "../../src/components/form/RadioField";
import ButtonField from "../../src/components/basic/ButtonField";
import NotFundField from "../../src/components/form/NotFundField";

function TestFormWrapper({
  children,
  defaultValues = {},
}: {
  children: (methods: any) => React.ReactNode;
  defaultValues?: Record<string, any>;
}) {
  const methods = useForm({ defaultValues });
  return <FormProvider {...methods}>{children(methods)}</FormProvider>;
}

describe("Form Fields & Inputs", () => {
  it("renders InputField and allows typing (controlled via react-hook-form)", async () => {
    const user = userEvent.setup();
    let formMethods: any;

    render(
      <TestFormWrapper defaultValues={{ username: "" }}>
        {(methods) => {
          formMethods = methods;
          return <InputField id="username" label="Username" placeholder="Enter username" />;
        }}
      </TestFormWrapper>
    );

    const input = screen.getByPlaceholderText("Enter username") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe("");

    await user.type(input, "Kamlesh");
    expect(input.value).toBe("Kamlesh");
    expect(formMethods.getValues("username")).toBe("Kamlesh");
  });

  it("renders PasswordField and handles input", async () => {
    const user = userEvent.setup();

    render(
      <TestFormWrapper defaultValues={{ password: "" }}>
        {() => (
          <PasswordField id="password" label="Password" placeholder="Enter password" />
        )}
      </TestFormWrapper>
    );

    const input = screen.getByPlaceholderText("Enter password") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.type).toBe("password");

    await user.type(input, "Secret123!");
    expect(input.value).toBe("Secret123!");
  });

  it("renders NumberField and enforces numeric input", async () => {
    const user = userEvent.setup();
    let formMethods: any;

    render(
      <TestFormWrapper defaultValues={{ age: 20 }}>
        {(methods) => {
          formMethods = methods;
          return <NumberField id="age" label="Age" placeholder="Enter age" />;
        }}
      </TestFormWrapper>
    );

    const input = screen.getByPlaceholderText("Enter age") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe("20");

    await user.clear(input);
    await user.type(input, "35");
    expect(formMethods.getValues("age")).toBe(35);
  });

  it("renders TextAreaField and allows multiline text", async () => {
    const user = userEvent.setup();

    render(
      <TestFormWrapper defaultValues={{ bio: "" }}>
        {() => <TextAreaField id="bio" placeholder="Tell us about yourself" />}
      </TestFormWrapper>
    );

    const textarea = screen.getByPlaceholderText("Tell us about yourself") as HTMLTextAreaElement;
    expect(textarea).toBeInTheDocument();

    await user.type(textarea, "Line 1\nLine 2");
    expect(textarea.value).toBe("Line 1\nLine 2");
  });

  it("renders SwitchField and toggles value", async () => {
    let formMethods: any;

    render(
      <TestFormWrapper defaultValues={{ enabled: false }}>
        {(methods) => {
          formMethods = methods;
          return <SwitchField id="enabled" />;
        }}
      </TestFormWrapper>
    );

    const switchBtn = screen.getByRole("switch");
    expect(switchBtn).toBeInTheDocument();
    expect(switchBtn).toHaveAttribute("aria-checked", "false");

    fireEvent.click(switchBtn);
    expect(formMethods.getValues("enabled")).toBe(true);
  });

  it("renders ButtonField and fires onClick callback", async () => {
    const handleClick = vi.fn();
    render(
      <ButtonField type="primary" onClick={handleClick}>
        Submit Button
      </ButtonField>
    );

    const button = screen.getByRole("button", { name: "Submit Button" });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders NotFoundField gracefully when unknown type is provided", () => {
    render(<NotFundField id="custom" type="unknown_type" span={12} />);
    expect(screen.getByText('"unknown_type" Not Found')).toBeInTheDocument();
  });

  it("renders InputField without crashing when used outside FormProvider (graceful fallback)", () => {
    render(<InputField id="uncontrolled" placeholder="Fallback Input" />);
    const input = screen.getByPlaceholderText("Fallback Input") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    fireEvent.change(input, { target: { value: "fallback text" } });
    expect(input.value).toBe("fallback text");
  });
});
