import { TextLink } from "./text-link";

export default {
  title: "Atoms/TextLink",
  component: TextLink,
  tags: ["autodocs"],
};

export const Primary = {
  args: {
    href: "#",
    children: "문서 보기",
  },
};

export const External = {
  args: {
    href: "https://example.com",
    target: "_blank",
    children: "외부 링크",
  },
};

export const NoIcon = {
  args: {
    href: "#",
    children: "아이콘 숨김",
    showIcon: false,
  },
};

export const DarkTheme = {
  args: {
    href: "#",
    theme: "dark",
    children: "문서 보기 (Dark)",
  },
};
