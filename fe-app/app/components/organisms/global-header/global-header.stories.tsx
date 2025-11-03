import { GlobalHeader } from "./global-header";

export default {
  title: "Organisms/GlobalHeader",
  component: GlobalHeader,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    brandName: "FM Corporation",
    navigation: [
      { label: "회사 소개", href: "/about" },
      { label: "비전", href: "/vision" },
      { label: "프로젝트", href: "/projects" },
      { label: "공지사항", href: "/notice", isActive: true },
    ],
    cta: { label: "문의하기", href: "/contact" },
  },
};

export const ContactTheme = {
  args: {
    brandName: "FM Corporation",
    navigation: [
      { label: "회사 소개", href: "/about" },
      { label: "비전", href: "/vision" },
      { label: "프로젝트", href: "/projects" },
      { label: "공지사항", href: "/notice" },
    ],
    cta: { label: "문의하기", href: "/contact" },
    theme: "contact",
  },
};
