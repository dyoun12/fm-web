"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/classnames";
import { Button } from "../../atoms/button/button";

export type ConfirmDialogProps = {
  open: boolean;
  title?: ReactNode;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  theme?: "light" | "dark";
  variant?: "default" | "destructive";
  onConfirm?: () => void;
  onCancel?: () => void;
};

export function ConfirmDialog({ open, title = "확인", description, confirmLabel = "확인", cancelLabel = "취소", theme = "light", variant = "default", onConfirm, onCancel, }: ConfirmDialogProps) {
  const isDark = theme === "dark";
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
      <div role="dialog" aria-modal="true" className={cn("relative w-full max-w-sm rounded-2xl border p-6", isDark ? "border-zinc-700 bg-zinc-900 text-zinc-100" : "border-zinc-200 bg-white text-zinc-900") }>
        <div className="mb-4">
          <h3 className="text-base font-semibold">{title}</h3>
          {description && <p className="mt-1 text-sm text-zinc-500">{description}</p>}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" color="neutral" onClick={onCancel}>{cancelLabel}</Button>
          <Button variant={variant === "destructive" ? "default" : "default"} color={variant === "destructive" ? "primary" : "primary"} onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}

