import { Checkbox } from "./checkbox";

export default {
  title: "Atoms/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    label: "이용 약관에 동의합니다",
  },
};

export const Indeterminate = {
  args: {
    label: "전체 선택",
    indeterminate: true,
  },
};
