import { Select } from "./select";

export default {
  title: "Atoms/Select",
  component: Select,
  tags: ["autodocs"],
};

const options = [
  { label: "전체", value: "all" },
  { label: "공지", value: "notice" },
  { label: "IR", value: "ir" },
];

export const Default = {
  args: {
    label: "카테고리",
    placeholder: "카테고리를 선택하세요",
    options,
  },
};

export const Error = {
  args: {
    label: "카테고리",
    placeholder: "카테고리를 선택하세요",
    options,
    state: "error",
    errorMessage: "카테고리를 선택해주세요.",
  },
};
