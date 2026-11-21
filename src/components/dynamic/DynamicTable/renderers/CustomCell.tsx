"use client";

import React, { memo } from "react";
import type { CustomCellType } from "../types";
import { isFunction } from "../../../../utils/main.utils";

export interface CustomCellProps extends CustomCellType {
  record?: any;
}

function CustomCell({ render, component, record }: CustomCellProps) {
  if (isFunction(render)) {
    return <>{render(record)}</>;
  }
  if (render) {
    return <>{render}</>;
  }
  if (component) {
    return <>{component}</>;
  }
  return null;
}

export default memo(CustomCell);
