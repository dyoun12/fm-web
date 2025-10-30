import Link from "next/link";
import { Button } from "../components/atoms/button/button";
import { Input } from "../components/atoms/input/input";
import { Checkbox } from "../components/atoms/checkbox/checkbox";
import { Spinner } from "../components/atoms/spinner/spinner";
import { IconButton } from "../components/atoms/icon-button/icon-button";
import { Badge } from "../components/atoms/badge/badge";
import { Select } from "../components/atoms/select/select";
import { TextArea } from "../components/atoms/text-area/text-area";
import { Radio } from "../components/atoms/radio/radio";
import { Divider } from "../components/atoms/divider/divider";
import { Skeleton } from "../components/atoms/skeleton/skeleton";
import { Tag } from "../components/atoms/tag/tag";
import { Toggle } from "../components/atoms/toggle/toggle";
import { Tooltip } from "../components/atoms/tooltip/tooltip";
import { FeatureCard } from "../components/molecules/feature-card/feature-card";
import { HeroBanner } from "../components/molecules/hero-banner/hero-banner";
import { ContactForm } from "../components/molecules/contact-form/contact-form";
import { NewsTicker } from "../components/molecules/news-ticker/news-ticker";
import { CtaSection } from "../components/molecules/cta-section/cta-section";
import { TimelineItem } from "../components/molecules/timeline-item/timeline-item";
import { TeamMemberCard } from "../components/molecules/team-member-card/team-member-card";
import { GlobalHeader } from "../components/organisms/global-header/global-header";
import { GlobalFooter } from "../components/organisms/global-footer/global-footer";
import { NoticeList } from "../components/organisms/notice-list/notice-list";
import { PostDetail } from "../components/organisms/post-detail/post-detail";
import { CategoryFilterPanel } from "../components/organisms/category-filter-panel/category-filter-panel";
import { AdminDashboardOverview } from "../components/organisms/admin-dashboard-overview/admin-dashboard-overview";

type ComponentItem = {
  name: string;
  priority: "A" | "B" | "C";
  description: string;
  interactions: string[];
  guidelines: string[];
};

const atoms: ComponentItem[] = [
  {
    name: "Button",
    priority: "A",
    description: "Primary/Secondary/유틸리티 버튼과 상태 정의",
    interactions: [
      "Hover 시 대비 상승, Focus 시 키보드 포커스 링 표시",
      "Loading 상태일 때 스피너와 함께 텍스트 투명도 60%",
    ],
    guidelines: [
      "variant과 size 조합을 화면 맥락에 맞게 제한적으로 사용",
      "아이콘만 사용하는 경우 `aria-label`을 반드시 제공",
    ],
  },
  {
    name: "IconButton",
    priority: "B",
    description: "아이콘 기반의 콤팩트 액션 트리거",
    interactions: [
      "Hover 시 배경 tint, Focus 시 원형 테두리 표시",
      "Disabled일 때 투명도 40%, 포인터 이벤트 차단",
    ],
    guidelines: [
      "터치 영역 최소 40px 확보",
      "아이콘은 20~24px 사이 크기를 유지",
    ],
  },
  {
    name: "TextLink",
    priority: "A",
    description: "본문 내 링크 스타일과 접근성 가이드",
    interactions: [
      "Hover 시 색상 진하게, underline 유지",
      "Focus 시 외곽선 강조 및 키보드 이동 지원",
    ],
    guidelines: [
      "외부 링크는 `rel=\"noopener noreferrer\"` 적용",
      "문장 내 의미가 드러나는 앵커 텍스트 사용",
    ],
  },
  {
    name: "Badge",
    priority: "B",
    description: "상태 표시용 색상 배지",
    interactions: [
      "Hover 상호작용 없음(정보성 요소)",
      "상태별 컬러 토큰과 대비 유지",
    ],
    guidelines: [
      "문장 앞에 배치하여 상태를 먼저 전달",
      "아이콘과 조합 시 좌측에 12px 간격 유지",
    ],
  },
  {
    name: "Input",
    priority: "A",
    description: "텍스트 입력 필드, 오류/성공 상태 포함",
    interactions: [
      "Focus 시 보더 두께 증가 및 그림자 미세 강조",
      "Error 상태일 때 보더/HelperText를 Danger 색상으로 변경",
    ],
    guidelines: [
      "Label과 Input은 `htmlFor`/`id`로 연결",
      "오류 메시지는 `aria-describedby`로 참조한다",
    ],
  },
  {
    name: "Checkbox",
    priority: "A",
    description: "동의 및 필터 체크박스 패턴",
    interactions: [
      "Indeterminate 시 대시 아이콘 렌더링",
      "Disabled 상태는 불투명도 50% 및 포인터 차단",
    ],
    guidelines: [
      "그룹 사용 시 `fieldset`과 `legend`로 감싼다",
      "보조 설명은 `aria-describedby`로 연결",
    ],
  },
  {
    name: "Spinner",
    priority: "A",
    description: "로딩 상태 표시 스피너",
    interactions: [
      "CSS `animate-spin`을 사용한 지속 회전",
      "Overlay 모드에서는 배경 dim 처리",
    ],
    guidelines: [
      "반드시 `aria-label` 혹은 `role=\"status\"` 제공",
      "연속 스피너 사용 시 4초 후 Skeleton 대체 고려",
    ],
  },
];

