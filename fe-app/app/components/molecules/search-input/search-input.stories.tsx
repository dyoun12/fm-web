import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SearchInput } from "./search-input";

const meta: Meta<typeof SearchInput> = {
  title: "Molecules/SearchInput",
  component: SearchInput,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  args: { placeholder: "검색어를 입력하세요" },
};
