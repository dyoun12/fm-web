import { Button } from "./button";

export default {
  title: "Atoms/Button",
  component: Button,
  tags: ["autodocs"],
};

export const Primary = {
  args: {
    children: "기본 버튼",
  },
};

export const Loading = {
  args: {
    children: "제출 중",
    loading: true,
  },
};