const molecules: ComponentItem[] = [
  {
    name: "HeroBanner",
    priority: "A",
    description: "히어로 섹션: 타이틀, CTA, 백그라운드",
    interactions: [
      "Primary CTA Hover 시 색상 전환, Secondary는 테두리 강조",
      "BackgroundType이 이미지일 때 자동 그라디언트 오버레이 적용",
    ],
    guidelines: [
      "본문 텍스트는 최대 3라인, CTA는 2개 이하로 제한",
      "모바일에서는 콘텐츠를 세로 스택으로 전환",
    ],
  },
  {
    name: "FeatureCard",
    priority: "A",
    description: "이미지/아이콘과 사업 소개 카드",
    interactions: [
      "Hover 시 그림자 강화 및 위로 4px 상승",
      "Focus 시 아웃라인 + 내부 그림자",
    ],
    guidelines: [
      "타이틀 길이는 2줄 이내, 설명은 4줄 내로 제한",
      "그리드 레이아웃 사용 시 동일 높이를 유지",
    ],
  },
  {
    name: "StatCard",
    priority: "A",
    description: "핵심 지표를 강조하는 카드",
    interactions: [
      "Trend 정보가 있을 때 아이콘/색상으로 상승·하락 표시",
      "Skeleton 상태 제공으로 로딩 대응",
    ],
    guidelines: [
      "값은 locale 기반 포맷팅 적용",
      "변동 수치는 퍼센트/절대값 중 하나를 선택해 통일",
    ],
  },
  {
    name: "ContactForm",
    priority: "A",
    description: "문의 폼 + 유효성 검사 + 성공/실패 피드백",
    interactions: [
      "Submit 시 버튼 로딩과 필드 disable 처리",
      "성공 시 Success Banner, 실패 시 Error Banner 노출",
    ],
    guidelines: [
      "필수 필드는 별도 표시 및 오류 메시지 제공",
      "스팸 방지를 위한 HoneyPot 또는 reCAPTCHA 고려",
    ],
  },
  {
    name: "TimelineItem",
    priority: "B",
    description: "연혁/타임라인 단위 항목",
    interactions: [
      "Hover 시 타임라인 라인 강조",
      "모바일에서 라벨이 상단으로 이동하도록 전환",
    ],
    guidelines: [
      "연도/날짜를 선두에 두고 순차 정렬",
      "아이콘과 텍스트 간 12px 간격 유지",
    ],
  },
  {
    name: "TeamMemberCard",
    priority: "B",
    description: "멤버 소개 카드 (아바타, 직함, 소셜)",
    interactions: [
      "소셜 링크 Hover 시 브랜드 컬러 적용",
      "아바타에 Hover 시 미세 확대 효과 제공",
    ],
    guidelines: [
      "프로필 정보는 3줄 내로 제한",
      "소셜 링크는 `aria-label`과 함께 제공",
    ],
  },
];

