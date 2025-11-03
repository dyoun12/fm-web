import { TimelineItem } from "./timeline-item";

export default {
  title: "Molecules/TimelineItem",
  component: TimelineItem,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    year: "2025",
    title: "법인 통합 플랫폼 출시",
    description: "기업 홈페이지와 관리자 콘솔의 첫 버전을 론칭했습니다.",
  },
};

export const RightAligned = {
  args: {
    year: "2024",
    title: "해외 진출",
    description: "3개국 프로젝트 런칭",
    align: "right",
  },
};
