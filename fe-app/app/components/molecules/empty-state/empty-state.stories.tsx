import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EmptyState } from "./empty-state";

const meta: Meta<typeof EmptyState> = {
  title: "Molecules/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: { title: "데이터가 없습니다", description: "조건을 변경하거나 새 항목을 추가해보세요", actionLabel: "새 항목 추가" },
};

export const Search: Story = {
  args: { icon: "search", title: "검색 결과가 없습니다", description: "키워드를 바꾸거나 필터를 조정해보세요" },
};

export const Bookmarks: Story = {
  args: { icon: "bookmark", title: "북마크가 비어있습니다", description: "관심 항목을 북마크로 저장해보세요" },
};
