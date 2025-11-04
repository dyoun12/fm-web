import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ConfirmDialog } from "./confirm-dialog";
import { Button } from "../../atoms/button/button";

const meta: Meta<typeof ConfirmDialog> = {
  title: "Molecules/ConfirmDialog",
  component: ConfirmDialog,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ConfirmDialog>;

export const Interactive: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div>
        <Button onClick={() => setOpen(true)}>모달 열기</Button>
        <ConfirmDialog
          open={open}
          title="삭제 확인"
          description="이 작업은 되돌릴 수 없습니다."
          onCancel={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
        />
      </div>
    );
  },
};
