"use client";

import { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/classnames";

export type FilterBarProps = {
  children?: ReactNode; // Select/Tag/Search 조합을 외부에서 전달
  theme?: "light" | "dark";
} & ComponentPropsWithoutRef<"div">;

export function FilterBar({ children, theme = "light", className, ...rest }: FilterBarProps) {
  const isDark = theme === "dark";
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-2xl border p-3",
        isDark ? "border-zinc-700 bg-zinc-900" : "border-zinc-200 bg-white",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

