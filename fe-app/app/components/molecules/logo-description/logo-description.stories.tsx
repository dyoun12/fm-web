import { LogoDescription } from "./logo-description";

export default {
  title: "Molecules/LogoDescription",
  component: LogoDescription,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    title: "브랜드 로고 소개",
    description:
      "FM Corp의 로고는 신뢰와 유연성을 상징합니다. 타이포 베이스의 심플한 로고타입과 안정적인 비율로 다양한 환경에서 일관된 인상을 제공합니다.",
    imageUrl: "https://picsum.photos/800/500",
    imageAlt: "FM Corp Logo Mock",
    bullets: [
      "최소 16px 마진을 유지",
      "로고 색상은 브랜드 Primary 컬러 또는 단색 사용",
      "왜곡/회전/그라디언트 변형 금지",
    ],
  },
};

