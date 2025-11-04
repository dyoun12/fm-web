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
  const isDark = theme === "dark";
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
              {item.icon && <span aria-hidden>{item.icon}</span>}
              {item.label}
            </Link>
          </MenuItem>
        ))}
        </nav>
      </Card>
    </aside>
  );
}
