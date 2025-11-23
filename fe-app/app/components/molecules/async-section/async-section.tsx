"use client";

import { cn } from "@/lib/classnames";
import type { ReactNode } from "react";
import { Skeleton } from "../../atoms/skeleton/skeleton";

type AsyncSectionStatus = "loading" | "error";

export type AsyncSectionProps = {
  status: AsyncSectionStatus;
  title?: string;
  message?: string;
  errorMessage?: string | null;
  skeleton?: ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
};

export function AsyncSection({
  status,
  title,
  message,
  errorMessage,
  skeleton,
  onRetry,
  retryLabel = "다시 시도",
  className,
}: AsyncSectionProps) {
  if (status === "loading") {
    if (skeleton) {
      return <div className={className}>{skeleton}</div>;
    }
    return (
      <div
        className={cn(
          "flex min-h-[200px] flex-col items-center justify-center gap-2 text-center",
          className,
        )}
      >
        {title && <p className="text-sm font-medium text-zinc-800">{title}</p>}
        <p className="text-xs text-zinc-500">
          {message ?? "정보를 불러오는 중입니다. 잠시만 기다려 주세요."}
        </p>
        <Skeleton variant="rect" className="mt-3 h-8 w-32 rounded-full" />
      </div>
    );
  }

  if (status === "error") {
    if (!errorMessage && !title && !message) {
      return null;
    }
    return (
      <div
        className={cn(
          "flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-center",
          className,
        )}
      >
        {title && <p className="text-sm font-semibold text-red-700">{title}</p>}
        {(errorMessage || message) && (
          <p className="text-xs text-red-600">
            {errorMessage ?? message}
          </p>
        )}
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-1 inline-flex items-center justify-center rounded-full border border-red-300 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
          >
            {retryLabel}
          </button>
        )}
      </div>
    );
  }

  return null;
}

