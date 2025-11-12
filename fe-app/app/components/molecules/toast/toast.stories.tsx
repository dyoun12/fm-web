import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Toast } from "./toast";

const meta: Meta<typeof Toast> = {
  title: "Molecules/Toast",
  component: Toast,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Toast>;

export const Info: Story = { args: { type: "info", message: "안내 메시지입니다" } };
export const Success: Story = { args: { type: "success", message: "성공적으로 완료되었습니다" } };
export const Error: Story = { args: { type: "error", message: "오류가 발생했습니다" } };

export const Closable: Story = {
  args: { type: "info", message: "닫기 버튼이 있는 알림", close: true },
};

export const AutoHide: Story = {
  args: { type: "success", message: "3초 후 자동으로 사라집니다", timeLimit: 3000 },
};
