import type { Metadata } from "next";
import { HeroBanner } from "./components/molecules/hero-banner/hero-banner";
import { CtaSection } from "./components/molecules/cta-section/cta-section";
import Link from "next/link";
import { PostList } from "@/app/components/organisms/post-list/post-list";
import { listPosts } from "@/api/posts";

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

export default async function Home() {
  const posts = await listPosts();
  return (
    <div className="w-full">
      <section aria-labelledby="home-hero" className="mt-6 md:mt-10">
        <HeroBanner
          title="미래를 설계하는 FM Corp"
          subtitle="혁신적인 기술과 디자인으로 더 나은 경험을 만듭니다."
          primaryAction={{ label: "문의하기", href: "/contact" }}
          secondaryAction={{ label: "회사 소개", href: "/about" }}
          backgroundType="image"
          backgroundImageUrl="/hero.png"
          className="mx-6 md:mx-8 rounded-3xl"
        />
      </section>

      <section aria-labelledby="home-news" className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="flex justify-between place-items-center mb-6">
          <h2 id="home-news" className="text-2xl font-semibold">최신 소식</h2>
          <Link 
            href="posts"
            className="text-sm font-medium text-blue-600 transition hover:text-blue-500"
            aria-label="모두 보기"
          >
            모두보기
          </Link>
        </div>
        <PostList
          items={posts.items}
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
