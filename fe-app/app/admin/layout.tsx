"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AdminSidebar } from "../components/organisms/admin-sidebar/admin-sidebar";
import { AdminHeader } from "../components/organisms/admin-header/admin-header";
import { cn } from "@/lib/classnames";

type Props = { children: React.ReactNode };

export default function AdminLayout({ children }: Props) {
  const pathname = usePathname();
  const items = [
    { label: "대시보드", href: "/admin", icon: "📊", active: pathname === "/admin" },
    { label: "게시물", href: "/admin/posts", icon: "📰", active: pathname?.startsWith("/admin/posts") },
    { label: "카테고리", href: "/admin/categories", icon: "🏷️", active: pathname?.startsWith("/admin/categories") },
    { label: "사용자", href: "/admin/users", icon: "👤", active: pathname?.startsWith("/admin/users") },
  ];

  return (
    <div className={cn("mx-auto grid max-w-7xl gap-6 p-6 lg:grid-cols-[256px_1fr]") }>
      <div className="lg:sticky lg:top-6 lg:self-start">
        <AdminSidebar items={items} />
      </div>
      <main className="grid gap-4">
        <AdminHeader title={
          pathname === "/admin"
            ? "대시보드"
            : pathname?.startsWith("/admin/posts")
              ? "게시물"
              : pathname?.startsWith("/admin/categories")
                ? "카테고리"
                : pathname?.startsWith("/admin/users")
                  ? "사용자"
                  : "관리자"
        } />
        <div>{children}</div>
      </main>
    </div>
  );
}

