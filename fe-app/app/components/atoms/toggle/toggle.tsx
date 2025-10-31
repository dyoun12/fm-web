"use client";

import { cn } from "@/lib/classnames";
import { ComponentPropsWithoutRef } from "react";

export type ToggleProps = {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
} & Omit<ComponentPropsWithoutRef<"button">, "onChange">;

export function Toggle({
  checked,
  onCheckedChange,
  label,
  className,
  type = "button",
  ...rest
}: ToggleProps) {
  return (
    <button
      type={type}
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "inline-flex items-center",
        label ? "gap-2" : undefined,
        className,
      )}
      {...rest}
    >
      <span
        className={cn(
          "flex h-6 w-11 items-center rounded-full p-1 transition",
          checked ? "bg-blue-600" : "bg-zinc-300",
        )}
      >
        <span
          className={cn(
            "h-4 w-4 rounded-full bg-white shadow transition",
            checked ? "translate-x-5" : "translate-x-0",
          )}
        />
      </span>
      {label && <span className="text-sm text-zinc-600">{label}</span>}
    </button>
  );
}
