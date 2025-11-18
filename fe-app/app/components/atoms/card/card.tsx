"use client";

import { cn } from "@/lib/classnames";
import { ComponentPropsWithoutRef, forwardRef } from "react";

type CardVariant = "outline" | "elevated" | "ghost" | "soft";
type CardPadding = "none" | "sm" | "md" | "lg";

const PADDING_STYLES: Record<CardPadding, string> = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export type CardProps = {
  variant?: CardVariant; // outline | elevated | ghost | soft
  padding?: CardPadding; // none | sm | md | lg
  theme?: "light" | "dark";
} & ComponentPropsWithoutRef<"div">;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "outline",
      padding = "md",
      theme = "light",
      className,
      children,
      ...rest
    },
    ref
  ) => {
    const isDark = theme === "dark";

    const base = "rounded-2xl transition-shadow";
    const paddingClass = PADDING_STYLES[padding];

    const tone = (() => {
      switch (variant) {
        case "elevated":
          return isDark
            ? "bg-zinc-900 shadow-lg shadow-black/30 border border-zinc-800"
            : "bg-white shadow-md border border-zinc-200";
        case "ghost":
          return isDark
            ? "bg-transparent hover:bg-white/5 border border-transparent"
            : "bg-transparent hover:bg-zinc-50 border border-transparent";
        case "soft":
          return isDark
            ? "bg-zinc-900/60 border border-zinc-800"
            : "bg-zinc-50 border border-zinc-200";
        case "outline":
        default:
          return isDark
            ? "bg-zinc-900 border border-zinc-800"
            : "bg-white border border-zinc-200";
      }
    })();

    return (
      <div ref={ref} className={cn(base, paddingClass, tone, className)} {...rest}>
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";
