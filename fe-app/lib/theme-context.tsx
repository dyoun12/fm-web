"use client";

import React, { createContext, useContext } from "react";

export type AppTheme = "light" | "dark";

const ThemeContext = createContext<AppTheme>("light");

export function ThemeProvider({ value, children }: { value: AppTheme; children: React.ReactNode }) {
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme(): AppTheme {
  return useContext(ThemeContext);
}

