"use client";

import Link from "next/link";
import { cn } from "@/lib/classnames";
import { Card } from "../../atoms/card/card";
import { MenuItem } from "../../atoms/menu-item/menu-item";

export type AdminSidebarItem = { label: string; href: string; icon?: string; active?: boolean };
export type AdminSidebarProps = {
  items: AdminSidebarItem[];
  theme?: "light" | "dark";
  onLogout?: () => void;
};

export function AdminSidebar({ items, theme = "light", onLogout }: AdminSidebarProps) {
  return (
    <aside className={cn("w-56 h-full")}>
      <Card padding="none" theme={theme} className="h-full py-4">
        <div className="flex h-full flex-col justify-between gap-4">
          <nav className="flex flex-col gap-1 text-sm">
            {items.map((item) => (
              <MenuItem
                key={`${item.href}-${item.label}`}
                asChild
                theme={theme}
                tone={item.active ? "primary" : "neutral"}
                role={undefined}
              >
                <Link href={item.href} className="flex w-full items-center gap-2 px-6">
                  {item.icon ? <i className={cn(item.icon, "text-[1.1em]")} aria-hidden="true" /> : null}
                  {item.label}
                </Link>
              </MenuItem>
            ))}
          </nav>

          <div className="flex flex-col gap-1">
            <MenuItem theme={theme} asChild>
              <Link
                href="/dev"
                className="flex w-full items-center gap-2 px-6"
              >
                <i className="ri-tools-line text-[1.1em]" aria-hidden="true" />
                컴포넌트 UI
              </Link>
            </MenuItem>
            <MenuItem
              theme={theme}
              asChild
              tone="danger"
              onClick={() => onLogout?.()}
            >
              <div className="flex w-full items-center gap-2 px-6">
                <i className="ri-logout-box-r-line text-[1.1em]" aria-hidden="true" />
                로그아웃
              </div>
            </MenuItem>
          </div>
        </div>
      </Card>
    </aside>
  );
}
