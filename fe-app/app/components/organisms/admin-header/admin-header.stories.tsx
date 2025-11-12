import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AdminHeader } from "./admin-header";
import React from "react";
import { MenuItem } from "../../atoms/menu-item/menu-item";

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

export const WithTools: Story = {
  render: (args) => (
    <AdminHeader {...args}>
      <MenuItem><i className="ri-settings-3-line" aria-hidden="true" /> 환경설정</MenuItem>
      <MenuItem tone="primary"><i className="ri-share-forward-line" aria-hidden="true" /> 내보내기</MenuItem>
      <MenuItem><i className="ri-question-line" aria-hidden="true" /> 도움말</MenuItem>
    </AdminHeader>
  ),
  args: { title: "게시물" },
};
