import { VisionValues } from "./vision-values";

export default {
  title: "Organisms/VisionValues",
  component: VisionValues,
  tags: ["autodocs"],
};

const items = [
  {
    key: "vision",
    title: "미래 비전",
    description: "도시와 사회를 연결하는 스마트 인프라를 지향합니다.",
  },
  {
    key: "mission",
    title: "미션",
    description: "데이터로 의사결정을 돕고 공공 가치를 창출합니다.",
  },
  {
    key: "value",
    title: "핵심 가치",
    description: "투명성, 책임, 협업을 통해 신뢰를 구축합니다.",
  },
];

export const Default = {
  args: {
    items,
  },
};

