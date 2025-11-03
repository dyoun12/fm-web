import { StatCard } from "./stat-card";

export default {
  title: "Molecules/StatCard",
  component: StatCard,
  tags: ["autodocs"],
};

export const Default = {
  args: { label: "전체 게시물", value: "128", trend: { direction: "up", value: "+8.4%" } },
};

export const Compact = {
  args: { label: "활성 사용자", value: "32", unit: "명", variant: "compact" },
};

export const WithGraph = {
  args: {
    label: "일간 방문자",
    value: "1,284",
    trend: { direction: "up", value: "+3.1%" },
    graph: { data: [12, 14, 9, 11, 16, 18, 15, 20, 22, 19, 24], color: "emerald" },
  },
};
