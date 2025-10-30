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
} & ComponentPropsWithoutRef<"span">;

export function Badge({
  variant = "info",
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
        VARIANT_STYLES[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
