"use client";

import { cn } from "@/lib/classnames";
import { ReactNode } from "react";

export type StatCardVariant = "default" | "compact";

export type StatCardProps = {
  label: string;
  value: string;
  unit?: string;
  trend?: { direction: "up" | "down" | "flat"; value: string };
  icon?: ReactNode;
  variant?: StatCardVariant;
  theme?: "light" | "dark";
};

export function StatCard({
  label,
  value,
  unit,
  trend,
  icon,
  variant = "default",
  theme = "light",
}: StatCardProps) {
  const isDark = theme === "dark";
  return (
    <article
      className={cn(
        "rounded-2xl border p-5 shadow-sm",
        isDark ? "border-zinc-700 bg-zinc-900 text-zinc-200" : "border-zinc-200 bg-white",
        variant === "compact" && "p-4",
      )}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", isDark ? "bg-zinc-800" : "bg-blue-50 text-blue-600")}>{icon}</span>
        )}
        <p className={cn("text-sm", isDark ? "text-zinc-400" : "text-zinc-500")}>{label}</p>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className={cn("text-3xl font-semibold", isDark ? "text-zinc-100" : "text-zinc-900")}>{value}</span>
        {unit && <span className={cn("text-sm", isDark ? "text-zinc-400" : "text-zinc-500")}>{unit}</span>}
      </div>
      {trend && (
        <p
          className={cn(
            "mt-2 flex items-center gap-2 text-sm",
            trend.direction === "up" && "text-emerald-600",
            trend.direction === "down" && "text-red-600",
            trend.direction === "flat" && (isDark ? "text-zinc-500" : "text-zinc-500"),
          )}
        >
          <span aria-hidden="true">
            {trend.direction === "up" && "▲"}
            {trend.direction === "down" && "▼"}
            {trend.direction === "flat" && "■"}
          </span>
          {trend.value}
        </p>
      )}
    </article>
  );
}

