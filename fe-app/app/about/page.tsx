import type { Metadata } from "next";
import Image from "next/image";
import { Location } from "../components/organisms/location/location";
import { BusinessExplorer } from "../components/organisms/business-explorer/business-explorer";
import { TimelineItem } from "../components/molecules/timeline-item/timeline-item";

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
        <h1 id="about-overview" className="text-3xl font-semibold">회사 소개</h1>
        {/* <p className="text-zinc-600">FM Corp은 기술과 디자인의 경계를 허물며, 고객에게 의미 있는 경험을 제공합니다.</p> */}
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pt-4 pb-12" aria-label="연혁 및 대표 인사말">
        <div className="grid gap-10 lg:grid-cols-3">
          <article className="lg:col-span-1" aria-labelledby="about-history">
            <h2 id="about-history" className="mb-6 text-2xl font-semibold">연혁</h2>
            <ol className="space-y-4">
              {[
                { year: "2023", title: "법인 설립", description: "FM Corp 창립" },
                { year: "2024", title: "플랫폼 런칭", description: "클라우드 기반 서비스 공개" },
                { year: "2025", title: "해외 진출", description: "글로벌 파트너십 체결" },
              ].map((item, idx) => (
                <li key={`${item.year}-${item.title}`}>
                  <TimelineItem
                    year={item.year}
                    title={item.title}
                    description={item.description}
                    align={idx % 2 === 0 ? "left" : "right"}
                  />
                </li>
              ))}
            </ol>
          </article>

          <article className="lg:col-span-2" aria-labelledby="about-greeting">
            <h2 id="about-greeting" className="mb-6 text-2xl font-semibold">대표 인사말</h2>
            <div className="max-w-3xl">
              <p className="mt-4 text-sm text-zinc-600">
                안녕하십니까.
              </p>
              <p className="mt-4 text-sm text-zinc-600">
                FM은 변화의 중심에서 새로운 가능성을 설계하는 기업입니다.
                우리는 기술과 데이터, 그리고 디자인이 만들어내는 조화를 통해 세상과 사람을 더 가깝게 연결하고자 합니다.
              </p>
              <p className="mt-4 text-sm text-zinc-600">
                FM의 핵심 가치는 <strong>‘신뢰를 바탕으로 한 지속 가능한 성장’</strong> 입니다.
                단기적인 성과보다, 오래도록 함께할 수 있는 관계와 구조를 만들어가는 것이 우리의 진정한 목표입니다.
                이를 위해 FM은 각 사업 영역에서 정직한 프로세스, 투명한 정보, 책임 있는 결과를 바탕으로 고객과 사회가 함께 성장할 수 있는 환경을 구축하고 있습니다.
              </p>
              <p className="mt-4 text-sm text-zinc-600">
                우리는 웹 서비스 개발과 브랜드 전략, 데이터 기반 분석, 그리고 투자 및 인프라 솔루션 등 다양한 분야에서 경험을 축적해 왔습니다.
                이러한 노하우를 토대로, FM은 앞으로도 공공과 민간, 사람과 기술을 연결하는 플랫폼 기업으로 성장하겠습니다.
              </p>
              <p className="mt-4 text-sm text-zinc-600">
                세상은 빠르게 변하지만, 본질은 변하지 않습니다.
                FM은 언제나 진정성 있는 혁신과 사람 중심의 가치를 지키며,
                신뢰받는 파트너로서 함께 나아가겠습니다.
              </p>
              <p className="mt-4 text-sm text-zinc-600">
                방문해 주신 모든 분들께 진심으로 감사드리며,
                앞으로도 많은 관심과 성원을 부탁드립니다.
              </p>
              <div className="relative mt-6">
                <p className="text-sm text-zinc-600 text-right pr-24">
                  대표이사 홍길동 드림
                </p>
                {/* 대표자 서명 이미지 (public/sign.png) */}
                <Image
                  src="/sign.png"
                  alt="대표이사 서명"
                  width={180}
                  height={180}
                  className="pointer-events-none select-none absolute right-0 top-1/2 -translate-y-1/2 h-20 w-auto md:h-24 opacity-80"
                />
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-12" aria-labelledby="about-location">
        <h2 id="about-location" className="mb-6 text-2xl font-semibold">오시는 길</h2>
        <div className="grid gap-4">
          <Location
            address="서울특별시 강남구 테헤란로 123"
            lat={37.49795}
            lng={127.02764}
            height={360}
            queryText="서울특별시 강남구 테헤란로 123"
          />
          <p className="text-sm text-zinc-600">
            대중교통: 2호선 강남역 11번 출구 도보 5분, 신분당선 신논현역 5번 출구 도보 8분
          </p>
        </div>
      </section>


      <section className="mx-auto w-full max-w-6xl px-6 py-12" aria-labelledby="about-business-desc">
        <h2 id="about-business-desc" className="mb-4 text-2xl font-semibold">사업영역</h2>
        <BusinessExplorer
          items={[
            {
              key: "platform",
              title: "플랫폼 개발",
              summary: "사용자 경험 중심의 맞춤형 플랫폼 개발과 클라우드 네이티브 기반의 시스템 통합",
              content: (
                <div>
                  <p className="mt-1">
                    다양한 산업의 요구를 기술로 연결하는 맞춤형 플랫폼을 설계·구축합니다. UX 중심 설계와 클라우드 네이티브 인프라를 통해 데이터 흐름이 단일 환경에서 유기적으로 작동하도록 통합합니다.
                  </p>
                  <ul className="mt-3 list-disc pl-5">
                    <li>Web/App 플랫폼 개발, 시스템 통합(SI)</li>
                    <li>SSO, API 연계, 보안 인증, 관리자 CMS</li>
                    <li>클라우드 아키텍처 구축 및 데이터 관리 솔루션</li>
                  </ul>
                </div>
              ),
            },
            {
              key: "investment",
              title: "투자 및 사업 육성",
              summary: "기술 스타트업 투자·공동개발·R&D 지원을 통한 성과 창출형 성장",
              content: (
                <div>
                  <p className="mt-1">
                    기술 중심 혁신 기업/프로젝트에 전략적 투자를 통해 성장의 촉매 역할을 수행합니다. 내부 기술 자산과 브랜드 운영 노하우를 더해 성과 창출형 투자 구조를 지향합니다.
                  </p>
                  <ul className="mt-3 list-disc pl-5">
                    <li>기술 스타트업 투자 및 공동 프로젝트 개발</li>
                    <li>R&amp;D 지원과 기술 IP 기반 사업화</li>
                    <li>시장 트렌드 분석과 기술 검증을 통한 발굴</li>
                  </ul>
                </div>
              ),
            },
            {
              key: "public",
              title: "공공 및 사회혁신",
              summary: "공공데이터 플랫폼·행정정보 통합 등 사회적 가치 확산을 위한 공공 플랫폼 사업",
              content: (
                <div>
                  <p className="mt-1">
                    공공기관/지자체와 협력하여 행정 효율화, 정보 투명화, 시민 참여 확대를 위한 공공 플랫폼 사업을 수행합니다.
                  </p>
                  <ul className="mt-3 list-disc pl-5">
                    <li>공공데이터 플랫폼 구축, 행정정보 통합 시스템</li>
                    <li>지역경제·문화 콘텐츠 디지털화</li>
                    <li>데이터 수집·자동화·시각화를 통한 사회혁신 프로젝트</li>
                  </ul>
                </div>
              ),
            },
          ]}
        />
      </section>
    </div>
  );
}
