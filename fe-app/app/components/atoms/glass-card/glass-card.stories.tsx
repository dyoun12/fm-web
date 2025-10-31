import { GlassCard } from "./glass-card";

export default {
  title: "Atoms/GlassCard",
  component: GlassCard,
  tags: ["autodocs"],
};

const ScrollBackdrop = (Story: any) => (
  <div className="relative h-[320px] overflow-auto rounded-3xl border border-zinc-200 bg-white">
    {/* 배경 레이어: 텍스트와 이미지가 섞인 컨텐츠를 길게 스크롤 가능 */}
    <div className="absolute inset-0 z-0">
      <div className="pointer-events-none select-none">
        <div className="bg-gradient-to-br from-zinc-50 to-zinc-200">
          <div className="mx-auto max-w-3xl p-6">
            <h2 className="text-2xl font-bold text-zinc-800">회사 소식과 인사이트</h2>
            <p className="mt-2 text-zinc-600">백드롭 블러가 적용되면 이 텍스트가 유리 뒤에서 흐려집니다.</p>
            <div className="mt-4 grid grid-cols-3 gap-3 opacity-90">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://picsum.photos/seed/1/200/120" alt="bg1" className="h-24 w-full rounded object-cover" />
              <img src="https://picsum.photos/seed/2/200/120" alt="bg2" className="h-24 w-full rounded object-cover" />
              <img src="https://picsum.photos/seed/3/200/120" alt="bg3" className="h-24 w-full rounded object-cover" />
            </div>
            <div className="mt-6 space-y-3 text-sm leading-6 text-zinc-600">
              {Array.from({ length: 8 }).map((_, i) => (
                <p key={i}>
                  백드롭 테스트 문단 {i + 1}. 지속 가능한 도시, 데이터 기반 의사결정, ESG, 스마트 인프라 등
                  다양한 키워드가 포함된 더미 콘텐츠입니다.
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* 포그라운드: 글래스 카드가 스크롤 중에도 읽히는지 확인 */}
    <div className="relative z-10 p-6">
      <div className="mx-auto grid max-w-3xl gap-6">
        <div className="sticky top-6">
          <Story />
        </div>
        {/* 추가 콘텐츠로 카드 아래로도 배경 스크롤 유지 */}
        <div className="space-y-3 text-sm leading-6 text-zinc-600">
          {Array.from({ length: 12 }).map((_, i) => (
            <p key={i}>추가 본문 {i + 1}. 카드 하단에서도 배경 흐림 효과가 지속됩니다.</p>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const Default = {
  args: {
    children: (
      <div>
        <h3 className="text-lg font-semibold text-zinc-900">Glass 카드</h3>
        <p className="text-sm text-zinc-700">백드롭 블러 + 테두리로 유리 느낌 확인</p>
      </div>
    ),
  },
  decorators: [ScrollBackdrop],
};

export const StrongBlur = {
  args: {
    blur: "lg" as const,
    children: (
      <div>
        <h3 className="text-lg font-semibold text-zinc-900">강한 블러</h3>
        <p className="text-sm text-zinc-700">배경 텍스트/이미지가 더 뚜렷하게 흐려집니다.</p>
      </div>
    ),
  },
  decorators: [ScrollBackdrop],
};

export const DarkTheme = {
  args: {
    blur: "md" as const,
    theme: "dark" as const,
    children: (
      <div>
        <h3 className="text-lg font-semibold text-white">다크 테마</h3>
        <p className="text-sm text-white/85">어두운 배경에서도 테두리/유리 느낌 확인</p>
      </div>
    ),
  },
  decorators: [ScrollBackdrop],
};
