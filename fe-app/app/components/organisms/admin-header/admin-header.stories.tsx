import type { Meta, StoryObj } from "@storybook/react";
import { AdminHeader } from "./admin-header";

const meta: Meta<typeof AdminHeader> = {
  title: "Organisms/AdminHeader",
  component: AdminHeader,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof AdminHeader>;

export const Default: Story = {
  args: { title: "대시보드" },
};

