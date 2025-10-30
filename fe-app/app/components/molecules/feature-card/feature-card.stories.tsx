import { FeatureCard } from "./feature-card";

export default {
  title: "Molecules/FeatureCard",
  component: FeatureCard,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    title: "해외 투자 컨설팅",
    description: "FM 법인의 전문 인력과 함께 글로벌 진출 전략을 수립합니다.",
    ctaLabel: "자세히 보기",
    href: "#",
  },
};

export const Emphasis = {
  args: {
    title: "AI 기반 산업 분석",
    description: "데이터 기반 인사이트로 미래 사업 전략을 설계합니다.",
    variant: "emphasis",
  },
};
