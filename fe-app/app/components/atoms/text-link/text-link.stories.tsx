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

