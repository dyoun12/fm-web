import type { Meta, StoryObj } from "@storybook/react";
import { DataTable } from "./data-table";

const meta: Meta<typeof DataTable> = {
  title: "Molecules/DataTable",
  component: DataTable,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DataTable>;

export const Default: Story = {
  args: {
    caption: "게시물 목록",
    columns: [
      { key: "title", header: "제목" },
      { key: "category", header: "카테고리" },
      { key: "author", header: "작성자" },
    ],
    rows: [
      { title: "1분기 IR 보고", category: "IR", author: "admin" },
      { title: "신규 프로젝트 발표", category: "공지", author: "editor" },
    ],
  },
};

