import { Tag } from "./tag";

export default {
  title: "Atoms/Tag",
  component: Tag,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    children: "전체",
  },
};

export const Selected = {
  args: {
    children: "선택됨",
    variant: "selected",
  },
};
