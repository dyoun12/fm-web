"use client";

import { cn } from "@/lib/classnames";
import { ComponentPropsWithoutRef } from "react";

type IconButtonVariant = "default" | "ghost"; // style: filled vs icon-only
type IconButtonColor = "neutral" | "primary"; // palette
type IconButtonShape = "circle" | "square";
type IconButtonSize = "xs" | "sm" | "md" | "lg";

const getStyleByColor = (
  color: IconButtonColor,
  variant: IconButtonVariant,
  isDark: boolean,
) => {
  if (color === "primary") {
    if (variant === "default") {
      return "bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-500";
    }
    // ghost
    return isDark
      ? "bg-transparent text-blue-400 hover:bg-blue-950 focus-visible:outline-blue-500"
      : "bg-transparent text-blue-600 hover:bg-blue-50 focus-visible:outline-blue-500";
  }
  // neutral
  if (variant === "default") {
    return isDark
      ? "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 focus-visible:outline-zinc-500"
      : "bg-zinc-200 text-zinc-800 hover:bg-zinc-300 focus-visible:outline-zinc-500";
  }
  // ghost neutral
  return isDark
    ? "bg-transparent text-zinc-300 hover:bg-zinc-800 focus-visible:outline-zinc-500"
    : "bg-transparent text-zinc-600 hover:bg-zinc-100 focus-visible:outline-zinc-400";
};

const SIZE_STYLES: Record<IconButtonSize, string> = {
  xs: "h-6 w-6 text-xs",
  sm: "h-9 w-9 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-12 w-12 text-lg",
};

export type IconButtonProps = {
  variant?: IconButtonVariant; // default(filled) | ghost(icon-only)
  color?: IconButtonColor; // primary palette vs neutral
  shape?: IconButtonShape;
  size?: IconButtonSize;
  theme?: "light" | "dark";
} & ComponentPropsWithoutRef<"button">;

export function IconButton({
  variant = "default",
  color = "neutral",
  shape = "circle",
  size = "md",
  className,
  type = "button",
  theme = "light",
  ...rest
}: IconButtonProps) {
  const isDark = theme === "dark";
  const variantClass = getStyleByColor(color, variant, isDark);
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        variantClass,
        SIZE_STYLES[size],
        shape === "circle" ? "rounded-full" : "rounded-lg",
        className,
      )}
      {...rest}
    />
  );
}
