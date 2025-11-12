import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MenuItem } from "./menu-item";
import React from "react";

const meta: Meta<typeof MenuItem> = {
  title: "Atoms/MenuItem",
  component: MenuItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MenuItem>;

export const Default: Story = {
  render: (args) => (
    <div className="w-64 p-2 border rounded-lg">
      <MenuItem {...args}>
        <i className="ri-settings-3-line" aria-hidden="true" /> 환경설정
      </MenuItem>
    </div>
  ),
  args: { theme: "light" },
};

export const Primary: Story = {
  render: (args) => (
    <div className="w-64 p-2 border rounded-lg">
      <MenuItem {...args} tone="primary">
        <i className="ri-share-forward-line" aria-hidden="true" /> 내보내기
      </MenuItem>
    </div>
  ),
  args: { theme: "light" },
};

export const Danger: Story = {
  render: (args) => (
    <div className="w-64 p-2 border rounded-lg">
      <MenuItem {...args} tone="danger">
        <i className="ri-logout-box-r-line" aria-hidden="true" /> 로그아웃
      </MenuItem>
    </div>
  ),
  args: { theme: "light" },
};
