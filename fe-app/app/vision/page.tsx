import type { Metadata } from "next";
import { VisionValues, VisionValuesContent } from "../components/organisms/vision-values/vision-values";
import { BrandColorPalette } from "../components/molecules/brand-color-palette/brand-color-palette";
import { LogoDescription } from "../components/molecules/logo-description/logo-description";

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
            { key: "mission", title: "미션", imageUrl: "/mission.png", imageAlt: "FM 미션 관련 이미지" },
            { key: "vision", title: "비전", imageUrl: "/vision.png", imageAlt: "FM 비전 관련 이미지" },
            { key: "values", title: "핵심 가치", imageUrl: "/values.png", imageAlt: "FM 핵심 가치 관련 이미지" },
            { key: "slogan", title: "슬로건", imageUrl: "/slogan.png", imageAlt: "FM 슬로건 관련 이미지" },
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

      <section className="mx-auto w-full max-w-6xl px-6 py-12" aria-labelledby="vision-brand-colors">
        <BrandColorPalette
          title="Brand Color"
          description="각 색상은 FM이 지향하는 ‘신뢰할 수 있는 기술 파트너’라는 정체성을 서로 다른 결로 표현합니다."
          theme="light"
          palette={[
            { name: "Primary", hex: "#2563EB", token: "--color-primary" },
            { name: "Secondary", hex: "#10B981", token: "--color-secondary" },
            { name: "Accent", hex: "#F59E0B", token: "--color-accent" },
            { name: "Neutral", hex: "#111827", token: "--color-neutral" },
          ]}
          bullets={[
            "Primary Blue(#2563EB)는 데이터와 기술에 대한 신뢰, 안정적인 파트너십을 상징합니다.",
            "Secondary Green(#10B981)는 성장과 회복력, 지속 가능한 비즈니스 확장을 의미합니다.",
            "Accent Yellow(#F59E0B)는 새로운 기회를 발견하고 실행하는 도전 정신과 에너지를 담고 있습니다.",
            "Neutral Dark(#111827)는 복잡한 환경 속에서도 흔들리지 않는 기준점이 되는 FM의 태도를 표현합니다.",
          ]}
        />
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-12" aria-labelledby="vision-logo-guide">
        <LogoDescription
          title="로고에 담긴 이야기"
          description="절제된 타이포그래피와 일관된 비율은 ‘묵직한 신뢰’를, 여백과 선의 흐름은 ‘유연한 연결과 확장’을 상징합니다."
          imageUrl="/fm-logo_border.png"
          imageAlt="FM 로고 예시 이미지"
          theme="light"
          bullets={[
            "기울지 않은 수평 구조는 단기 유행보다 ‘오래 가는 구조와 관계’를 세우는 회사의 방향성을 담고 있습니다.",
            "단순한 형태와 절제된 디테일은 복잡한 기술을 고객에게 이해하기 쉬운 언어로 풀어내겠다는 약속을 의미합니다.",
            "로고와 함께 쓰이는 컬러와 여백은 FM이 지향하는 차분하지만 단단한 브랜드 톤을 완성합니다.",
          ]}
        />
      </section>
    </div>
  );
}
