import { PostList } from "./post-list";

export default {
  title: "Organisms/PostList",
  component: PostList,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    items: [
      {
        id: "1",
        title: "2025년 4분기 IR 자료 공개",
        category: "IR",
        publishedAt: "2025-10-15T00:00:00.000Z",
        summary: "주요 경영 지표와 신규 투자 계획을 공유드립니다.",
        href: "#",
      },
      {
        id: "2",
        title: "서울 스마트시티 컨소시엄 참여",
        category: "프로젝트",
        publishedAt: "2025-10-20T00:00:00.000Z",
        summary: "지자체와 함께 미래 도시 인프라를 구축합니다.",
        href: "#",
      },
    ],
    variant: "grid",
  },
};
