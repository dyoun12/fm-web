"use client";

import { cn } from "@/lib/classnames";
import { ComponentPropsWithoutRef } from "react";

type TagVariant = "default" | "selected" | "outline";

export type TagProps = {
  variant?: TagVariant;
  removable?: boolean;
  onRemove?: () => void;
} & ComponentPropsWithoutRef<"button">;

export function Tag({
  children,
  variant = "default",
  removable = false,
  onRemove,
  className,
  type = "button",
  ...rest
}: TagProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium transition",
        variant === "default" && "bg-zinc-100 text-zinc-600 hover:bg-zinc-200",
        variant === "selected" && "bg-blue-600 text-white hover:bg-blue-500",
        variant === "outline" && "border border-zinc-300 text-zinc-600 hover:border-blue-300",
        className,
      )}
      {...rest}
    >
      <span>{children}</span>
      {removable && (
        <span
          role="button"
          tabIndex={0}
          onClick={(event) => {
            event.stopPropagation();
            onRemove?.();
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onRemove?.();
            }
          }}
          aria-label="태그 제거"
        >
          ✕
        </span>
      )}
    </button>
  );
}
