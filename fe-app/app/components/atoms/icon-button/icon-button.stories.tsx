import { IconButton } from "./icon-button";

export default {
  title: "Atoms/IconButton",
  component: IconButton,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    variant: "default",
    color: "neutral",
    children: "★",
    "aria-label": "즐겨찾기",
  },
};

export const GhostPrimary = {
  args: {
    variant: "ghost",
    color: "primary",
    children: "✉",
    "aria-label": "메시지 보내기",
  },
};
