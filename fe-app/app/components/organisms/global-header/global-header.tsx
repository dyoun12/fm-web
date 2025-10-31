"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/classnames";
import { Button } from "../../atoms/button/button";

export type HeaderNavigationItem = {
  label: string;
  href: string;
  isActive?: boolean;
  external?: boolean;
};

export type GlobalHeaderProps = {
  logo?: {
    src: string;
    alt: string;
  };
  brandName?: string;
  navigation: HeaderNavigationItem[];
  cta?: {
    label: string;
    href: string;
  };
  isSticky?: boolean;
  theme?: "light" | "dark";
};

export function GlobalHeader({
  logo,
  brandName = "FM Corp",
  navigation,
  cta,
  isSticky = true,
  theme = "light",
}: GlobalHeaderProps) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const isDark = theme === "dark";

  return (
    <header
      className={cn(
        "top-0 z-30 w-full backdrop-blur transition-all",
        isDark ? "border-b border-zinc-800 bg-zinc-900/80" : "border-b border-zinc-100 bg-white/80",
        isSticky ? "sticky" : "relative",
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo.src}
              alt={logo.alt}
              className="h-10 w-auto"
              loading="lazy"
            />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              FM
            </span>
          )}
          <span className={cn("text-lg font-semibold", isDark ? "text-zinc-100" : "text-zinc-900") }>
            {brandName}
          </span>
        </Link>

        <nav className={cn("hidden items-center gap-6 text-sm font-medium lg:flex", isDark ? "text-zinc-300" : "text-zinc-600") }>
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className={cn(
                "transition hover:text-blue-600",
                item.isActive && "text-blue-600",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {cta && (
            <Button asChild theme={theme}>
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
          )}
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 lg:hidden"
          aria-label="모바일 메뉴 토글"
          aria-expanded={isMenuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className="sr-only">메뉴 열기</span>
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      <div
        className={cn(
          "px-6 py-4 lg:hidden",
          isDark ? "border-t border-zinc-800 bg-zinc-900" : "border-t border-zinc-100 bg-white",
          isMenuOpen ? "block" : "hidden",
        )}
      >
        <nav className={cn("flex flex-col gap-4 text-sm font-medium", isDark ? "text-zinc-300" : "text-zinc-700") }>
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className={cn(
                "transition hover:text-blue-600",
                item.isActive && "text-blue-600",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        {cta && (
          <div className="mt-6">
            <Button asChild fullWidth theme={theme}>
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
