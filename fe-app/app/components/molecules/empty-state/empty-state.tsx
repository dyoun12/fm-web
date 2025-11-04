"use client";

import { cn } from "@/lib/classnames";
import { ComponentPropsWithoutRef } from "react";
import { Button } from "../../atoms/button/button";

export type EmptyStateProps = {
  icon?: string; // Remix Icon 클래스 또는 이모지 문자열
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  theme?: "light" | "dark";
} & ComponentPropsWithoutRef<"div">;

export function EmptyState({ icon = "📭", title, description, actionLabel, onAction, theme = "light", className, ...rest }: EmptyStateProps) {
  const isDark = theme === "dark";
  return (
    <div className={cn("grid place-items-center rounded-2xl border p-8 text-center", isDark ? "border-zinc-700 bg-zinc-900 text-zinc-100" : "border-zinc-200 bg-white text-zinc-900", className)} {...rest}>
      <div className="text-4xl" aria-hidden>{icon}</div>
      <h3 className="mt-2 text-base font-semibold">{title}</h3>
      {description && <p className="mt-1 max-w-md text-sm text-zinc-500">{description}</p>}
      {actionLabel && (
        <Button className="mt-4" onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}

