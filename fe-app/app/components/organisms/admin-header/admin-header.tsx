"use client";

import { cn } from "@/lib/classnames";
import { ComponentPropsWithoutRef, ReactNode, useEffect, useRef, useState } from "react";
import { SearchInput } from "../../molecules/search-input/search-input";
import { Avatar } from "../../atoms/avatar/avatar";
import { IconButton } from "../../atoms/icon-button/icon-button";

export type AdminHeaderProps = {
  title?: string;
  theme?: "light" | "dark";
  onSearch?: (value: string) => void;
  children?: ReactNode; // 페이지별 도구 하위 메뉴(드롭다운 콘텐츠)
  logo?: { src: string; alt: string };
} & ComponentPropsWithoutRef<"header">;

export function AdminHeader({ title = "관리자", theme = "light", onSearch, children, logo = { src: "/logo.svg", alt: "FM Admin" }, className, ...rest }: AdminHeaderProps) {
  const isDark = theme === "dark";
  const [open, setOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (open && toolsRef.current && !toolsRef.current.contains(t)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);
  return (
    <header
      className={cn(
        "flex items-center justify-between gap-3 rounded-2xl border p-3",
        isDark ? "border-zinc-700 bg-zinc-900" : "border-zinc-200 bg-white",
        className,
      )}
      {...rest}
    >
      <div className="flex items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo.src} alt={logo.alt} className="h-12 w-auto" />
        <h2 className="text-base font-semibold">{title}</h2>
      </div>
      <div className="flex items-center gap-2">
        <SearchInput onChange={(e) => onSearch?.(e.currentTarget.value)} theme={theme} />
        <div className="relative" ref={toolsRef}>
          <IconButton
            aria-haspopup="menu"
            aria-expanded={open}
            aria-label="도구"
            variant="soft"
            color={open ? "primary" : "neutral"}
            size="sm"
            theme={theme}
            onClick={() => setOpen((v) => !v)}
          >
            <i className="ri-more-2-fill" aria-hidden="true" />
          </IconButton>
          {open && (
            <div
              role="menu"
              className={cn(
                "absolute right-0 z-50 mt-2 min-w-[200px] rounded-lg border p-2 shadow-lg",
                isDark ? "border-zinc-700 bg-zinc-900" : "border-zinc-200 bg-white",
              )}
            >
              {children}
            </div>
          )}
        </div>
        <Avatar name="Admin" theme={theme} />
      </div>
    </header>
  );
}
