"use client";

import React, { useMemo } from "react";
import { FormProvider, useForm, UseFormReturn } from "react-hook-form";
import DynamicFields from "./DynamicFields";
import { useFetch } from "../../hooks/useFetch";
import api from "../../utils/api";
import type { VelocityConfig } from "velocity-http";
import getInitialValues from "../../utils/getInitialValues";
import { Skeleton } from "antd";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateZodSchema } from "../../utils/generateZodSchema";
import ButtonField from "../basic/ButtonField";
import { FieldConfig } from "../../types/formField.types";

export interface FormSchema {
  rows: FieldConfig[][];
}

export interface DynamicFormProps {
  /** Optional API endpoint to fetch form schema dynamically */
  apiUrl?: string;
  /** HTTP method if fetching from API */
  method?: "GET" | "POST";
  /** Optional HTTP options */
  options?: VelocityConfig;
  /** Pre-defined form schema if not fetching from API */
  schema?: FormSchema;
  /** Initial form values to populate or override defaults */
  initialValues?: Record<string, any>;
  /** Callback fired on successful form submission */
  onSubmit?: (data: any) => void | Promise<void>;
  /** Callback fired on validation error */
  onError?: (errors: Record<string, any>) => void;
  /** Custom label for submit button (default: "Submit") */
  submitText?: string;
  /** Whether form submission is in progress */
  isSubmitting?: boolean;
  /** Whether to show submit button (default: true) */
  showSubmitButton?: boolean;
  /** Custom class for form container */
  className?: string;
  /** Custom footer renderer */
  renderFooter?: (methods: UseFormReturn<any>) => React.ReactNode;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  apiUrl,
  method = "GET",
  options,
  schema: propSchema,
  initialValues: propInitialValues = {},
  onSubmit,
  onError,
  submitText = "Submit",
  isSubmitting = false,
  showSubmitButton = true,
  className = "w-full p-4 flex flex-col gap-4",
  renderFooter,
}) => {
  const { data, loading } = useFetch({
    client: method === "POST" ? api.post : api.get,
    url: apiUrl || "",
    dontCall: !apiUrl,
    options,
  });

  const activeSchema: FormSchema = useMemo(() => {
    if (propSchema) return propSchema;
    const apiSchema = (data as any)?.data || (data as any);
    if (apiSchema?.rows) return apiSchema;
    if (Array.isArray(apiSchema)) {
      return { rows: Array.isArray(apiSchema[0]) ? apiSchema : [apiSchema] };
    }
    return { rows: [] };
  }, [propSchema, data]);

  const defaultValues = useMemo(() => {
    const fromSchema = getInitialValues(activeSchema.rows as any);
    return { ...fromSchema, ...propInitialValues };
  }, [activeSchema.rows, propInitialValues]);

  const dynamicZodSchema = useMemo(() => {
    return generateZodSchema(activeSchema.rows as any);
  }, [activeSchema.rows]);

  const methods = useForm({
    defaultValues,
    resolver: dynamicZodSchema ? zodResolver(dynamicZodSchema) : undefined,
    mode: "onBlur",
  });

  const handleFormSubmit = methods.handleSubmit(
    async (formData) => {
      if (onSubmit) {
        await onSubmit(formData);
      }
    },
    (errors) => {
      if (onError) {
        onError(errors);
      } else if (typeof process !== "undefined" && process.env?.NODE_ENV !== "production") {
        console.warn("[antd-dynamic-ui] DynamicForm validation errors:", errors);
      }
    }
  );

  if (loading) {
    return (
      <div className="w-full h-full p-8 flex flex-col gap-8">
        <Skeleton active title paragraph={{ rows: 3 }} />
        <Skeleton active title paragraph={{ rows: 3 }} />
      </div>
    );
  }

  const flatRows = (activeSchema.rows || []).flat();

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleFormSubmit} className={className}>
        <DynamicFields rows={flatRows} methods={methods} />

        {renderFooter ? (
          renderFooter(methods)
        ) : showSubmitButton ? (
          <div className="flex justify-end mt-4">
            <ButtonField
              htmlType="submit"
              type="primary"
              loading={isSubmitting}
              className="px-8 py-2 font-bold"
            >
              {submitText}
            </ButtonField>
          </div>
        ) : null}
      </form>
    </FormProvider>
  );
};

export default DynamicForm;
