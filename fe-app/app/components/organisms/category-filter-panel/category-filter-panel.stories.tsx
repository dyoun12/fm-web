import { CategoryFilterPanel } from "./category-filter-panel";

export default {
  title: "Organisms/CategoryFilterPanel",
  component: CategoryFilterPanel,
  tags: ["autodocs"],
};

const categories = [
  { id: "notice", label: "공지", count: 12 },
  { id: "ir", label: "IR", count: 6 },
  { id: "project", label: "프로젝트", count: 8 },
];

export const Default = {
  args: {
    categories,
  },
};
