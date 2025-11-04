"use client";

import { cn } from "@/lib/classnames";
import { ComponentPropsWithoutRef, ReactNode, useEffect, useState } from "react";
import { IconButton } from "../../atoms/icon-button/icon-button";

type ToastType = "success" | "error" | "info";

export type ToastProps = {
  type?: ToastType;
  message: ReactNode;
  theme?: "light" | "dark";
  close?: boolean; // 닫기 버튼 노출 여부
  timeLimit?: number; // 자동 닫힘(ms)
  onClose?: () => void; // 닫힘 콜백
} & ComponentPropsWithoutRef<"div">;

export function Toast({ type = "info", message, theme = "light", close = false, timeLimit, onClose, className, ...rest }: ToastProps) {
  const isDark = theme === "dark";
  const [open, setOpen] = useState(true);
  const tone = (() => {
    switch (type) {
      case "success":
        return isDark ? "bg-emerald-900/40 text-emerald-300 border-emerald-800" : "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "error":
        return isDark ? "bg-rose-900/40 text-rose-300 border-rose-800" : "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return isDark ? "bg-zinc-800 text-zinc-200 border-zinc-700" : "bg-zinc-50 text-zinc-800 border-zinc-200";
    }
  })();

  useEffect(() => {
    if (!timeLimit || timeLimit <= 0) return;
    const id = setTimeout(() => {
      setOpen(false);
      onClose?.();
    }, timeLimit);
    return () => clearTimeout(id);
  }, [timeLimit, onClose]);

  if (!open) return null;
  return (
    <div role="status" aria-live="polite" className={cn("rounded-xl border px-4 py-3 text-sm", tone, className)} {...rest}>
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">{message}</div>
        {close && (
          <IconButton
            variant="ghost"
            size="xs"
            color="neutral"
            aria-label="닫기"
            onClick={() => {
              setOpen(false);
              onClose?.();
            }}
            theme={theme}
          >
            <i className="ri-close-line" aria-hidden="true" />
          </IconButton>
        )}
      </div>
    </div>
  );
}
