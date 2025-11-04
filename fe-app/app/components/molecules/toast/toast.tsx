"use client";

import { cn } from "@/lib/classnames";
import { ComponentPropsWithoutRef, ReactNode } from "react";

type ToastType = "success" | "error" | "info";

export type ToastProps = {
  type?: ToastType;
  message: ReactNode;
  theme?: "light" | "dark";
} & ComponentPropsWithoutRef<"div">;

export function Toast({ type = "info", message, theme = "light", className, ...rest }: ToastProps) {
  const isDark = theme === "dark";
  const tone = (() => {
    switch (type) {
      case "success":
        return isDark ? "bg-emerald-900/40 text-emerald-300 border-emerald-800" : "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "error":
        return isDark ? "bg-rose-900/40 text-rose-300 border-rose-800" : "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return isDark ? "bg-zinc-800 text-zinc-200 border-zinc-700" : "bg-zinc-50 text-zinc-800 border-zinc-200";
    }
  })();
  return (
    <div role="status" aria-live="polite" className={cn("rounded-xl border px-4 py-3 text-sm", tone, className)} {...rest}>
      {message}
    </div>
  );
}

