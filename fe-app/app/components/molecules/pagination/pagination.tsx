"use client";

import { cn } from "@/lib/classnames";
import { ComponentPropsWithoutRef } from "react";

export type PaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  theme?: "light" | "dark";
  onChange?: (page: number) => void;
} & ComponentPropsWithoutRef<"nav">;

export function Pagination({ page, pageSize, total, onChange, theme = "light", className, ...rest }: PaginationProps) {
  const isDark = theme === "dark";
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const itemCls = cn(
    "inline-flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm",
    isDark ? "hover:bg-white/10" : "hover:bg-zinc-100",
  );

  return (
    <nav aria-label="페이지네이션" className={cn("flex items-center gap-1", className)} {...rest}>
      <button
        type="button"
        className={cn(itemCls, !canPrev && "opacity-50 pointer-events-none")}
        onClick={() => canPrev && onChange?.(page - 1)}
        aria-label="이전 페이지"
      >
        ‹
      </button>
      <span className="px-2 text-sm" aria-live="polite">
        {page} / {totalPages}
      </span>
      <button
        type="button"
        className={cn(itemCls, !canNext && "opacity-50 pointer-events-none")}
        onClick={() => canNext && onChange?.(page + 1)}
        aria-label="다음 페이지"
      >
        ›
      </button>
    </nav>
  );
}

