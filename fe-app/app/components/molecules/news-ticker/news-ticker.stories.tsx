import { NewsTicker } from "./news-ticker";

export default {
  title: "Molecules/NewsTicker",
  component: NewsTicker,
  tags: ["autodocs"],
};

const items = [
  {
    id: "1",
    title: "2025년 통합 플랫폼 베타 오픈",
    href: "#",
    category: "공지",
  },
  {
    id: "2",
    title: "스마트시티 컨소시엄 파트너십 체결",
    href: "#",
    category: "프로젝트",
  },
];

export const Default = {
  args: {
    items,
  },
};

export const Dark = {
  args: {
    items,
    theme: "dark" as const,
  },
};
