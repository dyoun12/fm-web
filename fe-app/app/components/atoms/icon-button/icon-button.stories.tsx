import { IconButton } from "./icon-button";

export default {
  title: "Atoms/IconButton",
  component: IconButton,
  tags: ["autodocs"],
};

export const Primary = {
  args: {
    variant: "primary",
    children: "★",
    "aria-label": "즐겨찾기",
  },
};

export const Subtle = {
  args: {
    variant: "subtle",
    children: "✉",
    "aria-label": "메시지 보내기",
  },
};
