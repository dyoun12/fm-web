"use client";

import Link from "next/link";
import { Button } from "../../atoms/button/button";
import { ColorCard } from "../../atoms/color-card/color-card";

export type CtaSectionProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  primaryAction: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  // Color tokens for the section surface
  tone?: "solid" | "gradient" | "tint";
  color?: "blue" | "emerald" | "zinc" | "amber" | "red" | "slate";
  gradientFrom?: string;
  gradientTo?: string;
  rounded?: "xl" | "2xl" | "3xl";
  padding?: "none" | "sm" | "md" | "lg";
};

export function CtaSection({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  // surface tokens with sensible defaults
  tone = "gradient",
  color = "blue",
  gradientFrom = "from-blue-600",
  gradientTo = "to-emerald-500",
  rounded = "3xl",
  padding = "lg",
}: CtaSectionProps) {
  // Surface contrast: treat non-tint as dark surface
  const isDarkSurface = tone !== "tint";
  const textOnColor = isDarkSurface ? "dark" : "light";
  return (
    <ColorCard
      tone={tone}
      color={color}
      gradientFrom={gradientFrom}
      gradientTo={gradientTo}
      rounded={rounded}
      padding={padding}
      textOnColor={textOnColor}
      className="shadow-lg"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-2">
          {eyebrow && (
            <span className="text-xs font-semibold uppercase tracking-wide opacity-90">
              {eyebrow}
            </span>
          )}
          <h2 className="text-3xl font-semibold">{title}</h2>
          {description && (
            <p className="text-sm opacity-90">{description}</p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Primary: white background (outline primary) */}
          <Button asChild variant="outline" color="primary">
            <Link href={primaryAction.href} className="no-underline">
              {primaryAction.label}
            </Link>
          </Button>
          {secondaryAction && (
            <Button asChild variant="ghost" color="neutral" theme={isDarkSurface ? "dark" : "light"}>
              <Link href={secondaryAction.href} className="no-underline">
                {secondaryAction.label}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </ColorCard>
  );
}
