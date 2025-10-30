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
  },
};
