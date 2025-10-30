"use client";

import { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/classnames";
import { Spinner } from "../spinner/spinner";

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-500",
  secondary:
    "bg-white text-blue-600 border border-blue-200 hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-blue-400",
  ghost:
    "bg-transparent text-blue-600 hover:bg-blue-50 focus-visible:outline-blue-400",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  theme?: "light" | "dark";
} & ComponentPropsWithoutRef<"button">;

export function Button({
  children,
  variant = "primary",
  size = "md",
  leadingIcon,
  trailingIcon,
  loading = false,
  disabled,
  fullWidth = false,
  className,
  type = "button",
  theme = "light",
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const isDark = theme === "dark";

  const variantStyles = (() => {
    if (variant === "primary") return VARIANT_STYLES.primary; // primary는 라이트/다크 동일 톤 유지
    if (variant === "secondary")
      return isDark
        ? "bg-transparent text-blue-400 border border-zinc-700 hover:border-blue-400 hover:bg-white/5 focus-visible:outline-blue-500"
        : VARIANT_STYLES.secondary;
    if (variant === "ghost")
      return isDark
        ? "bg-transparent text-blue-400 hover:bg-white/10 focus-visible:outline-blue-500"
        : VARIANT_STYLES.ghost;
    return VARIANT_STYLES.primary;
  })();

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-60",
        variantStyles,
        SIZE_STYLES[size],
        fullWidth && "w-full",
        className,
      )}
      {...rest}
    >
      {leadingIcon && (
        <span className="-ml-1 inline-flex items-center" aria-hidden="true">
          {leadingIcon}
        </span>
      )}
      <span className={loading ? "opacity-70" : undefined}>{children}</span>
      {trailingIcon && !loading && (
        <span className="-mr-1 inline-flex items-center" aria-hidden="true">
          {trailingIcon}
        </span>
      )}
      {loading && (
        <Spinner
          size="sm"
          aria-label="로딩 중"
          data-testid="button-spinner"
        />
      )}
    </button>
  );
}
