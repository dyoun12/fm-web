import { TextArea } from "./text-area";

export default {
  title: "Atoms/TextArea",
  component: TextArea,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    label: "문의 내용",
    placeholder: "내용을 입력해주세요.",
    helperText: "최대 500자까지 입력 가능합니다.",
  },
};

export const Error = {
  args: {
    label: "설명",
    state: "error",
    errorMessage: "필수 입력 항목입니다.",
  },
};
