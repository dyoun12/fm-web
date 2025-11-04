"use client";

import { cn } from "@/lib/classnames";
import { ComponentPropsWithoutRef } from "react";
import { SearchInput } from "../../molecules/search-input/search-input";
import { Avatar } from "../../atoms/avatar/avatar";

export type AdminHeaderProps = {
  title?: string;
  theme?: "light" | "dark";
  onSearch?: (value: string) => void;
} & ComponentPropsWithoutRef<"header">;

export function AdminHeader({ title = "관리자", theme = "light", onSearch, className, ...rest }: AdminHeaderProps) {
  const isDark = theme === "dark";
  return (
    <header
      className={cn(
        "flex items-center justify-between gap-3 rounded-2xl border p-3",
        isDark ? "border-zinc-700 bg-zinc-900" : "border-zinc-200 bg-white",
        className,
      )}
      {...rest}
    >
      <h2 className="text-base font-semibold">{title}</h2>
      <div className="flex items-center gap-3">
        <SearchInput onChange={(e) => onSearch?.(e.currentTarget.value)} theme={theme} />
        <Avatar name="Admin" theme={theme} />
      </div>
    </header>
  );
}

