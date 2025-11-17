"use client";

import { usePathname } from "next/navigation";
import { GlobalFooter } from "./components/organisms/global-footer/global-footer";
import { useCorpMeta } from "@/app/hooks/use-corp-meta";

const FALLBACK_COMPANY_INFO = {
  address: "서울특별시 중구 세종대로 110",
  businessNumber: "000-00-00000",
  representative: "홍길동",
  email: "contact@fm-corp.example",
  phone: "02-000-0000",
} as const;

export default function SiteFooter() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isContact = pathname === "/contact";
  const corpMeta = useCorpMeta();

  if (isAdmin) return null;

  const companyInfo = {
    name: "FM Corp",
    address: corpMeta?.address ?? FALLBACK_COMPANY_INFO.address,
    businessNumber: corpMeta ? corpMeta.corpNum : FALLBACK_COMPANY_INFO.businessNumber,
    representative: corpMeta ? corpMeta.ceo : FALLBACK_COMPANY_INFO.representative,
    email: corpMeta ? corpMeta.email : FALLBACK_COMPANY_INFO.email,
    phone: corpMeta ? corpMeta.hp : FALLBACK_COMPANY_INFO.phone,
  };

  return (
    <GlobalFooter
      companyInfo={companyInfo}
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
