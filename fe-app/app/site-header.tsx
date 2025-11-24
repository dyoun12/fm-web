"use client";

import { usePathname } from "next/navigation";
import { GlobalHeader } from "./components/organisms/global-header/global-header";

export default function SiteHeader() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isContact = pathname === "/contact";
  const nav = [
    { label: "홈", href: "/" },
    { label: "회사 소개", href: "/about" },
    { label: "비전", href: "/vision" },
  ].map((item) => ({ ...item, isActive: pathname === item.href }));

  if (isAdmin) return null;

  const logoSrc = isContact ? "/fm-logo_white.png" : "/fm-logo_black.png";

  return (
    <GlobalHeader
      logo={{ src: logoSrc, alt: "FM Corp 로고" }}
      brandName="FM Corp"
      navigation={nav}
      cta={{ label: "문의하기", href: "/contact" }}
      isSticky
      theme={isContact ? "contact" : "light"}
    />
  );
}
