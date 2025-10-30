"use client";

import { cn } from "@/lib/classnames";
import Link from "next/link";
import { ReactNode } from "react";

type BackgroundType = "solid" | "gradient" | "image";

export type HeroBannerProps = {
  title: string;
  subtitle?: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  backgroundType?: BackgroundType;
  backgroundImageUrl?: string;
  alignment?: "left" | "center";
  media?: ReactNode;
};

const BACKGROUND_CLASSES: Record<BackgroundType, string> = {
  solid: "bg-blue-700 text-white",
  gradient: "bg-gradient-to-br from-blue-600 to-emerald-500 text-white",
  image: "text-white",
};

export function HeroBanner({
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  backgroundType = "gradient",
  backgroundImageUrl,
  alignment = "left",
  media,
}: HeroBannerProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl",
        BACKGROUND_CLASSES[backgroundType],
      )}
      style={
        backgroundType === "image" && backgroundImageUrl
          ? {
              backgroundImage: `linear-gradient(120deg, rgba(11,92,242,0.85), rgba(0,182,160,0.85)), url(${backgroundImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <div
        className={cn(
          "mx-auto flex w-full max-w-6xl flex-col gap-8 px-8 py-16 lg:flex-row lg:items-center lg:justify-between",
          alignment === "center" ? "text-center lg:text-left" : "text-left",
        )}
      >
        <div
          className={cn(
            "flex flex-1 flex-col gap-6",
            alignment === "center" ? "items-center lg:items-start" : undefined,
          )}
        >
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-semibold leading-tight lg:text-5xl">
              {title}
            </h1>
            {subtitle && (
              <p className="max-w-2xl text-lg leading-7 text-white/85">
                {subtitle}
              </p>
            )}
          </div>
          {(primaryAction || secondaryAction) && (
            <div className="flex flex-wrap items-center gap-3">
              {primaryAction && (
                <Link
                  href={primaryAction.href}
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {primaryAction.label}
                </Link>
              )}
              {secondaryAction && (
                <Link
                  href={secondaryAction.href}
                  className="inline-flex items-center justify-center rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:border-white focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {secondaryAction.label}
                </Link>
              )}
            </div>
          )}
        </div>
        {media && (
          <div className="relative flex flex-1 justify-center lg:justify-end">
            {media}
          </div>
        )}
      </div>
    </section>
  );
}
