"use client";

import { cn } from "@/lib/classnames";
import { ComponentPropsWithoutRef, ReactElement, ReactNode, cloneElement, isValidElement } from "react";

type MenuTone = "neutral" | "primary" | "danger";

export type MenuItemProps = {
  theme?: "light" | "dark";
  tone?: MenuTone;
  asChild?: boolean; // Link와 조합 시 사용
} & ComponentPropsWithoutRef<"button">;

export function MenuItem({
  children,
  className,
  theme = "light",
  tone = "neutral",
  asChild = false,
  role = "menuitem",
  type = "button",
  ...rest
}: MenuItemProps) {
  const isDark = theme === "dark";

  const toneText = (() => {
    if (tone === "primary") return isDark ? "text-blue-400" : "text-blue-600";
    if (tone === "danger") return isDark ? "text-rose-400" : "text-rose-600";
    return isDark ? "text-zinc-200" : "text-zinc-800";
  })();

  const hoverBg = tone === "danger" && !isDark ? "hover:bg-rose-100" : isDark ? "hover:bg-zinc-800" : "hover:bg-zinc-200";

  const base = cn(
    "flex w-full items-center justify-start gap-2 rounded px-2 py-2 text-left text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
    hoverBg,
    toneText,
    isDark ? "focus-visible:outline-zinc-500" : "focus-visible:outline-zinc-400",
    className,
  );

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement;
    return cloneElement(child, {
      className: cn((child.props as { className?: string }).className, base),
      role,
      ...rest,
    });
  }

  return (
    <button type={type} role={role} className={base} {...rest}>
      {children}
    </button>
  );
}

