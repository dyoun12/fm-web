"use client";

import { cn } from "@/lib/classnames";
import { ComponentPropsWithoutRef } from "react";
import { Button } from "../../atoms/button/button";
import { useAppTheme } from "@/lib/theme-context";

export type PaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  theme?: "light" | "dark";
  onChange?: (page: number) => void;
} & ComponentPropsWithoutRef<"nav">;

export function Pagination({ page, pageSize, total, onChange, theme: themeProp, className, ...rest }: PaginationProps) {
  const theme = themeProp ?? useAppTheme();
  const isDark = theme === "dark";
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <nav aria-label="페이지네이션" className={cn("flex items-center gap-1", className)} {...rest}>
      <Button
        variant="ghost"
        size="sm"
        color="neutral"
        disabled={!canPrev}
        onClick={() => canPrev && onChange?.(page - 1)}
        aria-label="이전 페이지"
        theme={theme}
      >
        ‹
      </Button>
      <span className="px-2 text-sm" aria-live="polite">
        {page} / {totalPages}
      </span>
      <Button
        variant="ghost"
        size="sm"
        color="neutral"
        disabled={!canNext}
        onClick={() => canNext && onChange?.(page + 1)}
        aria-label="다음 페이지"
        theme={theme}
      >
        ›
      </Button>
    </nav>
  );
}
