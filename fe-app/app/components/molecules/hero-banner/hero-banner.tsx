"use client";

import { cn } from "@/lib/classnames";
import Link from "next/link";
import { Button } from "../../atoms/button/button";
import { ReactNode } from "react";
import { ImageCard } from "../../atoms/image-card/image-card";
import { ColorCard } from "../../atoms/color-card/color-card";

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
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    if (backgroundType === "image" && backgroundImageUrl) {
      return (
        <ImageCard backgroundImageUrl={backgroundImageUrl} padding="lg">
          {children}
        </ImageCard>
      );
    }
    if (backgroundType === "gradient") {
      return (
        <ColorCard tone="gradient" gradientFrom="from-blue-600" gradientTo="to-emerald-500" padding="lg">
          {children}
        </ColorCard>
      );
    }
    // solid
    return (
      <ColorCard tone="solid" color="blue" padding="lg">
        {children}
      </ColorCard>
    );
  };

  return (
    <Wrapper>
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
                <Button
                  asChild
                  className="!bg-white !text-blue-700 hover:!bg-blue-50"
                >
                  <Link href={primaryAction.href} className="no-underline">
                    {primaryAction.label}
                  </Link>
                </Button>
              )}
              {secondaryAction && (
                <Button
                  asChild
                  variant="ghost"
                  className="!text-white !border !border-white/80 hover:!bg-white/10"
                >
                  <Link href={secondaryAction.href} className="no-underline">
                    {secondaryAction.label}
                  </Link>
                </Button>
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
    </Wrapper>
  );
}
