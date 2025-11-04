"use client";

import { cn } from "@/lib/classnames";
import { ComponentPropsWithoutRef } from "react";
import { Card } from "../../atoms/card/card";
import { Button } from "../../atoms/button/button";

export type EmptyStateProps = {
  icon?:
    | "inbox"
    | "search"
    | "file"
    | "user"
    | "image"
    | "bookmark"
    | "database"
    | "alarm-warning"
    | "calendar-event"; // Remix Icon 이름(ri-*-line)
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  theme?: "light" | "dark";
} & ComponentPropsWithoutRef<"div">;

export function EmptyState({ icon = "inbox", title, description, actionLabel, onAction, theme = "light", className, ...rest }: EmptyStateProps) {
  const isDark = theme === "dark";
  return (
    <Card padding="lg" theme={theme} className={cn("grid place-items-center text-center", className)} {...rest}>
      <i
        aria-hidden="true"
        className={cn(
          `ri-${icon}-line`,
          "text-5xl",
          isDark ? "text-zinc-400" : "text-zinc-400",
        )}
      />
      <h3 className="mt-2 text-base font-semibold">{title}</h3>
      {description && <p className="mt-1 max-w-md text-sm text-zinc-500">{description}</p>}
      {actionLabel && (
        <Button className="mt-4" onClick={onAction}>{actionLabel}</Button>
      )}
    </Card>
  );
}
