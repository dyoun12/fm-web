"use client";

import { Provider } from "react-redux";
import { store } from "./index";
import type { ReactNode } from "react";

type StoreProviderProps = {
  children: ReactNode;
};

export function StoreProvider({ children }: StoreProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}

