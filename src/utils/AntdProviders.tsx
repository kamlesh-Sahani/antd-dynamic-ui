"use client";

import React, { useEffect } from "react";
import { ConfigProvider, theme, App } from "antd";

export interface AntdProviderProps {
  children: React.ReactNode;
  mode?: "light" | "dark";
  primaryColor?: string;
  token?: Record<string, any>;
}

export default function AntdProvider({
  children,
  mode = "light",
  primaryColor = "#e62e4d",
  token = {},
}: AntdProviderProps) {
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", mode === "dark");
    }
  }, [mode]);

  return (
    <ConfigProvider
      theme={{
        algorithm:
          mode === "dark"
            ? theme.darkAlgorithm
            : theme.defaultAlgorithm,
        token: {
          colorPrimary: primaryColor,
          colorSuccess: "#16A34A",
          colorWarning: "#F59E0B",
          colorError: "#DC2626",
          colorBorder: "#7F8583",
          colorBorderSecondary: "var(--background-secondary, #f3f4f6)",
          borderRadius: 5,
          fontFamily: "var(--font-sans), system-ui, sans-serif",
          controlHeight: 36,
          ...token,
        },
        components: {
          Tooltip: {
            colorBgSpotlight: "var(--background-secondary, #374151)",
            colorTextLightSolid: "var(--text-primary, #ffffff)",
          },
        },
      }}
    >
      <style id="antd-custom-scrollbar">{`
        :root, body, .ant-select-dropdown, .custom-select-dropdown {
          --rc-virtual-list-scrollbar-bg: ${primaryColor || "#e62e4d"} !important;
        }
        .ant-select-dropdown-list-scrollbar,
        .ant-select-dropdown-list-scrollbar-vertical,
        .ant-select-dropdown [class*="-scrollbar"],
        .custom-select-dropdown [class*="-scrollbar"] {
          background-color: ${primaryColor || "#e62e4d"} !important;
        }
        .ant-select-dropdown-list-scrollbar-thumb,
        .custom-select-dropdown [class*="-thumb"] {
          background-color: ${primaryColor || "#e62e4d"} !important;
          opacity: 0.8 !important;
        }
      `}</style>
      <App>{children}</App>
    </ConfigProvider>
  );
}

export { AntdProvider };
