import { HeroBanner } from "./hero-banner";

export default {
  title: "Molecules/HeroBanner",
  component: HeroBanner,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    title: "가족법인 통합 플랫폼",
    subtitle: "기업 비전과 주요 사업을 한눈에 소개합니다.",
    primaryAction: { label: "서비스 알아보기", href: "#" },
    secondaryAction: { label: "문의하기", href: "#" },
  },
};
