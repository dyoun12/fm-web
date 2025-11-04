"use client";

import { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/classnames";

export type SearchInputProps = {
  theme?: "light" | "dark";
} & ComponentPropsWithoutRef<"input">;

export function SearchInput({ theme = "light", className, ...rest }: SearchInputProps) {
  const isDark = theme === "dark";
  return (
    <div className={cn("relative", className)}>
      <i className={cn("ri-search-line pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400", isDark && "text-zinc-500")} aria-hidden="true" />
      <input
        type="search"
        className={cn(
          "h-10 w-full rounded-full border px-10 text-sm outline-none transition",
          isDark ? "border-zinc-700 bg-zinc-900 text-zinc-100 focus:border-zinc-500" : "border-zinc-300 bg-white text-zinc-900 focus:border-zinc-400",
        )}
        aria-label={rest["aria-label"] ?? "검색"}
        placeholder={rest.placeholder ?? "검색"}
        {...rest}
      />
    </div>
  );
}

