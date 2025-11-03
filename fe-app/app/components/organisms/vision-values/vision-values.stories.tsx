import { VisionValues, VisionValuesContent } from "./vision-values";

export default {
  title: "Organisms/VisionValues",
  component: VisionValues,
  tags: ["autodocs"],
};

const items = [
  { key: "vision", title: "미래 비전", imageUrl: "https://picsum.photos/seed/vision/640/360", imageAlt: "미래 도시 전경" },
  { key: "mission", title: "미션", imageUrl: "https://picsum.photos/seed/mission/640/360", imageAlt: "협업하는 사람들" },
  { key: "value", title: "핵심 가치", imageUrl: "https://picsum.photos/seed/values/640/360", imageAlt: "핵심 가치 개념 이미지" },
];

export const Default = {
  args: {
    items,
  },
  render: (args: any) => (
    <VisionValues {...args}>
      <VisionValuesContent tabKey="vision">
        <p className="text-sm leading-relaxed text-zinc-600">
          도시와 사회를 연결하는 스마트 인프라를 지향합니다.
        </p>
      </VisionValuesContent>
      <VisionValuesContent tabKey="mission">
        <p className="text-sm leading-relaxed text-zinc-600">
          데이터를 바탕으로 의사결정을 돕고 공공 가치를 창출합니다.
        </p>
      </VisionValuesContent>
      <VisionValuesContent tabKey="value">
        <p className="text-sm leading-relaxed text-zinc-600">
          투명성, 책임, 협업을 통해 신뢰를 구축합니다.
        </p>
      </VisionValuesContent>
    </VisionValues>
  ),
};
