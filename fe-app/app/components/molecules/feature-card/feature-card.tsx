"use client";

import { cn } from "@/lib/classnames";
import Link from "next/link";
import { ReactNode } from "react";
import { Card } from "../../atoms/card/card";

type FeatureCardVariant = "default" | "emphasis";

export type FeatureCardProps = {
  icon?: ReactNode;
  title: string;
  description: string;
  href?: string;
  variant?: FeatureCardVariant;
  ctaLabel?: string;
  className?: string;
  theme?: "light" | "dark";
};

const VARIANT_CLASSES: Record<FeatureCardVariant, string> = {
  default:
    "bg-white border border-zinc-200 hover:border-blue-200 hover:shadow-md",
  emphasis:
    "bg-gradient-to-br from-blue-600 to-emerald-500 text-white shadow-lg",
};

export function FeatureCard({
  icon,
  title,
  description,
  href,
  ctaLabel = "자세히 보기",
  variant = "default",
  className,
  theme = "light",
}: FeatureCardProps) {
  const isDark = theme === "dark";
  const contentInner = (
    <div className="flex h-full flex-col gap-4">
      {icon && (
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl",
            variant === "default"
              ? "bg-blue-50 text-blue-600"
              : "bg-white/20 text-white",
          )}
        >
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-2">
        <h3
          className={cn(
            "text-lg font-semibold",
            variant === "default" ? (isDark ? "text-zinc-100" : "text-zinc-900") : "text-white",
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "text-sm leading-6",
            variant === "default" ? (isDark ? "text-zinc-400" : "text-zinc-600") : "text-white/80",
          )}
        >
          {description}
        </p>
      </div>
      {href && (
        <span
          className={cn(
            "mt-auto inline-flex items-center text-sm font-medium",
            variant === "default"
              ? "text-blue-600 hover:text-blue-500"
              : "text-white hover:text-white/90",
          )}
        >
          {ctaLabel}
        </span>
      )}
    </div>
  );

  const content = (
    variant === "default" ? (
      <Card theme={theme} className={cn("h-full transition-all", className)}>
        {contentInner}
      </Card>
    ) : (
      <div className={cn("flex h-full flex-col gap-4 rounded-2xl p-6 transition-all", VARIANT_CLASSES.emphasis, className)}>
        {contentInner}
      </div>
    )
  );

  if (href) {
    return (
      <Link href={href} className="block focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
