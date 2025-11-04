"use client";

import { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/classnames";

type AvatarSize = "sm" | "md" | "lg";

export type AvatarProps = {
  name?: string; // 이니셜 산출에 사용
  src?: string;
  alt?: string;
  size?: AvatarSize;
  theme?: "light" | "dark";
} & Omit<ComponentPropsWithoutRef<"div">, "children">;

const SIZE_CLASS: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

function getInitial(name?: string) {
  if (!name) return "?";
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts[parts.length - 1]?.[0] ?? "";
  return (first + last).toUpperCase();
}

export function Avatar({ name, src, alt, size = "md", theme = "light", className, ...rest }: AvatarProps) {
  const isDark = theme === "dark";
  const base = cn(
    "inline-flex items-center justify-center select-none rounded-full overflow-hidden border",
    SIZE_CLASS[size],
    isDark ? "bg-zinc-800 border-zinc-700 text-zinc-200" : "bg-zinc-100 border-zinc-200 text-zinc-700",
    className,
  );

  return (
    <div className={base} {...rest}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt ?? name ?? "avatar"} className="h-full w-full object-cover" />
      ) : (
        <span aria-label={alt ?? name ?? "avatar"}>{getInitial(name)}</span>
      )}
    </div>
  );
}

