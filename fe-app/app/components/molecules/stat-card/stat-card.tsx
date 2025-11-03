"use client";

import { cn } from "@/lib/classnames";
import { ReactNode } from "react";
import { Card } from "../../atoms/card/card";

export type StatCardVariant = "default" | "compact";

export type StatCardProps = {
  label: string;
  value: string;
  unit?: string;
  trend?: { direction: "up" | "down" | "flat"; value: string };
  icon?: ReactNode;
  variant?: StatCardVariant;
  theme?: "light" | "dark";
  graph?: {
    data: number[]; // 스파크라인 값들(최소 2개)
    color?: "emerald" | "blue" | "red" | "zinc";
    strokeWidth?: number;
  };
};

export function StatCard({
  label,
  value,
  unit,
  trend,
  icon,
  variant = "default",
  theme = "light",
  graph,
}: StatCardProps) {
  const isDark = theme === "dark";
  // 스파크라인 path 계산
  const graphPath = (() => {
    if (!graph || !graph.data || graph.data.length < 2) return "";
    const w = 120;
    const h = 36;
    const min = Math.min(...graph.data);
    const max = Math.max(...graph.data);
    const range = max - min || 1;
    const stepX = w / (graph.data.length - 1);
    return graph.data
      .map((v, i) => {
        const x = i * stepX;
        // y=0이 top이므로 값을 뒤집어 높을수록 위로
        const y = h - ((v - min) / range) * h;
        return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");
  })();
  const graphColorClass = (() => {
    const c = graph?.color || "emerald";
    if (c === "blue") return isDark ? "text-blue-300" : "text-blue-600";
    if (c === "red") return isDark ? "text-red-300" : "text-red-600";
    if (c === "zinc") return isDark ? "text-zinc-400" : "text-zinc-500";
    return isDark ? "text-emerald-300" : "text-emerald-600";
  })();
  return (
    <Card theme={theme} padding={variant === "compact" ? "sm" : "md"}>
      <div className="flex items-center gap-3">
        {icon && (
          <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", isDark ? "bg-zinc-800" : "bg-blue-50 text-blue-600")}>{icon}</span>
        )}
        <p className={cn("text-sm", isDark ? "text-zinc-400" : "text-zinc-500")}>{label}</p>
      </div>
      <div className={cn("mt-2 flex items-baseline gap-2", graph ? "justify-between" : undefined)}>
        <span className={cn("text-3xl font-semibold", isDark ? "text-zinc-100" : "text-zinc-900")}>{value}</span>
        {unit && <span className={cn("text-sm", isDark ? "text-zinc-400" : "text-zinc-500")}>{unit}</span>}
        {graph && graphPath && (
          <svg
            width="120"
            height="36"
            viewBox="0 0 120 36"
            className={cn("ml-auto", graphColorClass)}
            aria-hidden="true"
            data-testid="statcard-graph"
          >
            <path d={graphPath} fill="none" stroke="currentColor" strokeWidth={graph.strokeWidth ?? 2} strokeLinejoin="round" strokeLinecap="round" />
          </svg>
        )}
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
    </Card>
  );
}
