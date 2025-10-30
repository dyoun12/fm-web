"use client";

import { cn } from "@/lib/classnames";
import { ComponentPropsWithoutRef } from "react";

type IconButtonVariant = "primary" | "subtle";
type IconButtonShape = "circle" | "square";
type IconButtonSize = "sm" | "md" | "lg";

const VARIANT_STYLES: Record<IconButtonVariant, string> = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-500",
  subtle:
    "bg-white text-zinc-600 border border-zinc-200 hover:border-blue-300 hover:text-blue-600 focus-visible:outline-blue-400",
};

const SIZE_STYLES: Record<IconButtonSize, string> = {
  sm: "h-9 w-9 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-12 w-12 text-lg",
};

export type IconButtonProps = {
  variant?: IconButtonVariant;
  shape?: IconButtonShape;
  size?: IconButtonSize;
  theme?: "light" | "dark";
} & ComponentPropsWithoutRef<"button">;

export function IconButton({
  variant = "subtle",
  shape = "circle",
  size = "md",
  className,
  type = "button",
  theme = "light",
  ...rest
}: IconButtonProps) {
  const isDark = theme === "dark";
  const variantClass = (() => {
    if (variant === "primary") return VARIANT_STYLES.primary;
    // subtle
    return isDark
      ? "bg-zinc-900 text-zinc-300 border border-zinc-700 hover:border-blue-400 hover:text-blue-400 focus-visible:outline-blue-500"
      : VARIANT_STYLES.subtle;
  })();
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
