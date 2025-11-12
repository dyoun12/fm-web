"use client";

import { cn } from "@/lib/classnames";
import { ComponentPropsWithoutRef } from "react";

type Tone = "solid" | "gradient" | "tint";

export type ColorCardProps = {
  tone?: Tone;
  color?: "blue" | "emerald" | "zinc" | "amber" | "red" | "slate";
  gradientFrom?: string;
  gradientTo?: string;
  rounded?: "xl" | "2xl" | "3xl";
  padding?: "none" | "sm" | "md" | "lg";
  textOnColor?: "light" | "dark";
  className?: string;
  theme?: "light" | "dark";
  as?: keyof JSX.IntrinsicElements;
} & Omit<ComponentPropsWithoutRef<"div">, "className">;

const PADDING = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const toneClasses = (tone: Tone, color: NonNullable<ColorCardProps["color"]>) => {
  if (tone === "tint") {
    switch (color) {
      case "blue":
        return "border border-blue-100 bg-blue-50 text-blue-700";
      case "emerald":
        return "border border-emerald-100 bg-emerald-50 text-emerald-700";
      case "amber":
        return "border border-amber-100 bg-amber-50 text-amber-800";
      case "red":
        return "border border-red-100 bg-red-50 text-red-700";
      case "slate":
        return "border border-slate-200 bg-slate-50 text-slate-700";
      default:
        return "border border-zinc-200 bg-zinc-50 text-zinc-700";
    }
  }
  if (tone === "solid") {
    switch (color) {
      case "blue":
        return "bg-blue-700 text-white";
      case "emerald":
        return "bg-emerald-600 text-white";
      case "amber":
        return "bg-amber-500 text-white";
      case "red":
        return "bg-red-600 text-white";
      case "slate":
        return "bg-slate-700 text-white";
      default:
        return "bg-zinc-800 text-white";
    }
  }
  return "text-white";
};

export function ColorCard({
  tone = "solid",
  color = "blue",
  gradientFrom = "from-blue-600",
  gradientTo = "to-emerald-500",
  rounded = "3xl",
  padding = "md",
  textOnColor,
  className,
  children,
  // theme reserved for future contrast logic
  as: Tag = "section",
  ...rest
}: ColorCardProps) {
  const radius = rounded === "3xl" ? "rounded-3xl" : rounded === "2xl" ? "rounded-2xl" : "rounded-xl";
  const base = tone === "gradient" ? cn("bg-gradient-to-r", gradientFrom, gradientTo) : toneClasses(tone, color);
  const textClass = textOnColor ? (textOnColor === "dark" ? "text-white" : "text-zinc-900") : undefined;
  return (
    <Tag className={cn(radius, PADDING[padding], base, textClass, className)} {...rest}>
      {children}
    </Tag>
  );
}
