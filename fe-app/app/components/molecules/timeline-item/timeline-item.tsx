"use client";

import { cn } from "@/lib/classnames";
import { ReactNode } from "react";

export type TimelineItemProps = {
  year: string;
  title: string;
  description: string;
  icon?: ReactNode;
  align?: "left" | "right";
};

export function TimelineItem({
  year,
  title,
  description,
  icon,
  align = "left",
}: TimelineItemProps) {
  return (
    <div
      className={cn(
        "flex gap-6",
        align === "right" ? "flex-row-reverse text-right" : "flex-row",
      )}
    >
      <div className="flex flex-col items-center">
        <span className="text-lg font-semibold text-blue-600">{year}</span>
        <span className="mt-2 h-full w-px bg-zinc-200" aria-hidden="true" />
      </div>
      <div className="flex-1 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          {icon && (
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              {icon}
            </span>
          )}
          <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
        </div>
        <p className="mt-3 text-sm leading-6 text-zinc-600">{description}</p>
      </div>
    </div>
  );
}
