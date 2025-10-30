import { FooterLinks } from "./footer-links";

export default {
  title: "Molecules/FooterLinks",
  component: FooterLinks,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    title: "회사",
    links: [
      { label: "소개", href: "#" },
      { label: "연혁", href: "#" },
    ],
  },
};
