"use client";

import { cn } from "@/lib/classnames";
import React, { ComponentPropsWithoutRef, ReactNode, useEffect, useRef, useState } from "react";
import { SearchInput } from "../../molecules/search-input/search-input";
import { Avatar } from "../../atoms/avatar/avatar";
import { IconButton } from "../../atoms/icon-button/icon-button";
import { Card } from "../../atoms/card/card";
import { Divider } from "../../atoms/divider/divider";
import { MenuItem } from "../../atoms/menu-item/menu-item";

export type AdminHeaderProps = {
  title?: string;
  theme?: "light" | "dark";
  onSearch?: (value: string) => void;
  children?: ReactNode; // 페이지별 도구 하위 메뉴(드롭다운 콘텐츠)
  logo?: { src: string; alt: string };
  onThemeChange?: (next: "light" | "dark") => void;
  onLogout?: () => void;
} & ComponentPropsWithoutRef<"header">;

export function AdminHeader({ title = "관리자", theme = "light", onSearch, children, logo, onThemeChange, onLogout, className, ...rest }: AdminHeaderProps) {
  const isDark = theme === "dark";
  const effectiveLogo = logo ?? {
    src: isDark ? "/fm-logo_white.png" : "/fm-logo_black.png",
    alt: "FM Admin",
  };
  const [open, setOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement | null>(null);
  const userRef = useRef<HTMLDivElement | null>(null);
  const [openUser, setOpenUser] = useState(false);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (open && toolsRef.current && !toolsRef.current.contains(t)) setOpen(false);
      if (openUser && userRef.current && !userRef.current.contains(t)) setOpenUser(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open, openUser]);
  return (
    <header className={cn(className)} {...rest}>
      <Card padding="sm" theme={theme} className={cn("flex items-center justify-between gap-3")}>
      <div className="flex items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={effectiveLogo.src}
          alt={effectiveLogo.alt}
          className="h-5 w-auto"
        />
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
        <div className="relative" ref={userRef}>
          <div
            role="button"
            aria-haspopup="menu"
            aria-expanded={openUser}
            onClick={() => setOpenUser((v) => !v)}
            className="cursor-pointer"
          >
            <Avatar name="Admin" theme={theme} />
          </div>
          {openUser && (
            <div
              role="menu"
              className={cn(
                "absolute right-0 z-50 mt-2 min-w-[200px] rounded-lg border p-2 shadow-lg",
                isDark ? "border-zinc-700 bg-zinc-900" : "border-zinc-200 bg-white",
              )}
            >
              <MenuItem
                theme={theme}
                onClick={() => {
                  onThemeChange?.("light");
                  setOpenUser(false);
                }}
              >
                <i className="ri-sun-line" aria-hidden="true" /> 라이트 테마
              </MenuItem>
              <MenuItem
                theme={theme}
                onClick={() => {
                  onThemeChange?.("dark");
                  setOpenUser(false);
                }}
              >
                <i className="ri-moon-line" aria-hidden="true" /> 다크 테마
              </MenuItem>
              <Divider className={cn("my-1", isDark ? "bg-zinc-800" : "bg-zinc-200")} />
              <MenuItem
                theme={theme}
                tone="danger"
                onClick={() => {
                  onLogout?.();
                  setOpenUser(false);
                }}
              >
                <i className="ri-logout-box-r-line" aria-hidden="true" /> 로그아웃
              </MenuItem>
            </div>
          )}
        </div>
      </div>
      </Card>
    </header>
  );
}
