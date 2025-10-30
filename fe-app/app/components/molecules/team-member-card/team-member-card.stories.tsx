import { TeamMemberCard } from "./team-member-card";

export default {
  title: "Molecules/TeamMemberCard",
  component: TeamMemberCard,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    name: "김현우",
    role: "투자 전략 리드",
    bio: "스마트시티 및 ESG 프로젝트를 중심으로 포트폴리오를 운영하고 있습니다.",
    socialLinks: [
      { label: "LinkedIn", href: "#" },
      { label: "Email", href: "mailto:hyunwoo@example.com" },
    ],
  },
};
