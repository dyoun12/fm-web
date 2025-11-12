import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Pagination } from "./pagination";

const meta: Meta<typeof Pagination> = {
  title: "Molecules/Pagination",
  component: Pagination,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  args: { page: 1, pageSize: 10, total: 120 },
};
