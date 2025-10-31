import { AdminSidebar } from "./admin-sidebar";

export default {
  title: "Organisms/AdminSidebar",
  component: AdminSidebar,
  tags: ["autodocs"],
};

const items = [
  { label: "대시보드", href: "#dashboard", icon: "📊", active: true },
  { label: "게시물", href: "#posts", icon: "📰" },
  { label: "사용자", href: "#users", icon: "👥" },
  { label: "설정", href: "#settings", icon: "⚙️" },
];

export const Default = {
  args: {
    items,
  },
};

