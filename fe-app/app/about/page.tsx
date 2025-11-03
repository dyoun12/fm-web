import type { Metadata } from "next";
import { AboutOverview } from "../components/organisms/about-overview/about-overview";
import { TimelineItem } from "../components/molecules/timeline-item/timeline-item";
import { TeamMemberCard } from "../components/molecules/team-member-card/team-member-card";

export const metadata: Metadata = {
  title: "회사 소개",
  description: "FM Corp의 기업 개요, 연혁, 팀을 소개합니다.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "FM Corp — 회사 소개",
    description: "FM Corp의 기업 개요, 연혁, 팀을 소개합니다.",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="w-full">
      <section className="mx-auto w-full max-w-6xl px-6 py-12" aria-labelledby="about-overview">
        <h1 id="about-overview" className="mb-6 text-3xl font-semibold">회사 소개</h1>
        <p className="mb-6 text-zinc-600">FM Corp은 기술과 디자인의 경계를 허물며, 고객에게 의미 있는 경험을 제공합니다.</p>
        <AboutOverview
          cards={[
            { title: "플랫폼 개발", description: "고성능/확장성을 갖춘 웹·모바일 플랫폼 구축" },
            { title: "브랜드/UX", description: "브랜드 아이덴티티와 사용자 경험 설계" },
            { title: "보안/인증", description: "OIDC + 2FA 기반 인증/권한 체계" },
          ]}
        />
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-12" aria-labelledby="about-history">
        <h2 id="about-history" className="mb-6 text-2xl font-semibold">연혁</h2>
        <ol className="space-y-4">
          <li><TimelineItem year="2023" title="법인 설립" description="FM Corp 창립" /></li>
          <li><TimelineItem year="2024" title="플랫폼 런칭" description="클라우드 기반 서비스 공개" /></li>
          <li><TimelineItem year="2025" title="해외 진출" description="글로벌 파트너십 체결" /></li>
        </ol>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-12" aria-labelledby="about-team">
        <h2 id="about-team" className="mb-6 text-2xl font-semibold">팀</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <TeamMemberCard name="김리더" role="CEO" imageUrl="/placeholder.svg" description="조직과 비전을 이끕니다." />
          <TeamMemberCard name="박개발" role="CTO" imageUrl="/placeholder.svg" description="플랫폼 아키텍처 설계" />
          <TeamMemberCard name="이디자" role="CXD" imageUrl="/placeholder.svg" description="경험 디자인 총괄" />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-12" aria-labelledby="about-location">
        <h2 id="about-location" className="mb-6 text-2xl font-semibold">오시는 길</h2>
        <div className="h-64 w-full rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 text-center text-sm text-zinc-500 flex items-center justify-center">
          지도 자리표시자 영역
        </div>
      </section>
    </div>
  );
}
