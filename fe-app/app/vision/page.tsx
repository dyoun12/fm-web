import type { Metadata } from "next";
import { VisionValues } from "../components/organisms/vision-values/vision-values";

export const metadata: Metadata = {
  title: "비전",
  description: "FM Corp의 미션, 비전, 핵심 가치를 소개합니다.",
  alternates: { canonical: "/vision" },
  openGraph: {
    title: "FM Corp — 비전",
    description: "FM Corp의 미션, 비전, 핵심 가치를 소개합니다.",
    url: "/vision",
  },
};

export default function VisionPage() {
  return (
    <div className="w-full">
      <section className="mx-auto w-full max-w-6xl px-6 py-12" aria-labelledby="vision-heading">
        <h1 id="vision-heading" className="mb-6 text-3xl font-semibold">비전</h1>
        <VisionValues
          items={[
            {
              key: "mission",
              title: "미션",
              description: "사람 중심의 기술로 더 나은 세상을 만듭니다.",
            },
            {
              key: "vision",
              title: "비전",
              description: "지속 가능한 혁신으로 산업과 사회에 긍정적 영향을 제공합니다.",
            },
            {
              key: "values",
              title: "핵심 가치",
              description: "고객 중심 · 투명성 · 협업 · 지속가능성",
            },
          ]}
        />
        <div className="mt-8 h-64 w-full rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 text-center text-sm text-zinc-500 flex items-center justify-center">
          이미지/일러스트 자리표시자
        </div>
      </section>
    </div>
  );
}
