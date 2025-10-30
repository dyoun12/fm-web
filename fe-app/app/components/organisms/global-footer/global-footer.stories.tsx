import { GlobalFooter } from "./global-footer";

export default {
  title: "Organisms/GlobalFooter",
  component: GlobalFooter,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    companyInfo: {
      name: "FM Corporation",
      address: "서울특별시 강남구 테헤란로 123, 9층",
      businessNumber: "123-45-67890",
      email: "contact@fm-corp.com",
      phone: "02-000-0000",
    },
    navigationSections: [
      {
        title: "회사",
        links: [
          { label: "회사 소개", href: "/about" },
          { label: "연혁", href: "/about#history" },
        ],
      },
      {
        title: "서비스",
        links: [
          { label: "프로젝트", href: "/projects" },
          { label: "IR", href: "/ir" },
        ],
      },
    ],
    legalLinks: [
      { label: "이용약관", href: "/terms" },
      { label: "개인정보처리방침", href: "/privacy" },
    ],
  },
};
