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