const organisms: ComponentItem[] = [
  {
    name: "GlobalHeader",
    priority: "A",
    description: "상단 네비게이션과 CTA를 담은 헤더",
    interactions: [
      "스크롤 시 Sticky + 배경 색상 전환",
      "모바일에서 메뉴 버튼 클릭 시 Drawer Slide-in",
    ],
    guidelines: [
      "현재 페이지는 underline으로 강조",
      "CTA 버튼은 한 개만 유지해 시선 집중",
    ],
  },
  {
    name: "GlobalFooter",
    priority: "A",
    description: "회사 정보, 링크, 저작권 포함 푸터",
    interactions: [
      "링크 Focus 시 아웃라인 강조",
      "뉴스레터 제출 후 성공 메시지 표시",
    ],
    guidelines: [
      "법적 고지와 개인정보 처리방침 링크 필수",
      "모바일에서는 섹션을 아코디언으로 전환",
    ],
  },
  {
    name: "AboutOverview",
    priority: "A",
    description: "기업 개요 섹션 묶음",
    interactions: [
      "각 섹션 진입 시 페이드 인 애니메이션",
      "모바일에서 섹션 간 간격을 48px로 축소",
    ],
    guidelines: [
      "핵심 메시지를 카드형으로 그룹화",
      "이미지는 비율 16:9로 통일",
    ],
  },
  {
    name: "VisionValues",
    priority: "A",
    description: "비전/미션/핵심 가치 소개 섹션",
    interactions: [
      "탭 전환 시 페이드 애니메이션 적용",
      "키보드 방향키로 탭 이동 지원",
    ],
    guidelines: [
      "핵심 가치 3~4개로 제한해 집중도 유지",
      "각 항목에 아이콘 또는 수치를 배치",
    ],
  },
  {
    name: "ContactSection",
    priority: "A",
    description: "지도, 문의 정보, 폼 통합 영역",
    interactions: [
      "지도 영역은 마우스 휠 잠금 옵션 제공",
      "문의 폼과 연락처 카드가 동시에 노출",
    ],
    guidelines: [
      "지도 대체 텍스트 제공",
      "연락처 정보는 클릭 가능한 링크(전화/메일)로 제공",
    ],
  },
  {
    name: "NoticeList",
    priority: "A",
    description: "공지 게시물 리스트 프리뷰",
    interactions: [
      "무한 스크롤 또는 '더보기' 버튼 지원",
      "로딩 시 Skeleton, 빈 상태 시 안내 메시지",
    ],
    guidelines: [
      "게시일과 카테고리를 정렬에 활용",
      "리스트 항목 간격은 20px 유지",
    ],
  },
];

const contactFormFields = [
  { id: "name", label: "이름", type: "text", required: true },
  { id: "email", label: "이메일", type: "email", required: true },
  {
    id: "message",
    label: "문의 내용",
    type: "textarea" as const,
    required: true,
  },
];

const sampleNavigation = [
  { label: "회사 소개", href: "/about" },
  { label: "비전", href: "/vision" },
  { label: "프로젝트", href: "/projects" },
  { label: "공지사항", href: "/notice", isActive: true },
];

const sampleNotices = [
  {
    id: "notice-1",
    title: "2025년 통합 플랫폼 공개",
    category: "공지",
    publishedAt: "2025-10-10T00:00:00.000Z",
    summary: "법인 홈페이지와 관리자 콘솔 베타 버전을 공개했습니다.",
    href: "#",
  },
  {
    id: "notice-2",
    title: "2025 Q4 IR 자료 업로드",
    category: "IR",
    publishedAt: "2025-10-20T00:00:00.000Z",
    summary: "주요 지표, 투자 계획, ESG 활동 보고서를 확인하세요.",
    href: "#",
  },
];

const sampleFooter = {
  companyInfo: {
    name: "FM Corporation",
    address: "서울특별시 강남구 테헤란로 123, 9층",
    email: "contact@fm-corp.com",
  },
  navigationSections: [
    {
      title: "회사",
      links: [
        { label: "회사 소개", href: "/about" },
        { label: "연혁", href: "/about#history" },
      ],
    },
    {
      title: "리소스",
      links: [
        { label: "공지사항", href: "/notice" },
        { label: "IR 자료", href: "/ir" },
      ],
    },
  ],
  legalLinks: [
    { label: "이용약관", href: "/terms" },
    { label: "개인정보처리방침", href: "/privacy" },
  ],
};

const newsTickerItems = [
  {
    id: "ticker-1",
    title: "2025년 스마트시티 파트너십 체결",
    href: "#",
    category: "프로젝트",
  },
  {
    id: "ticker-2",
    title: "IR 자료: 2025년 3분기 실적 공개",
    href: "#",
    category: "IR",
  },
];

const timelineItems = [
  {
    year: "2023",
    title: "창립",
    description: "FM 법인이 설립되며 플랫폼 전략을 수립했습니다.",
  },
  {
    year: "2024",
    title: "해외 진출",
    description: "동남아 3개국에 스마트시티 프로젝트를 런칭했습니다.",
    align: "right" as const,
  },
];

const teamMembers = [
  {
    name: "김현우",
    role: "투자 전략 리드",
    bio: "스마트 인프라와 ESG 투자 전략을 담당합니다.",
  },
  {
    name: "이지은",
    role: "프로젝트 매니저",
    bio: "대형 지자체 프로젝트의 실행과 품질 관리를 총괄합니다.",
  },
];

