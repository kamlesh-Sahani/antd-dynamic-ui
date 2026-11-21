"use client";

import { useFormContext, Control, FieldValues } from "react-hook-form";

/**
 * Hook to retrieve the active React Hook Form control instance.
 * Falls back to useFormContext() if no explicit control is provided.
 * Emits a helpful developer warning in non-production if no control is found.
 */
export function useSafeControl(
  control?: Control<FieldValues, any, FieldValues> | any,
  componentName = "FormField",
  id = ""
): Control<FieldValues, any, FieldValues> | undefined {
  const formContext = useFormContext();
  const activeControl = control || formContext?.control;

  if (!activeControl && typeof process !== "undefined" && process.env?.NODE_ENV !== "production") {
    console.warn(
      `[antd-dynamic-ui] ${componentName}${id ? ` (id="${id}")` : ""} was rendered without a "control" prop and outside of a <FormProvider>. ` +
      `Please provide "control={control}" or wrap your components in "<FormProvider {...methods}>".`
    );
  }

  return activeControl;
}

export default useSafeControl;
