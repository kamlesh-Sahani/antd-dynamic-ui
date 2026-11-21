"use client";

import React, { useMemo } from "react";
import classNames from "classnames";
import { FieldConfig } from "../../types/formField.types";
import { isString, generateLocaleKey } from "../../utils/main.utils";
import { useDynamicUI } from "../../context/DynamicUIContext";

export type TextFieldProps = {
  children?: React.ReactNode;
  name?: string;
  className?: string;
  as?: React.ElementType;
} & React.HTMLAttributes<HTMLElement> & Partial<FieldConfig>;

const TextField: React.FC<TextFieldProps> = (props) => {
  const { children, name, className, as, style = {}, fontSize, color, fontWeight, label, ...rest } = props;
  const { t } = useDynamicUI();
  const text = isString(children) ? children : (label || "");

  const key = name || generateLocaleKey(text);
  const localeText = t ? t(key, text) : text;

  const Element = as || "div";

  const customStyle = useMemo(() => {
    const s: React.CSSProperties = { ...style };
    if (fontSize) {
      s.fontSize = fontSize;
    }
    if (color) {
      s.color = color;
    }
    if (fontWeight) {
      s.fontWeight = fontWeight;
    }
    return s;
  }, [style, fontSize, color, fontWeight]);

  return (
    <Element className={classNames(className)} style={customStyle} {...rest}>
      {localeText}
    </Element>
  );
};

export { TextField };
export default TextField;
