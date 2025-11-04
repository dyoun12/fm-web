"use client";

import Link from "next/link";
import { cn } from "@/lib/classnames";

export type AdminSidebarItem = { label: string; href: string; icon?: string; active?: boolean };

export type AdminSidebarProps = {
  items: AdminSidebarItem[];
  theme?: "light" | "dark";
};

export function AdminSidebar({ items, theme = "light" }: AdminSidebarProps) {
  const isDark = theme === "dark";
  return (
    <aside className={cn("w-64 rounded-2xl border p-6", isDark ? "border-zinc-700 bg-zinc-900 text-zinc-200" : "border-zinc-200 bg-white") }>
      <nav className="flex flex-col gap-1 text-sm">
        {items.map((item) => (
          <Link
            key={`${item.href}-${item.label}`}
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2",
              item.active
                ? "bg-blue-600 text-white"
                : isDark
                  ? "hover:bg-zinc-800"
                  : "hover:bg-zinc-50",
            )}
          >
            {item.icon && <span aria-hidden>{item.icon}</span>}
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
