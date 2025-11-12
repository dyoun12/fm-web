"use client";

import Link from "next/link";
import { cn } from "@/lib/classnames";
import { Card } from "../../atoms/card/card";
import { MenuItem } from "../../atoms/menu-item/menu-item";

export type AdminSidebarItem = { label: string; href: string; icon?: string; active?: boolean };

export type AdminSidebarProps = {
  items: AdminSidebarItem[];
  theme?: "light" | "dark";
};

export function AdminSidebar({ items, theme = "light" }: AdminSidebarProps) {
  const toIconClass = (item: AdminSidebarItem) => {
    const k = (item.icon || item.label || "").trim();
    if (k.startsWith("ri-")) return k; // 이미 Remix 아이콘 클래스 전달 시
    // 이모지/라벨 매핑
    const map: Record<string, string> = {
      "📊": "ri-dashboard-line",
      "📰": "ri-newspaper-line",
      "🏷️": "ri-price-tag-3-line",
      "👤": "ri-user-3-line",
      "대시보드": "ri-dashboard-line",
      "게시물": "ri-newspaper-line",
      "카테고리": "ri-price-tag-3-line",
      "사용자": "ri-user-3-line",
    };
    return map[k] ?? "";
  };
  return (
    <aside className={cn("w-64") }>
      <Card padding="md" theme={theme}>
        <nav className="flex flex-col gap-1 text-sm">
        {items.map((item) => (
          <MenuItem
            key={`${item.href}-${item.label}`}
            asChild
            theme={theme}
            tone={item.active ? "primary" : "neutral"}
            role={undefined}
          >
            <Link href={item.href} className="flex w-full items-center gap-2">
              {(() => {
                const ic = toIconClass(item);
                return ic ? (
                  <i className={cn(ic, "text-[1.1em]")} aria-hidden="true" />
                ) : null;
              })()}
              {item.label}
            </Link>
          </MenuItem>
        ))}
        </nav>
      </Card>
    </aside>
  );
}
