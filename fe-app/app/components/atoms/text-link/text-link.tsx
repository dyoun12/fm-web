"use client";

import Link from "next/link";
import { cn } from "@/lib/classnames";
import { ComponentPropsWithoutRef } from "react";

export type TextLinkProps = {
  theme?: "light" | "dark";
  underline?: boolean;
} & ComponentPropsWithoutRef<"a">;

export function TextLink({
  href = "#",
  children,
  className,
  theme = "light",
  underline = true,
  target,
  rel,
  ...rest
}: TextLinkProps) {
  const isDark = theme === "dark";
  const computedRel = target === "_blank" && !rel ? "noopener noreferrer" : rel;
  return (
    <Link
      href={href}
      target={target}
      rel={computedRel}
      className={cn(
        "font-medium underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition-colors",
        underline ? "underline" : "no-underline",
        isDark ? "text-blue-300 hover:text-blue-200" : "text-blue-600 hover:text-blue-700",
        className,
      )}
      {...rest}
    >
      {children}
    </Link>
  );
}

