import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AdminDashboardOverview } from "./admin-dashboard-overview";

const stats = [
  { label: "전체 게시물", value: "20", trend: { direction: "up", value: "+10%" } },
];

const activities = [
  {
    id: "1",
    actor: "관리자",
    action: "가 게시물을 생성했습니다.",
    timestamp: new Date().toISOString(),
  },
];

describe("AdminDashboardOverview", () => {
  it("통계와 최근 활동을 표시한다", () => {
    render(
      <AdminDashboardOverview
        stats={stats}
        recentActivities={activities}
      />,
    );
    expect(screen.getByText("전체 게시물")).toBeInTheDocument();
    expect(
      screen.getAllByText(/관리자/).length,
    ).toBeGreaterThan(0);
  });
});
