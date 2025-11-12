import type { Metadata } from "next";
import { VisionValues, VisionValuesContent } from "../components/organisms/vision-values/vision-values";

export const metadata: Metadata = {
  title: "비전",
  description: "FM의 비전·미션·핵심 가치·슬로건을 안내합니다.",
  alternates: { canonical: "/vision" },
  openGraph: {
    title: "FM Corp — 비전",
    description: "FM의 비전·미션·핵심 가치·슬로건을 안내합니다.",
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
            { key: "vision", title: "비전", imageUrl: "https://picsum.photos/seed/vision-page-vision/960/540", imageAlt: "FM 비전 관련 이미지" },
            { key: "mission", title: "미션", imageUrl: "https://picsum.photos/seed/vision-page-mission/960/540", imageAlt: "FM 미션 관련 이미지" },
            { key: "values", title: "핵심 가치", imageUrl: "https://picsum.photos/seed/vision-page-values/960/540", imageAlt: "FM 핵심 가치 관련 이미지" },
            { key: "slogan", title: "슬로건", imageUrl: "https://picsum.photos/seed/vision-page-values/960/540", imageAlt: "FM 슬로건 관련 이미지" },
          ]}
        >
          <VisionValuesContent tabKey="vision">
            <p className="whitespace-pre-line text-md leading-relaxed text-zinc-700 mb-2">
              <strong>기술로 성장하고, 연결로 확장한다.</strong>
            </p>
            <p className="whitespace-pre-line text-md leading-relaxed text-zinc-700">
              • 기술이 산업과 사회의 경계를 허무는 시대에 모든 가치가 데이터와 플랫폼으로 연결되는 미래 생태계의 중심이 되겠습니다.
            </p>
            <p className="whitespace-pre-line text-md leading-relaxed text-zinc-700">
              • 기술을 통해 더 나은 비즈니스 구조를 설계하고, 투자와 협업으로 가능성을 현실로 만드는 디지털 전환의 동반자를 지향합니다.
            </p>
            <p className="whitespace-pre-line text-md leading-relaxed text-zinc-700">
              • FM의 비전은 단순한 기술 제공이 아닌, ‘지속 가능한 연결’을 실현하는 글로벌 솔루션 기업으로 성장하는 것입니다.
            </p>
          </VisionValuesContent>
          <VisionValuesContent tabKey="mission">
            <p className="whitespace-pre-line text-md leading-relaxed text-zinc-700 mb-2">
              <strong>사람 중심의 기술로 더 나은 세상을 만듭니다.</strong>
            </p>
            <p className="whitespace-pre-line text-md leading-relaxed text-zinc-700">• 혁신적 플랫폼으로 산업의 디지털 전환을 이끈다.</p>
            <p className="whitespace-pre-line text-md leading-relaxed text-zinc-700">• 기술과 자본을 결합해 미래 가치를 창출한다.</p>
            <p className="whitespace-pre-line text-md leading-relaxed text-zinc-700">• 공공과 사회에 기술의 혜택을 확산시킨다.</p>
            <p className="whitespace-pre-line text-md leading-relaxed text-zinc-700">• 지속 가능한 생태계를 구축한다.</p>
          </VisionValuesContent>
          <VisionValuesContent tabKey="values">
            <p className="whitespace-pre-line text-md leading-relaxed text-zinc-700">
              <strong>혁신</strong>: 끊임없는 기술 탐구로 한계를 넘어서는 솔루션을 창출합니다.
            </p>
            <p className="whitespace-pre-line text-md leading-relaxed text-zinc-700">
              <strong>진정성</strong>: 신뢰 기반의 투명한 프로세스와 정직한 개발을 지향합니다.
            </p>
            <p className="whitespace-pre-line text-md leading-relaxed text-zinc-700">
              <strong>협력</strong>: 산업과 공공 영역이 기술로 연결되어 함께 성장하도록 지원합니다.
            </p>
            <p className="whitespace-pre-line text-md leading-relaxed text-zinc-700">
              <strong>지속가능성</strong>: 장기적 가치와 사회적 영향을 고려한 사업을 수행합니다.
            </p>
            <p className="whitespace-pre-line text-md leading-relaxed text-zinc-700">
              <strong>전문성</strong>: 축적된 노하우와 기술력으로 완성도 높은 결과를 제공합니다.
            </p>
          </VisionValuesContent>
          <VisionValuesContent tabKey="slogan">
            <p className="whitespace-pre-line text-md leading-relaxed text-zinc-700">
              기술을 통해 사람·산업·데이터가 유기적으로 연결되고,
              그 연결에서 새로운 가치와 기회가 창출된다는 FM의 지향점을 담고 있습니다.
            </p>
            <p className="whitespace-pre-line text-md leading-relaxed text-zinc-700">
              우리는 기술 기반의 연결로 업무 효율을 높이고, 협업을 촉진하며,
              사회적 가치까지 확장되는 선순환을 만들어 갑니다.
            </p>
          </VisionValuesContent>
        </VisionValues>
      </section>
    </div>
  );
}
