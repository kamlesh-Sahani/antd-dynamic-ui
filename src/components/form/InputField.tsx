import { Form, Input } from "antd";
import { FieldConfig } from '../../types/formField.types';
import classNames from "classnames";
import { Control, Controller, FieldValues } from "react-hook-form";
import { useSafeControl } from "../../hooks/useSafeControl";

import { RegisterOptions } from "react-hook-form";

export interface InputFieldProps extends Omit<Partial<FieldConfig>, 'type'> {
  id: string;
  name?: string;
  onChange?: (val: any) => void;
  className?: string;
  control?: Control<FieldValues, any, FieldValues>;
  addonAfter?: React.ReactNode;
  addonBefore?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  type?: string;
  maxLength?: number;
  rules?: RegisterOptions;
  autoComplete?: string;
}

export function InputField(props: InputFieldProps) {
  const {
    placeholder,
    disabled,
    onChange,
    type: _type,
    className,
    id,
    name,
    control,
    rules,
    autoComplete,
    label,
    span,
    options,
    required,
    defaultValue,
    conditions,
    tooltip,
    helpText,
    validation,
    mongoId,
    status,
    createdAt,
    updatedAt,
    deletedAt,
    ...rest
  } = props as any;

  const activeControl = useSafeControl(control, "InputField", id);

  if (!activeControl) {
    return (
      <Input
        id={id}
        placeholder={placeholder}
        disabled={disabled}
        size="middle"
        className={classNames("w-full hover:border-primary-400 transition-all", className)}
        onChange={(e) => onChange?.(e.target.value)}
        {...rest}
      />
    );
  }

  return (
    <Controller
      name={name || id}
      control={activeControl}
      rules={rules}
      render={({ field, fieldState }) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          field.onChange(e.target.value);
          onChange?.(e.target.value);
        };

        if (_type === "password") {
          return (
            <Form.Item
              validateStatus={fieldState.error ? "error" : ""}
              help={fieldState.error?.message}
              className="mb-0"
            >
              <Input.Password
                id={id}
                aria-invalid={Boolean(fieldState.error)}
                className={classNames("w-full hover:border-primary-400 transition-all", className)}
                placeholder={placeholder}
                disabled={disabled}
                size="middle"
                autoComplete={autoComplete || "new-password"}
                {...field}
                onChange={handleChange}
                {...rest}
              />
            </Form.Item>
          );
        }

        return (
          <Form.Item
            validateStatus={fieldState.error ? "error" : ""}
            help={fieldState.error?.message}
            className="mb-0"
          >
            <Input
              id={id}
              aria-invalid={Boolean(fieldState.error)}
              type={_type}
              className={classNames("w-full hover:border-primary-400 transition-all", className)}
              placeholder={placeholder}
              disabled={disabled}
              size="middle"
              autoComplete={autoComplete}
              {...field}
              onChange={handleChange}
              {...rest}
            />
          </Form.Item>
        );
      }}
    />
  );
}

export default InputField;
