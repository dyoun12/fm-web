import { Input } from "./input";

export default {
  title: "Atoms/Input",
  component: Input,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    label: "이메일",
    placeholder: "example@company.com",
    helperText: "업무용 이메일을 입력해주세요.",
  },
};

export const Error = {
  args: {
    label: "연락처",
    placeholder: "010-0000-0000",
    state: "error",
    errorMessage: "유효한 연락처를 입력해주세요.",
  },
};
