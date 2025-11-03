import { CtaSection } from "./cta-section";

export default {
  title: "Molecules/CtaSection",
  component: CtaSection,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    eyebrow: "Ready to talk?",
    title: "프로젝트 상담을 신청하세요",
    description: "전문 컨설턴트가 2영업일 내에 연락드립니다.",
    primaryAction: { label: "상담 예약", href: "#" },
    secondaryAction: { label: "자료 요청", href: "#" },
    tone: "gradient",
    gradientFrom: "from-blue-600",
    gradientTo: "to-emerald-500",
  },
};

export const LightTint = {
  args: {
    eyebrow: "Need docs?",
    title: "문서 자료를 받아보세요",
    description: "브로슈어와 케이스 스터디를 이메일로 전송합니다.",
    primaryAction: { label: "자료 요청", href: "#" },
    secondaryAction: { label: "상담 예약", href: "#" },
    tone: "tint",
    color: "slate",
  },
};
