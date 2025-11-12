import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Toggle } from "./toggle";

const meta = {
  title: "Atoms/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text", description: "라벨 텍스트(미주입 시 미표시)" },
    checked: { control: "boolean", description: "현재 체크 상태(비상호작용)" },
    onCheckedChange: { table: { disable: true } },
  },
  args: {
    checked: false,
    label: "",
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본: Controls로 label 주입 여부를 바로 확인
export const Basic: Story = {
  args: {
    checked: false,
    label: "",
  },
};

// 라벨이 있는 경우 미리보기
export const WithLabel: Story = {
  args: {
    checked: false,
    label: "알림",
  },
};

// 라벨 미주입(미표시) 케이스 명시
export const WithoutLabel: Story = {
  args: {
    checked: false,
    label: "",
  },
};

// 상태ful 예시: 실사용 패턴(Controls로 checked는 고정, label만 변경 가능)
export const StatefulControlled: Story = {
  parameters: {
    controls: { exclude: ["checked"] },
  },
  render: (args) => {
    const [checked, setChecked] = useState(Boolean(args.checked));
    return (
      <Toggle
        {...args}
        checked={checked}
        onCheckedChange={setChecked}
      />
    );
  },
};
