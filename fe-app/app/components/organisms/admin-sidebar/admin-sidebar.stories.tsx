import { AdminSidebar } from "./admin-sidebar";

export default {
  title: "Organisms/AdminSidebar",
  component: AdminSidebar,
  tags: ["autodocs"],
};

const items = [
  { label: "대시보드", href: "#dashboard", icon: "ri-dashboard-line", active: true },
  { label: "게시물", href: "#posts", icon: "ri-newspaper-line" },
  { label: "사용자", href: "#users", icon: "ri-group-line" },
  { label: "설정", href: "#settings", icon: "ri-settings-3-line" },
];

export const Default = {
  args: {
    items,
  },
};
