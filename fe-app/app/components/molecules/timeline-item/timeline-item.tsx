"use client";

import { cn } from "@/lib/classnames";
import { ReactNode } from "react";
import { Card } from "../../atoms/card/card";

export type TimelineItemProps = {
  year: string;
  title: string;
  description: string;
  icon?: ReactNode;
  theme?: "light" | "dark";
  align?: "left" | "right";
};

export function TimelineItem({
  year,
  title,
  description,
  icon,
  theme = "light",
  align = "left",
}: TimelineItemProps) {
  const isDark = theme === "dark";
  return (
    <div
      className={cn(
        "flex gap-6",
        align === "right" ? "flex-row-reverse text-right" : "flex-row",
      )}
    >
      <div className="flex flex-col items-center">
        <span className="text-lg font-semibold text-blue-600">{year}</span>
        <span className={cn("mt-2 h-full w-px", isDark ? "bg-zinc-700" : "bg-zinc-200")} aria-hidden="true" />
      </div>
      <Card className="flex-1" theme={theme}>
        <div className="flex items-center gap-3">
          {icon && (
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              {icon}
            </span>
          )}
          <h3 className={cn("text-lg font-semibold", isDark ? "text-zinc-100" : "text-zinc-900")}>{title}</h3>
        </div>
        <p className={cn("mt-3 text-sm leading-6", isDark ? "text-zinc-400" : "text-zinc-600")}>{description}</p>
      </Card>
    </div>
  );
}
