"use client";

import { cn } from "@/lib/classnames";
import { ComponentPropsWithoutRef } from "react";

export type ImageCardProps = {
  backgroundImageUrl: string;
  overlay?: boolean;
  overlayGradientClass?: string;
  padding?: "none" | "sm" | "md" | "lg";
  rounded?: "xl" | "2xl" | "3xl";
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

export function ImageCard({
  backgroundImageUrl,
  overlay = true,
  overlayGradientClass = "bg-gradient-to-br from-black/40 to-black/20",
  padding = "md",
  rounded = "3xl",
  className,
  children,
  theme = "light",
  as: Tag = "section",
  ...rest
}: ImageCardProps) {
  const radius = rounded === "3xl" ? "rounded-3xl" : rounded === "2xl" ? "rounded-2xl" : "rounded-xl";
  return (
    <Tag
      className={cn("relative overflow-hidden", radius, className)}
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      {...rest}
    >
      {overlay && <div className={cn("absolute inset-0", overlayGradientClass)} aria-hidden="true" />}
      <div className={cn("relative", PADDING[padding])}>{children}</div>
    </Tag>
  );
}

