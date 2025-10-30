"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/classnames";

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
};

export function GlobalHeader({
  logo,
  brandName = "FM Corp",
  navigation,
  cta,
  isSticky = true,
}: GlobalHeaderProps) {
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        "top-0 z-30 w-full border-b border-zinc-100 bg-white/80 backdrop-blur transition-all",
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
          <span className="text-lg font-semibold text-zinc-900">
            {brandName}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-zinc-600 lg:flex">
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
            <Link
              href={cta.href}
              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              {cta.label}
            </Link>
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
          "border-t border-zinc-100 bg-white px-6 py-4 lg:hidden",
          isMenuOpen ? "block" : "hidden",
        )}
      >
        <nav className="flex flex-col gap-4 text-sm font-medium text-zinc-700">
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
          <Link
            href={cta.href}
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            {cta.label}
          </Link>
        )}
      </div>
    </header>
  );
}
