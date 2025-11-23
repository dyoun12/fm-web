"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "../components/organisms/admin-sidebar/admin-sidebar";
import { AdminHeader } from "../components/organisms/admin-header/admin-header";
import { cn } from "@/lib/classnames";
import { ThemeProvider } from "@/lib/theme-context";

type Props = { children: React.ReactNode };

export default function AdminLayout({ children }: Props) {
  const [theme, setTheme] = React.useState<"light" | "dark">("light");
  const pathname = usePathname();
  const router = useRouter();
  // 전역 배경/본문 토큰을 body에 적용
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    const cls = "theme-dark";
    document.body.classList.toggle(cls, theme === "dark");
    return () => {
      document.body.classList.remove(cls);
    };
  }, [theme]);
  const items = [
    { label: "대시보드", href: "/admin", icon: "ri-dashboard-line", active: pathname === "/admin" },
    { label: "게시물", href: "/admin/posts", icon: "ri-newspaper-line", active: pathname?.startsWith("/admin/posts") },
    { label: "카테고리", href: "/admin/categories", icon: "ri-price-tag-3-line", active: pathname?.startsWith("/admin/categories") },
    { label: "회사 정보", href: "/admin/corp", icon: "ri-building-4-line", active: pathname?.startsWith("/admin/corp") },
    { label: "문의", href: "/admin/contact", icon: "ri-mail-line", active: pathname?.startsWith("/admin/contact") },
    { label: "사용자", href: "/admin/users", icon: "ri-user-3-line", active: pathname?.startsWith("/admin/users") },
  ];

  const pageTitle =
    pathname === "/admin"
      ? "대시보드"
      : pathname?.startsWith("/admin/posts")
        ? "게시물"
        : pathname?.startsWith("/admin/categories")
          ? "카테고리"
          : pathname?.startsWith("/admin/corp")
            ? "회사 정보"
            : pathname?.startsWith("/admin/contact")
              ? "문의"
              : pathname?.startsWith("/admin/users")
                ? "사용자"
                : "관리자";

  const handleLogout = () => {
    router.replace("/auth/login");
  };

  return (
    // 전체 화면을 고정하고, 스크롤은 컨텐츠 영역에서만 발생
    <ThemeProvider value={theme}>
      <div className={cn("grid h-screen grid-rows-[auto_1fr] overflow-hidden") }>
        {/* 1행: 어드민 헤더 (고정) */}
        <div className="px-6 py-3">
          <AdminHeader
            title={pageTitle}
            theme={theme}
            onThemeChange={(next) => setTheme(next)}
            onLogout={handleLogout}
            className="rounded-xl"
          />
        </div>

        {/* 2행: 사이드바 + 컨텐츠 (컨텐츠만 스크롤) */}
        <div className="grid min-h-0 grid-cols-[222px_1fr] gap-6 px-6 pb-6">
          {/* 사이드바 (고정) */}
          <div className="h-full">
            <AdminSidebar items={items} theme={theme} onLogout={handleLogout} />
          </div>

          {/* 컨텐츠 (스크롤 영역) */}
          <main className="min-h-0 overflow-y-auto">
            {children}
            {/* <div className="mx-auto max-w-6xl">{children}</div> */}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
