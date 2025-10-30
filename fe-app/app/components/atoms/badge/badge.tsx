"use client";

import { cn } from "@/lib/classnames";
import { ComponentPropsWithoutRef } from "react";

type BadgeVariant = "info" | "success" | "warning" | "neutral";

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  info: "bg-blue-50 text-blue-600 border border-blue-200",
  success: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border border-amber-200",
  neutral: "bg-zinc-100 text-zinc-600 border border-zinc-200",
};

export type BadgeProps = {
  variant?: BadgeVariant;
  theme?: "light" | "dark";
} & ComponentPropsWithoutRef<"span">;

export function Badge({
  variant = "info",
  theme = "light",
  className,
  children,
  ...rest
}: BadgeProps) {
  const isDark = theme === "dark";
  const darkVariant: Record<BadgeVariant, string> = {
    info: "bg-blue-950 text-blue-300 border border-blue-900",
    success: "bg-emerald-950 text-emerald-300 border border-emerald-900",
    warning: "bg-amber-950 text-amber-300 border border-amber-900",
    neutral: "bg-zinc-800 text-zinc-300 border border-zinc-700",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
        isDark ? darkVariant[variant] : VARIANT_STYLES[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
