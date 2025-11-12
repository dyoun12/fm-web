import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Avatar } from "./avatar";

const meta: Meta<typeof Avatar> = {
  title: "Atoms/Avatar",
  component: Avatar,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: { name: "홍 길동" },
};

export const WithImage: Story = {
  args: { name: "관리자", src: "https://picsum.photos/80", alt: "관리자 아바타" },
};