const dashboardStats = [
  {
    label: "전체 게시물",
    value: "128",
    trend: { direction: "up" as const, value: "+8.4%" },
  },
  {
    label: "활성 사용자",
    value: "32",
    unit: "명",
    trend: { direction: "flat" as const, value: "변화 없음" },
  },
  {
    label: "승인 대기",
    value: "5",
    unit: "건",
    trend: { direction: "down" as const, value: "-2" },
  },
];

const dashboardActivities = [
  {
    id: "activity-1",
    actor: "김지현",
    action: "이 ‘2025 Q4 IR 보고서’를 게시했습니다.",
    timestamp: new Date().toISOString(),
  },
  {
    id: "activity-2",
    actor: "박성민",
    action: "이 ‘공지: 시스템 점검 안내’를 수정했습니다.",
    timestamp: new Date().toISOString(),
  },
];

const dashboardAlerts = [
  "보안 경고: 2FA 미등록 계정 1건",
  "승인 대기 문서 5건",
];

function ComponentSection({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: ComponentItem[];
}) {
  return (
    <section className="flex flex-col gap-6 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
      <header className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-zinc-900">{title}</h2>
        <p className="text-sm text-zinc-500">{description}</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <article
            key={item.name}
            className="flex flex-col gap-3 rounded-xl border border-zinc-100 bg-zinc-50 p-5 text-zinc-700"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-zinc-900">{item.name}</h3>
              <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold uppercase text-zinc-600">
                Priority {item.priority}
              </span>
            </div>
            <p className="text-sm leading-6">{item.description}</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-zinc-200 px-2 py-1 text-zinc-600">
                Story 준비 필요
              </span>
              <span className="rounded-full bg-zinc-200 px-2 py-1 text-zinc-600">
                테스트 TBD
              </span>
            </div>
            <div className="grid gap-3 text-sm leading-6">
              <div>
                <p className="font-medium text-zinc-800">상호작용 가이드</p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-zinc-600">
                  {item.interactions.map((interaction) => (
                    <li key={interaction}>{interaction}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium text-zinc-800">사용 시 참고</p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-zinc-600">
                  {item.guidelines.map((guide) => (
                    <li key={guide}>{guide}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>
      <p className="text-xs text-zinc-400">
        각 카드에는 컴포넌트 스토리, 테스트, 접근성 체크리스트가 연결될
        예정입니다.
      </p>
    </section>
  );
}

export default function DevCatalogPage() {
  return (
    <div className="min-h-screen bg-zinc-100 py-16">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6">
        <header className="flex flex-col gap-4">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            디자인 시스템 카탈로그
          </p>
          <h1 className="text-4xl font-semibold text-zinc-900">
            FM 법인 홈페이지 UI 컴포넌트
          </h1>
          <p className="max-w-3xl text-base text-zinc-600">
            이 페이지는 디자인 시스템 컴포넌트를 한눈에 검토하기 위한 카탈로그
            입니다. 각 컴포넌트는 우선순위, 주요 역할과 함께 스토리/테스트
            상태, 상호작용 가이드, 사용 시 유의사항을 함께 제공합니다.
            향후 Playground와 접근성 점검 섹션이 추가됩니다.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link
              href="/"
              className="rounded-full bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-500"
            >
              메인으로 돌아가기
            </Link>
            <Link
              href="https://nextjs.org/docs/app"
              className="rounded-full border border-zinc-300 px-4 py-2 font-medium text-zinc-600 transition hover:border-zinc-400"
            >
              Next.js App Router 문서
            </Link>
            <span className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 font-medium text-blue-700">
              디자인 가이드: `docs/design-guide.md`
            </span>
          </div>
        </header>
        <ComponentSection
          title="Atoms"
          description="가장 작은 UI 단위로, 다른 모든 컴포넌트의 기반이 됩니다."
          items={atoms}
        />
        <ComponentSection
          title="Molecules"
          description="Atoms를 조합해 특정 목적을 수행하는 중간 규모의 패턴입니다."
          items={molecules}
        />
        <ComponentSection
          title="Organisms"
          description="페이지 섹션을 구성하는 대형 컴포넌트로, 완성된 사용자 경험을 제공합니다."
          items={organisms}
        />
        <section className="flex flex-col gap-8 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <header className="flex flex-col gap-3">
            <h2 className="text-2xl font-semibold text-zinc-900">
              샘플 컴포넌트 프리뷰
            </h2>
            <p className="text-sm text-zinc-500">
              Storybook 기본 args와 동일한 속성으로 렌더링하여 Dev Preview와
              디자인 명세 간 일관성을 확인합니다.
            </p>
          </header>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="flex flex-col gap-4 rounded-2xl border border-zinc-100 bg-zinc-50 p-5">
              <h3 className="text-sm font-semibold uppercase text-zinc-500">
                Atoms
              </h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button loading>Loading</Button>
                <IconButton aria-label="즐겨찾기">★</IconButton>
                <Badge>공지</Badge>
              </div>
              <Divider />
              <div className="grid gap-4">
                <Input
                  label="이메일"
                  placeholder="example@fm-corp.com"
                  helperText="업무용 이메일을 입력해주세요."
                  defaultValue=""
                />
                <Select
                  label="카테고리"
                  placeholder="카테고리 선택"
                  options={[
                    { label: "공지", value: "notice" },
                    { label: "IR", value: "ir" },
                  ]}
                  defaultValue="notice"
                />
                <TextArea label="메모" placeholder="내용을 입력하세요" />
                <Checkbox label="뉴스레터 수신 동의" defaultChecked />
                <Radio label="IR" name="category" defaultChecked />
                <div className="flex items-center gap-3">
                  <Spinner size="sm" />
                  <Skeleton variant="text" className="w-32" />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Tag>전체</Tag>
                  <Toggle checked label="활성" />
                  <Tooltip content="추가 정보를 확인하세요">
                    <IconButton aria-label="도움말">?</IconButton>
                  </Tooltip>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 rounded-2xl border border-zinc-100 bg-zinc-50 p-5">
              <h3 className="text-sm font-semibold uppercase text-zinc-500">
                Molecules
              </h3>
              <HeroBanner
                title="FM 법인의 통합 플랫폼"
                subtitle="기업 비전과 핵심 사업을 빠르게 확인하고 문의까지 연결하세요."
                primaryAction={{ label: "서비스 살펴보기", href: "#" }}
                secondaryAction={{ label: "문의하기", href: "#" }}
              />
              <NewsTicker items={newsTickerItems} autoplay={false} />
              <FeatureCard
                title="ESG 컨설팅"
                description="규제 대응과 지속가능 경영을 위한 맞춤형 전략을 제안합니다."
                href="#"
              />
              <CtaSection
                title="프로젝트 상담을 신청하세요"
                description="전문 컨설턴트가 2영업일 내에 연락드립니다."
                primaryAction={{ label: "상담 예약", href: "#" }}
                secondaryAction={{ label: "자료 요청", href: "#" }}
              />
              <ContactForm fields={contactFormFields} />
              {timelineItems.map((item) => (
                <TimelineItem key={item.year} {...item} />
              ))}
              <div className="grid gap-4 sm:grid-cols-2">
                {teamMembers.map((member) => (
                  <TeamMemberCard key={member.name} {...member} />
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6 rounded-2xl border border-zinc-100 bg-zinc-50 p-5">
            <h3 className="text-sm font-semibold uppercase text-zinc-500">
              Organisms
            </h3>
            <GlobalHeader
              brandName="FM Corporation"
              navigation={sampleNavigation}
              cta={{ label: "문의하기", href: "/contact" }}
            />
            <NoticeList items={sampleNotices} variant="grid" />
            <CategoryFilterPanel
              categories={[
                { id: "notice", label: "공지", count: 12 },
                { id: "ir", label: "IR", count: 8 },
              ]}
            />
            <PostDetail
              title="2025년 4분기 사업 보고서"
              category="IR"
              author="FM Corporation"
              publishedAt="2025-10-01T00:00:00.000Z"
              content="<p>4분기 주요 실적과 향후 계획을 공유드립니다.</p>"
            />
            <AdminDashboardOverview
              stats={dashboardStats}
              recentActivities={dashboardActivities}
              alerts={dashboardAlerts}
            />
            <GlobalFooter
              {...sampleFooter}
              newsletter={{
                description: "FM의 최신 소식과 인사이트를 받아보세요.",
              }}
            />
          </div>
        </section>
        <section className="flex flex-col gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-8 text-amber-700">
          <h2 className="text-2xl font-semibold">다음 단계 안내</h2>
          <ul className="list-disc space-y-2 pl-6 text-sm leading-6">
            <li>각 컴포넌트 구현 시 Storybook 스토리와 테스트 파일을 추가합니다.</li>
            <li>변형(variant)별 Playground, 접근성 체크를 위한 패널을 확장합니다.</li>
            <li>사용자 검토 피드백은 전용 문서에 기록하고, 반영 여부를 이력화합니다.</li>
            <li>검토 후 변경 사항은 `docs/design-guide.md`와 이 페이지에 즉시 반영합니다.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
