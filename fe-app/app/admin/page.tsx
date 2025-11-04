import { AdminDashboardOverview } from "../components/organisms/admin-dashboard-overview/admin-dashboard-overview";

const stats = [
  { label: "전체 게시물", value: "128", trend: { direction: "up" as const, value: "+8.4%" } },
  { label: "활성 사용자", value: "32", unit: "명", trend: { direction: "flat" as const, value: "변화 없음" } },
  { label: "승인 대기", value: "5", unit: "건", trend: { direction: "down" as const, value: "-2" } },
];

const recentActivities = [
  { id: "a1", actor: "관리자", action: "가 ‘공지: 시스템 점검 안내’를 게시했습니다.", timestamp: new Date().toISOString() },
  { id: "a2", actor: "에디터", action: "가 IR 문서를 수정했습니다.", timestamp: new Date().toISOString() },
];

const alerts = ["승인 대기 문서 5건", "2FA 미등록 계정 1건"];

export default function AdminDashboardPage() {
  return (
    <AdminDashboardOverview stats={stats} recentActivities={recentActivities} alerts={alerts} />
  );
}

