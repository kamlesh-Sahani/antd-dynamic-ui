"use client";

import React, { createContext, useContext, useMemo } from "react";

export interface DynamicUITheme {
  primaryColor?: string;
  mode?: "light" | "dark";
  borderRadius?: number;
}

export interface DynamicUIContextValue {
  /** Optional custom API client (e.g. Velocity instance, Axios instance, or fetch wrapper) */
  apiClient?: any;
  /** Navigation callback (e.g. router.push from next/navigation or useNavigate from react-router) */
  onNavigate?: (url: string, target?: string) => void;
  /** Localization dictionary: key -> localized text */
  locales?: Record<string, string>;
  /** Localization function */
  t?: (key: string, fallback?: string) => string;
  /** Permission checker for action cells, buttons, and audit modals */
  permissionChecker?: (permission: string) => boolean;
  /** Theme configuration */
  theme?: DynamicUITheme;
}

const DynamicUIContext = createContext<DynamicUIContextValue>({
  onNavigate: (url: string) => {
    if (typeof window !== "undefined") {
      window.location.href = url;
    }
  },
  t: (key: string, fallback?: string) => fallback || key,
  permissionChecker: () => true,
});

export interface DynamicUIProviderProps extends DynamicUIContextValue {
  children: React.ReactNode;
}

export const DynamicUIProvider: React.FC<DynamicUIProviderProps> = ({
  children,
  apiClient,
  onNavigate,
  locales = {},
  t,
  permissionChecker,
  theme,
}) => {
  const defaultNavigate = (url: string) => {
    if (typeof window !== "undefined") {
      window.location.href = url;
    }
  };

  const defaultT = (key: string, fallback?: string) => {
    if (locales && locales[key]) return locales[key];
    return fallback || key;
  };

  const defaultPermCheck = () => true;

  const value = useMemo<DynamicUIContextValue>(() => ({
    apiClient,
    onNavigate: onNavigate || defaultNavigate,
    locales,
    t: t || defaultT,
    permissionChecker: permissionChecker || defaultPermCheck,
    theme,
  }), [apiClient, onNavigate, locales, t, permissionChecker, theme]);

  return (
    <DynamicUIContext.Provider value={value}>
      {children}
    </DynamicUIContext.Provider>
  );
};

export const useDynamicUI = (): DynamicUIContextValue => {
  return useContext(DynamicUIContext);
};

export default DynamicUIContext;
