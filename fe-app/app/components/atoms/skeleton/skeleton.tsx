"use client";

import { cn } from "@/lib/classnames";
import { ComponentPropsWithoutRef } from "react";

export type SkeletonProps = {
  variant?: "text" | "circle" | "rect";
  width?: string | number;
  height?: string | number;
} & ComponentPropsWithoutRef<"div">;

export function Skeleton({
  variant = "text",
  width,
  height,
  className,
  ...rest
}: SkeletonProps) {
  const style = {
    width,
    height,
  };

  return (
    <div
      className={cn(
        "animate-pulse bg-zinc-200",
        variant === "text" && "h-4 w-full rounded",
        variant === "circle" && "rounded-full",
        variant === "rect" && "rounded-lg",
        className,
      )}
      style={style}
      {...rest}
    />
  );
}
