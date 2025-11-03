"use client";

import { usePathname } from "next/navigation";
import { GlobalFooter } from "./components/organisms/global-footer/global-footer";

export default function SiteFooter() {
  const pathname = usePathname();
  const isContact = pathname === "/contact";

  return (
    <GlobalFooter
      companyInfo={{
        name: "FM Corp",
        address: "서울특별시 중구 세종대로 110",
        businessNumber: "000-00-00000",
        representative: "홍길동",
        email: "contact@fm-corp.example",
        phone: "02-000-0000",
      }}
      navigationSections={[
        {
          title: "회사",
          links: [
            { label: "회사 소개", href: "/about" },
            { label: "비전", href: "/vision" },
            { label: "연락처", href: "/contact" },
          ],
        },
        {
          title: "자료",
          links: [
            { label: "공지사항", href: "/notice" },
            { label: "IR", href: "/ir" },
          ],
        },
        {
          title: "정책",
          links: [
            { label: "개인정보 처리방침", href: "/privacy" },
            { label: "이용약관", href: "/terms" },
          ],
        },
      ]}
      legalLinks={[{ label: "개인정보 처리방침", href: "/privacy" }, { label: "이용약관", href: "/terms" }]}
      theme={isContact ? "contact" : "light"}
    />
  );
}
