"use client";

import { cn } from "@/lib/classnames";
import { ComponentPropsWithoutRef } from "react";

export type DividerProps = {
  label?: string;
} & ComponentPropsWithoutRef<"div">;

export function Divider({ label, className, ...rest }: DividerProps) {
  if (!label) {
    return (
      <div
        role="separator"
        className={cn("h-px w-full bg-zinc-200", className)}
        {...rest}
      />
    );
  }

  return (
    <div
      role="separator"
      className={cn(
        "flex items-center gap-4 text-xs font-medium uppercase tracking-wide text-zinc-400",
        className,
      )}
      {...rest}
    >
      <span className="h-px flex-1 bg-zinc-200" aria-hidden="true" />
      {label}
      <span className="h-px flex-1 bg-zinc-200" aria-hidden="true" />
    </div>
  );
}
