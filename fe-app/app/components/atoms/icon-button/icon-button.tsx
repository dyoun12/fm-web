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
} & ComponentPropsWithoutRef<"button">;

export function IconButton({
  variant = "subtle",
  shape = "circle",
  size = "md",
  className,
  type = "button",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        shape === "circle" ? "rounded-full" : "rounded-lg",
        className,
      )}
      {...rest}
    />
  );
}
