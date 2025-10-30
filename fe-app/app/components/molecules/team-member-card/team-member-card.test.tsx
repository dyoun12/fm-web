import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TeamMemberCard } from "./team-member-card";

describe("TeamMemberCard", () => {
  it("팀 멤버 정보를 표시한다", () => {
    render(
      <TeamMemberCard
        name="김현우"
        role="투자 전략 리드"
        bio="경력 요약"
      />,
    );
    expect(screen.getByText("김현우")).toBeInTheDocument();
    expect(screen.getByText("투자 전략 리드")).toBeInTheDocument();
  });
});
