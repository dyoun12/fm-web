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

export const WithAllData = {
  args: {
    companyInfo: {
      name: "FM Corporation",
      address: "서울특별시 강남구 테헤란로 123, 9층",
      businessNumber: "123-45-67890",
      representative: "홍길동",
      email: "contact@fm-corp.com",
      fax: "02-111-2222",
      phone: "02-000-0000",
    },
    navigationSections: [
      {
        title: "회사",
        links: [
          { label: "회사 소개", href: "/about" },
          { label: "연혁", href: "/about#history" },
          { label: "채용", href: "/careers" },
        ],
      },
      {
        title: "서비스",
        links: [
          { label: "프로젝트", href: "/projects" },
          { label: "IR", href: "/ir" },
          { label: "파트너", href: "/partners" },
        ],
      },
      {
        title: "지원",
        links: [
          { label: "문의", href: "/contact" },
          { label: "자주 묻는 질문", href: "/faq" },
          { label: "개발자 문서", href: "/docs" },
        ],
      },
    ],
    legalLinks: [
      { label: "이용약관", href: "/terms" },
      { label: "개인정보처리방침", href: "/privacy" },
      { label: "청소년보호정책", href: "/youth" },
    ],
    socialLinks: [
      { label: "GitHub", href: "https://github.com/example" },
      { label: "Twitter", href: "https://twitter.com/example" },
      { label: "LinkedIn", href: "https://linkedin.com/company/example" },
    ],
    newsletter: {
      description: "뉴스와 업데이트를 이메일로 받아보세요.",
      onSubmit: async (email: string) => {
        // mock submit
        await new Promise((r) => setTimeout(r, 300));
        console.log("Subscribed:", email);
      },
    },
  },
};

export const ContactTheme = {
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
    theme: "contact",
  },
};
