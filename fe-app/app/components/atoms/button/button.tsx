"use client";

import { ComponentPropsWithoutRef, ReactElement, ReactNode, cloneElement, isValidElement } from "react";
import { cn } from "@/lib/classnames";
import { Spinner } from "../spinner/spinner";

type ButtonVariant = "default" | "outline" | "ghost"; // 스타일
type ButtonColor = "primary" | "neutral"; // 팔레트

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = {
  variant?: ButtonVariant; // default | outline | ghost
  color?: ButtonColor; // primary | neutral
  size?: ButtonSize;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  theme?: "light" | "dark";
  asChild?: boolean;
} & ComponentPropsWithoutRef<"button">;

export function Button({
  children,
  variant = "default",
  color = "primary",
  size = "md",
  leadingIcon,
  trailingIcon,
  loading = false,
  disabled,
  fullWidth = false,
  className,
  type = "button",
  theme = "light",
  asChild = false,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const isDark = theme === "dark";

  const variantStyles = (() => {
    if (color === "primary") {
      if (variant === "default") {
        return "bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-500";
      }
      if (variant === "outline") {
        return isDark
          ? "bg-transparent text-blue-400 border border-zinc-700 hover:border-blue-400 hover:bg-white/5 focus-visible:outline-blue-500"
          : "bg-white text-blue-600 border border-blue-200 hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-blue-400";
      }
      // ghost
      return isDark
        ? "bg-transparent text-blue-400 hover:bg-white/10 focus-visible:outline-blue-500"
        : "bg-transparent text-blue-600 hover:bg-blue-50 focus-visible:outline-blue-400";
    }
    // neutral palette
    if (variant === "default") {
      return isDark
        ? "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 focus-visible:outline-zinc-500"
        : "bg-zinc-200 text-zinc-900 hover:bg-zinc-300 focus-visible:outline-zinc-500";
    }
    if (variant === "outline") {
      return isDark
        ? "bg-transparent text-zinc-300 border border-zinc-700 hover:bg-zinc-800 focus-visible:outline-zinc-500"
        : "bg-white text-zinc-700 border border-zinc-300 hover:bg-zinc-50 focus-visible:outline-zinc-400";
    }
    // ghost neutral
    return isDark
      ? "bg-transparent text-zinc-300 hover:bg-zinc-800 focus-visible:outline-zinc-500"
      : "bg-transparent text-zinc-600 hover:bg-zinc-100 focus-visible:outline-zinc-400";
  })();

  const commonClasses = cn(
    "relative inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
    variantStyles,
    SIZE_STYLES[size],
    fullWidth && "w-full",
    className,
    isDisabled && "pointer-events-none opacity-60",
  );

  const content = (
    <>
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
        <Spinner size="sm" aria-label="로딩 중" data-testid="button-spinner" />
      )}
    </>
  );

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement;
    const childLabel = (child.props as { children?: ReactNode }).children;
    const composed = (
      <>
        {leadingIcon && (
          <span className="-ml-1 inline-flex items-center" aria-hidden="true">
            {leadingIcon}
          </span>
        )}
        <span className={loading ? "opacity-70" : undefined}>{childLabel}</span>
        {trailingIcon && !loading && (
          <span className="-mr-1 inline-flex items-center" aria-hidden="true">
            {trailingIcon}
          </span>
        )}
        {loading && (
          <Spinner size="sm" aria-label="로딩 중" data-testid="button-spinner" />
        )}
      </>
    );
    return cloneElement(child as ReactElement<{ className?: string; children?: ReactNode }>, {
      className: cn((child.props as { className?: string }).className, commonClasses),
      children: composed,
    });
  }

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={commonClasses}
      {...rest}
    >
      {content}
    </button>
  );
}
