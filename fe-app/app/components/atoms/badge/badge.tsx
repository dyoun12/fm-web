"use client";

import { cn } from "@/lib/classnames";
import { ComponentPropsWithoutRef } from "react";

type BadgeVariant = "default"; // 스타일(확장 여지)
type BadgeColor = "default" | "info" | "success" | "warning"; // 팔레트

const getStyles = (color: BadgeColor, isDark: boolean) => {
  if (!isDark) {
    switch (color) {
      case "info":
        return "bg-blue-50 text-blue-600 border border-blue-200";
      case "success":
        return "bg-emerald-50 text-emerald-600 border border-emerald-200";
      case "warning":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      default:
        return "bg-zinc-100 text-zinc-600 border border-zinc-200";
    }
  }
  // dark
  switch (color) {
    case "info":
      return "bg-blue-950 text-blue-300 border border-blue-900";
    case "success":
      return "bg-emerald-950 text-emerald-300 border border-emerald-900";
    case "warning":
      return "bg-amber-950 text-amber-300 border border-amber-900";
    default:
      return "bg-zinc-800 text-zinc-300 border border-zinc-700";
  }
};

export type BadgeProps = {
  variant?: BadgeVariant; // default
  color?: BadgeColor; // default | info | success | warning
  theme?: "light" | "dark";
} & ComponentPropsWithoutRef<"span">;

export function Badge({
  variant = "default",
  color = "default",
  theme = "light",
  className,
  children,
  ...rest
}: BadgeProps) {
  const isDark = theme === "dark";
  const palette = getStyles(color, isDark);
  // variant 확장 시 스타일 분기 추가 예정. 현재는 default만 제공
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
        palette,
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
