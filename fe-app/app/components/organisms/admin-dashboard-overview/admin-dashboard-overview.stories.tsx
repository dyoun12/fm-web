import { AdminDashboardOverview } from "./admin-dashboard-overview";

export default {
  title: "Organisms/AdminDashboardOverview",
  component: AdminDashboardOverview,
  tags: ["autodocs"],
};

const stats = [
  {
    label: "전체 게시물",
    value: "128",
    trend: { direction: "up", value: "+8.4% 지난달 대비" },
  },
  {
    label: "활성 사용자",
    value: "32",
    unit: "명",
    trend: { direction: "flat", value: "변화 없음" },
  },
  {
    label: "대기 중 승인",
    value: "5",
    unit: "건",
    trend: { direction: "down", value: "-2 지난주 대비" },
  },
];

const activities = [
  {
    id: "1",
    actor: "김지현",
    action: "이 ‘2025 Q4 IR 보고서’를 게시했습니다.",
    timestamp: new Date().toISOString(),
  },
  {
    id: "2",
    actor: "박성민",
    action: "이 ‘공지: 시스템 점검 안내’를 수정했습니다.",
    timestamp: new Date().toISOString(),
  },
];

const alerts = ["보안 경고: 2FA 미등록 계정 1건", "게시물 검토 대기 5건"];

export const Default = {
  args: {
    stats,
    recentActivities: activities,
    alerts,
  },
};
