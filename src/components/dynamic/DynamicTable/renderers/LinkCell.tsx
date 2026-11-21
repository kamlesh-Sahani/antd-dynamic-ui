"use client";

import React, { memo } from "react";
import { Tooltip } from "antd";
import type { LinkCellType } from "../types";
import { isNotEmptyObject } from '../../../../utils/main.utils';
import { useDynamicUI } from "../../../../context/DynamicUIContext";

export interface LinkCellProps extends LinkCellType {
  record?: any;
  onActionClick?: (data: any) => void;
}

function LinkCell({
  url,
  title,
  color,
  target,
  isEllipses,
  params,
  modalData,
  record,
  onActionClick,
}: LinkCellProps) {
  const { onNavigate } = useDynamicUI();

  const style: React.CSSProperties = {
    textDecoration: "none",
    cursor: "pointer",
    fontSize: "inherit",
    lineHeight: 1.4,
    whiteSpace: isEllipses ? "nowrap" : "normal",
    overflow: isEllipses ? "hidden" : undefined,
    textOverflow: isEllipses ? "ellipsis" : undefined,
    maxWidth: isEllipses ? 200 : undefined,
    display: "block",
    transition: "opacity 0.2s",
    fontWeight: 600,
    fontFamily: "var(--font-sans)",
    color: color || "var(--primary-color)"
  };

  const handleClick = (e?: React.SyntheticEvent) => {
    e?.stopPropagation();

    if (modalData) {
      if (onActionClick) {
        onActionClick({
          actionKey: "modal",
          title,
          modalData,
          record,
        });
      }
      return;
    }

    if (!url) {
      if (onActionClick) {
        onActionClick({
          actionKey: "click",
          title,
          record,
        });
      }
      return;
    }

    const currentSearch = typeof window !== "undefined" ? window.location.search : "";
    const paramsObj = new URLSearchParams(currentSearch);
    if (isNotEmptyObject(params)) {
      Object.keys(params).forEach((key) => {
        paramsObj.set(key, params[key] as string);
      });
    }

    const queryString = paramsObj.toString();
    const finalUrl = queryString
      ? (url.includes("?") ? `${url}&${queryString}` : `${url}?${queryString}`)
      : url;

    if (target === "_blank") {
      if (typeof window !== "undefined") {
        window.open(finalUrl, "_blank", "noopener,noreferrer");
      }
    } else if (onNavigate) {
      onNavigate(finalUrl, target);
    } else if (typeof window !== "undefined") {
      window.location.href = finalUrl;
    }
  };

  const link = (
    <div
      role="link"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      style={style}
      onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.7"; }}
      onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
      className="text-primary font-font-sans"
    >
      {title}
    </div>
  );

  if (isEllipses && title?.length > 25) {
    return <Tooltip title={title}>{link}</Tooltip>;
  }

  return link;
}

export default memo(LinkCell);
