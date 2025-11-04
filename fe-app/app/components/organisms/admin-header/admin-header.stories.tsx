import type { Meta, StoryObj } from "@storybook/react";
import { AdminHeader } from "./admin-header";
import React from "react";

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
      <button className="w-full rounded px-2 py-2 text-left text-sm hover:bg-zinc-50 flex items-center justify-start gap-2"><i className="ri-settings-3-line" aria-hidden="true" /> 환경설정</button>
      <button className="w-full rounded px-2 py-2 text-left text-sm hover:bg-zinc-50 flex items-center justify-start gap-2"><i className="ri-share-forward-line" aria-hidden="true" /> 내보내기</button>
      <button className="w-full rounded px-2 py-2 text-left text-sm hover:bg-zinc-50 flex items-center justify-start gap-2"><i className="ri-question-line" aria-hidden="true" /> 도움말</button>
    </AdminHeader>
  ),
  args: { title: "게시물" },
};
