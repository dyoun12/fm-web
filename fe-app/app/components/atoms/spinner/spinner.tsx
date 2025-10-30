"use client";

import { cn } from "@/lib/classnames";
import { ComponentPropsWithoutRef } from "react";

const SIZE_MAP: Record<SpinnerSize, string> = {
  xs: "h-4 w-4",
  sm: "h-5 w-5",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

type SpinnerSize = "xs" | "sm" | "md" | "lg";

export type SpinnerProps = {
  size?: SpinnerSize;
} & ComponentPropsWithoutRef<"span">;

export function Spinner({
  size = "md",
  className,
  role = "status",
  ...rest
}: SpinnerProps) {
  return (
    <span
      role={role}
      aria-live="polite"
      className={cn(
        "inline-flex items-center justify-center",
        className,
      )}
      {...rest}
    >
      <span
        className={cn(
          "inline-block animate-spin rounded-full border-2 border-zinc-200 border-t-blue-600",
          SIZE_MAP[size],
        )}
      />
      <span className="sr-only">로딩 중</span>
    </span>
  );
}
