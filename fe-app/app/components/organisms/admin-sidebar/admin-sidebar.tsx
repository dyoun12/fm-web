"use client";

import Link from "next/link";
import { cn } from "@/lib/classnames";
import { Card } from "../../atoms/card/card";
import { Button } from "../../atoms/button/button";

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
          <Button
            key={`${item.href}-${item.label}`}
            asChild
            variant="ghost"
            size="sm"
            color={item.active ? "primary" : "neutral"}
            theme={theme}
            className="justify-start"
          >
            <Link href={item.href}>
              {item.icon && <span aria-hidden>{item.icon}</span>}
              {item.label}
            </Link>
          </Button>
        ))}
        </nav>
      </Card>
    </aside>
  );
}
