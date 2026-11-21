"use client";
import { memo } from "react";
import { Tooltip } from "antd";
import type { TextCellType } from "../types";

function TextCell({ title, text, isEllipses, isBold, color, fontSize }: any) {
  const displayTitle = title ?? text ?? "";
  const style: React.CSSProperties = {
    fontWeight: isBold ? 600 : 500,
    color: color === "primary" ? "var(--primary)" : color === "secondary" ? "var(--secondary)" : color,
    fontSize: fontSize ?? "inherit",
    lineHeight: 1.4,
    whiteSpace: isEllipses ? "nowrap" : "normal",
    overflow: isEllipses ? "hidden" : undefined,
    textOverflow: isEllipses ? "ellipsis" : undefined,
    maxWidth: isEllipses ? 200 : undefined,
    display: "block",
  };

  const content = <span style={style}>{displayTitle}</span>;

  if (isEllipses && displayTitle?.length > 25) {
    return <Tooltip title={displayTitle}>{content}</Tooltip>;
  }
  return content;
}

export default memo(TextCell);
