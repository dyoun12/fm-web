"use client";

import Link from "next/link";
import { cn } from "@/lib/classnames";
import { Badge } from "../../atoms/badge/badge";
import { Button } from "../../atoms/button/button";

export type NoticeItem = {
  id: string;
  title: string;
  category: string;
  publishedAt: string;
  summary?: string;
  href: string;
};

export type NoticeListProps = {
  items: NoticeItem[];
  variant?: "grid" | "list";
  ctaLabel?: string;
  onLoadMore?: () => void;
  isLoading?: boolean;
  emptyMessage?: string;
  errorMessage?: string;
  onRetry?: () => void;
  theme?: "light" | "dark";
};

export function NoticeList({
  items,
  variant = "list",
  ctaLabel = "더보기",
  onLoadMore,
  isLoading = false,
  emptyMessage = "등록된 공지가 없습니다.",
  errorMessage,
  onRetry,
  theme = "light",
}: NoticeListProps) {
  const isDark = theme === "dark";
  if (errorMessage) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-red-600">
        <p className="text-sm">{errorMessage}</p>
        {onRetry && (
          <button
            type="button"
            className="mt-4 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white"
            onClick={onRetry}
          >
            다시 시도
          </button>
        )}
      </div>
    );
  }

  if (isLoading && items.length === 0) {
    return (
      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-2xl bg-zinc-100"
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center text-sm text-zinc-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <div
        className={cn(
          "grid gap-4",
          variant === "grid"
            ? "md:grid-cols-2 xl:grid-cols-3"
            : "grid-cols-1",
        )}
      >
        {items.map((item) => (
          <article
            key={item.id}
            className={cn(
              "flex flex-col gap-3 rounded-2xl p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md border",
              isDark ? "border-zinc-700 bg-zinc-900 text-zinc-200" : "border-zinc-200 bg-white",
            )}
          >
            <div className={cn("flex items-center justify-between text-xs", isDark ? "text-zinc-400" : "text-zinc-500") }>
              <Badge color="info" theme={theme}>{item.category}</Badge>
              <time dateTime={item.publishedAt}>
                {new Date(item.publishedAt).toLocaleDateString("ko-KR")}
              </time>
            </div>
            <h3 className={cn("text-lg font-semibold", isDark ? "text-zinc-100" : "text-zinc-900") }>
              <Link href={item.href} className="transition hover:text-blue-600">
                {item.title}
              </Link>
            </h3>
            {item.summary && (
              <p className={cn("text-sm line-clamp-3", isDark ? "text-zinc-400" : "text-zinc-600")}>{item.summary}</p>
            )}
            <Link
              href={item.href}
              className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-500"
              aria-label={`${item.title} 상세 보기`}
            >
              자세히 보기
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </article>
        ))}
      </div>
      {onLoadMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            color="primary"
            onClick={onLoadMore}
            disabled={isLoading}
            theme={theme}
          >
            {isLoading ? "로딩 중..." : ctaLabel}
          </Button>
        </div>
      )}
    </section>
  );
}
