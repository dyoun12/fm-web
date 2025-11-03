import type { Metadata } from "next";
import { HeroBanner } from "./components/molecules/hero-banner/hero-banner";
import { NoticeList } from "./components/organisms/notice-list/notice-list";
import { CtaSection } from "./components/molecules/cta-section/cta-section";

export const metadata: Metadata = {
  title: "홈",
  description: "FM Corp의 주요 사업과 최신 소식을 확인하세요.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "FM Corp — 홈",
    description: "FM Corp의 주요 사업과 최신 소식을 확인하세요.",
    url: "/",
  },
};

export default function Home() {
  return (
    <div className="w-full">
      <section aria-labelledby="home-hero" className="mt-6 md:mt-10">
        <HeroBanner
          title="미래를 설계하는 FM Corp"
          subtitle="혁신적인 기술과 디자인으로 더 나은 경험을 만듭니다."
          primaryAction={{ label: "회사 소개", href: "/about" }}
          secondaryAction={{ label: "연락처", href: "/contact" }}
          backgroundType="image"
          backgroundImageUrl="/hero.png"
          className="mx-6 md:mx-8 rounded-3xl"
        />
      </section>

      {/* 주요 사업 섹션 제거 (요청에 따라 비표시) */}

      <section aria-labelledby="home-news" className="mx-auto w-full max-w-6xl px-6 py-12">
        <h2 id="home-news" className="mb-6 text-2xl font-semibold">최신 소식</h2>
        <NoticeList
          items={[
            { id: "1", title: "신규 프로젝트 발표", category: "공지", publishedAt: new Date().toISOString(), href: "/notice/1", summary: "차세대 클라우드 플랫폼 공동 추진" },
            { id: "2", title: "채용 안내", category: "채용", publishedAt: new Date().toISOString(), href: "/notice/2", summary: "프론트엔드/백엔드 엔지니어 채용" },
            { id: "3", title: "서비스 업데이트", category: "업데이트", publishedAt: new Date().toISOString(), href: "/notice/3", summary: "성능 개선 및 UI 개편" },
          ]}
          variant="grid"
        />
      </section>

      <section aria-labelledby="home-cta" className="mx-auto w-full max-w-6xl px-6 py-12">
        <CtaSection
          title="함께 만들어갈 파트너를 찾습니다"
          description="프로젝트 문의나 제안이 있으시다면 연락주세요."
          primaryAction={{ label: "문의하기", href: "/contact" }}
          secondaryAction={{ label: "비전 보기", href: "/vision" }}
        />
      </section>
    </div>
  );
}
