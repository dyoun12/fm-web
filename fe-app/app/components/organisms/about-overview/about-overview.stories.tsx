import { AboutOverview } from "./about-overview";

export default {
  title: "Organisms/AboutOverview",
  component: AboutOverview,
  tags: ["autodocs"],
};

const cards = [
  { title: "비전", description: "지속 가능한 도시 인프라를 구축합니다." },
  { title: "미션", description: "데이터 기반으로 사회 문제를 해결합니다." },
  { title: "가치", description: "투명성, 책임, 협업을 핵심 가치로 삼습니다." },
];

export const Default = {
  args: {
    cards,
  },
};

