"use client";
import React from "react";
import Link from "next/link";
import { Button } from "../components/atoms/button/button";
import { Input } from "../components/atoms/input/input";
import { Checkbox } from "../components/atoms/checkbox/checkbox";
import { Spinner } from "../components/atoms/spinner/spinner";
import { IconButton } from "../components/atoms/icon-button/icon-button";
import { Badge } from "../components/atoms/badge/badge";
import { Tooltip } from "../components/atoms/tooltip/tooltip";
import { TextLink } from "../components/atoms/text-link/text-link";
import { cn } from "@/lib/classnames";
import { Select } from "../components/atoms/select/select";
import { TextArea } from "../components/atoms/text-area/text-area";
import { Radio } from "../components/atoms/radio/radio";
import { Divider } from "../components/atoms/divider/divider";
import { Skeleton } from "../components/atoms/skeleton/skeleton";
import { Tag } from "../components/atoms/tag/tag";
import { Toggle } from "../components/atoms/toggle/toggle";
import { Card } from "../components/atoms/card/card";
import { ImageCard } from "../components/atoms/image-card/image-card";
import { ColorCard } from "../components/atoms/color-card/color-card";
import { GlassCard } from "../components/atoms/glass-card/glass-card";
// 아래 원자 컴포넌트 중 현재 프리뷰에 사용되는 항목만 유지
import { FeatureCard } from "../components/molecules/feature-card/feature-card";
import { HeroBanner } from "../components/molecules/hero-banner/hero-banner";
import { ContactForm } from "../components/molecules/contact-form/contact-form";
import type { ContactFormField } from "../components/molecules/contact-form/contact-form";
import { NewsTicker } from "../components/molecules/news-ticker/news-ticker";
import { CtaSection } from "../components/molecules/cta-section/cta-section";
import { TimelineItem } from "../components/molecules/timeline-item/timeline-item";
import { TeamMemberCard } from "../components/molecules/team-member-card/team-member-card";
import { StatCard } from "../components/molecules/stat-card/stat-card";
import { FooterLinks } from "../components/molecules/footer-links/footer-links";
import { GlobalHeader } from "../components/organisms/global-header/global-header";
import { GlobalFooter } from "../components/organisms/global-footer/global-footer";
import { NoticeList } from "../components/organisms/notice-list/notice-list";
import { PostDetail } from "../components/organisms/post-detail/post-detail";
import { CategoryFilterPanel } from "../components/organisms/category-filter-panel/category-filter-panel";
import { AdminDashboardOverview } from "../components/organisms/admin-dashboard-overview/admin-dashboard-overview";
import { AboutOverview } from "../components/organisms/about-overview/about-overview";
import { VisionValues, VisionValuesContent } from "../components/organisms/vision-values/vision-values";
import { ContactSection } from "../components/organisms/contact-section/contact-section";
import { AdminSidebar } from "../components/organisms/admin-sidebar/admin-sidebar";
import { BusinessExplorer } from "../components/organisms/business-explorer/business-explorer";

type ComponentItem = {
  name: string;
  priority: "A" | "B" | "C";
  description: string;
  interactions: string[];
  guidelines: string[];
};

const atoms: ComponentItem[] = [
  {
    name: "Card",
    priority: "A",
    description: "콘텐츠를 담는 기본 카드 컨테이너(variant/padding 제공)",
    interactions: [
      "Hover 시 elevated/ghost 변형에서 미세한 배경 또는 그림자 변화",
      "포커스 이동 시 내부 요소의 키보드 탐색과 대비 유지",
    ],
    guidelines: [
      "상호작용은 자식 요소(Link/Button)로 위임하고, 카드는 컨테이너 역할만 수행",
      "레이아웃 간격은 padding props로 제어하며 임의 Tailwind 유틸 추가 지양",
    ],
  },
  {
    name: "ImageCard",
    priority: "A",
    description: "배경 이미지를 가진 카드 컨테이너(오버레이 지원)",
    interactions: [
      "배경 이미지 위에 그라디언트 오버레이로 대비 확보",
      "반응형에서 이미지 크기는 container-fit 유지",
    ],
    guidelines: [
      "텍스트 대비가 낮을 경우 overlay 강도를 높인다",
      "중요 CTA는 상단/좌측 정렬을 우선 고려",
    ],
  },
  {
    name: "ColorCard",
    priority: "A",
    description: "색/그라디언트/틴트 배경 카드를 제공",
    interactions: [
      "Tint 변형은 hover 시 미세 음영 변화",
      "Gradient 변형은 텍스트는 기본적으로 밝은 색",
    ],
    guidelines: [
      "배경과 텍스트 대비를 AA 이상으로 유지",
      "팔레트는 브랜드 컬러 토큰을 우선 사용",
    ],
  },
  {
    name: "GlassCard",
    priority: "B",
    description: "백드롭 블러 기반 유리 효과 카드",
    interactions: [
      "배경 컨텍스트에 따라 투명도/블러로 깊이감 제공",
      "키보드 포커스 시 내부 요소 대비 유지",
    ],
    guidelines: [
      "가독성을 위해 대비 낮은 배경 위에서 사용",
      "중첩 사용 시 blur 강도는 상위보다 낮게 설정",
    ],
  },
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
  {
    name: "Select",
    priority: "B",
    description: "선택 드롭다운",
    interactions: [
      "키보드 위/아래로 옵션 탐색",
      "Disabled일 때 상호작용 차단",
    ],
    guidelines: [
      "플레이스홀더는 의미 있는 안내 문구 사용",
      "옵션 수가 많으면 검색형 컴포넌트를 고려",
    ],
  },
  {
    name: "TextArea",
    priority: "B",
    description: "멀티라인 텍스트 입력",
    interactions: [
      "포커스 시 보더/그림자 강조",
      "에러 상태에서 보조 문구 표시",
    ],
    guidelines: [
      "최소 높이 확보 및 리사이즈 제어",
      "레이블/도움말 텍스트 연결",
    ],
  },
  {
    name: "Radio",
    priority: "B",
    description: "단일 선택 라디오 버튼",
    interactions: [
      "키보드 방향키로 옵션 이동",
      "Disabled 상태 처리",
    ],
    guidelines: [
      "그룹은 name을 동일하게 설정",
      "fieldset/legend로 그룹 레이블 제공",
    ],
  },
  {
    name: "Divider",
    priority: "B",
    description: "구분선",
    interactions: ["상호작용 없음"],
    guidelines: ["레이블과 함께 섹션 구분에 사용"],
  },
  {
    name: "Skeleton",
    priority: "B",
    description: "로딩 상태 스켈레톤",
    interactions: ["애니메이션 펄스"],
    guidelines: ["텍스트/카드 비율에 맞춰 사용"],
  },
  {
    name: "Tag",
    priority: "C",
    description: "선택 가능한 태그",
    interactions: ["선택/제거"],
    guidelines: ["필터/카테고리 선택에 사용"],
  },
  {
    name: "Toggle",
    priority: "C",
    description: "On/Off 토글 스위치",
    interactions: ["클릭/키보드로 전환"],
    guidelines: ["설정 스위치에 사용"],
  },
  {
    name: "Tooltip",
    priority: "C",
    description: "헬프 텍스트 툴팁",
    interactions: ["호버/포커스 시 표시"],
    guidelines: ["간결한 텍스트 유지"],
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
  {
    name: "FooterLinks",
    priority: "A",
    description: "푸터 링크 그룹",
    interactions: ["링크 hover 시 색상 전환"],
    guidelines: ["섹션별 그룹화"],
  },
  {
    name: "NewsTicker",
    priority: "B",
    description: "최신 소식 티커",
    interactions: ["자동/수동 슬라이드"],
    guidelines: ["가독성을 위해 속도 제한"],
  },
  {
    name: "CtaSection",
    priority: "B",
    description: "콜투액션 섹션",
    interactions: ["버튼 클릭, 포커스 처리"],
    guidelines: ["CTA는 2개 이하"],
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
  {
    name: "AdminSidebar",
    priority: "A",
    description: "관리자 네비게이션 사이드바",
    interactions: [
      "현재 경로 활성화 하이라이트",
      "키보드 포커스 이동 및 스크롤 고정",
    ],
    guidelines: [
      "너비 256px 기준, 모바일에서는 Drawer 전환",
      "아이콘과 라벨 간 8px 간격 유지",
    ],
  },
  {
    name: "CategoryFilterPanel",
    priority: "B",
    description: "카테고리 필터 패널",
    interactions: ["체크/검색 동기화"],
    guidelines: ["선택 상태 시 배경 강조"],
  },
  {
    name: "PostDetail",
    priority: "B",
    description: "게시물 상세",
    interactions: ["링크/배지 포커스"],
    guidelines: ["prose 스타일로 본문 표시"],
  },
  {
    name: "AdminDashboardOverview",
    priority: "B",
    description: "관리자 개요 대시보드",
    interactions: ["카드 hover, 리스트 제공"],
    guidelines: ["카드 단위로 통계 그룹화"],
  },
  {
    name: "BusinessExplorer",
    priority: "A",
    description: "사업 카드 클릭에 따른 동적 컨텐츠 노출",
    interactions: ["카드 선택 시 하단 컨텐츠 업데이트"],
    guidelines: ["기본 활성 항목 1개, 요약은 1~2줄"],
  },
];

const contactFormFields: ContactFormField[] = [
  { id: "name", label: "이름", type: "text", required: true },
  { id: "email", label: "이메일", type: "email", required: true },
  {
    id: "message",
    label: "문의 내용",
    type: "textarea",
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
    businessNumber: "123-45-67890",
    representative: "홍길동",
    email: "contact@fm-corp.com",
    fax: "02-111-2222",
    phone: "02-000-0000",
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
    description: "법인이 설립되며 플랫폼 전략을 수립했습니다.",
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

// 카테고리 타입
type CatalogCategory = "Atoms" | "Molecules" | "Organisms";

// 프리뷰 매퍼: 항목 이름 → JSX 프리뷰
function renderAtomPreview(name: string, theme: "light" | "dark") {
  switch (name) {
    case "Card":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card theme={theme}>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold">Outline</p>
              <p className="text-sm text-zinc-600">보더+화이트 배경</p>
            </div>
          </Card>
          <Card variant="elevated" theme={theme}>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold">Elevated</p>
              <p className="text-sm text-zinc-600">그림자 강조</p>
            </div>
          </Card>
          <Card variant="soft" theme={theme}>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold">Soft</p>
              <p className="text-sm text-zinc-600">은은한 배경</p>
            </div>
          </Card>
          <Card variant="ghost" theme={theme}>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold">Ghost</p>
              <p className="text-sm text-zinc-600">투명 배경, hover tint</p>
            </div>
          </Card>
        </div>
      );
    case "ImageCard":
      return (
        <ImageCard backgroundImageUrl="https://picsum.photos/1200/600" padding="md">
          <div className="text-white">
            <p className="text-sm font-semibold">ImageCard</p>
            <p className="text-sm text-white/85">배경 이미지 + 오버레이</p>
          </div>
        </ImageCard>
      );
    case "ColorCard":
      return (
        <div className="grid gap-4">
          <ColorCard tone="solid" color="blue">
            <p className="text-white">Solid(blue)</p>
          </ColorCard>
          <ColorCard tone="gradient" gradientFrom="from-blue-600" gradientTo="to-emerald-500">
            <p className="text-white">Gradient</p>
          </ColorCard>
          <ColorCard tone="tint" color="blue">
            <p className="text-blue-700">Tint(blue)</p>
          </ColorCard>
        </div>
      );
    case "GlassCard":
      return (
        <div className="relative overflow-hidden rounded-3xl border border-zinc-200">
          {/* 배경: 텍스트 + 이미지가 섞인 레이어(프리즘 효과 확인용) */}
          <div className="absolute inset-0">
            <div className="h-full w-full bg-gradient-to-br from-sky-100 to-indigo-200">
              <div className="mx-auto max-w-4xl p-6">
                <h3 className="text-xl font-semibold text-zinc-800">배경 컨텐츠</h3>
                <p className="mt-1 text-sm text-zinc-600">프리즘 하이라이트가 배경 텍스트/이미지 위에서 곡선 형태로 반사됩니다.</p>
                <div className="mt-4 grid grid-cols-6 gap-2 opacity-90">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {Array.from({ length: 12 }).map((_, i) => (
                    <img
                      key={i}
                      src={`https://picsum.photos/seed/${i + 1}/120/80`}
                      alt={`bg-${i + 1}`}
                      className="h-16 w-full rounded object-cover"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* 포그라운드: 글래스 카드들 */}
          <div className="relative z-10 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <GlassCard>
                <div className="text-zinc-900">
                  <p className="text-sm font-semibold">Glass md</p>
                  <p className="text-sm text-zinc-700">곡선형 프리즘 하이라이트</p>
                </div>
              </GlassCard>
              <GlassCard blur="lg">
                <div className="text-zinc-900">
                  <p className="text-sm font-semibold">Glass lg</p>
                  <p className="text-sm text-zinc-700">블러 강하게</p>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      );
    case "Button":
      return (
        <div className="grid gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button theme={theme}>Primary</Button>
            <Button variant="outline" color="primary" theme={theme}>Outline</Button>
            <Button variant="ghost" theme={theme}>Ghost</Button>
            <Button loading theme={theme}>Loading</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm" theme={theme}>Small</Button>
            <Button size="md" theme={theme}>Medium</Button>
            <Button size="lg" theme={theme}>Large</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button leadingIcon={<span>⬅️</span>} theme={theme}>Leading</Button>
            <Button trailingIcon={<span>➡️</span>} variant="outline" color="primary" theme={theme}>Trailing</Button>
            <Button fullWidth theme={theme} className="max-w-xs">Full width</Button>
          </div>
        </div>
      );
    case "IconButton":
      return (
        <div className="flex flex-wrap items-center gap-3">
          <IconButton aria-label="즐겨찾기" variant="ghost" theme={theme}>★</IconButton>
          <IconButton aria-label="도움말" variant="ghost" theme={theme}>?</IconButton>
          <IconButton aria-label="확정" color="primary" theme={theme}>✓</IconButton>
          <IconButton aria-label="작게" size="sm" theme={theme}>i</IconButton>
          <IconButton aria-label="크게" size="lg" theme={theme}>i</IconButton>
        </div>
      );
    case "Badge":
      return (
        <div className="flex flex-wrap items-center gap-2">
          <Badge color="info" theme={theme}>정보</Badge>
          <Badge color="success" theme={theme}>성공</Badge>
          <Badge color="warning" theme={theme}>경고</Badge>
          <Badge color="default" theme={theme}>기본</Badge>
        </div>
      );
    case "Input":
      return (
        <div className="grid gap-3">
          <Input label="기본" placeholder="값을 입력" theme={theme} />
          <Input label="성공" placeholder="성공 상태" theme={theme} state="success" />
          <Input label="오류" state="error" helperText="필수 입력입니다" theme={theme} />
          <Input label="Prefix/Suffix" prefix="₩" suffix="원" placeholder="금액" theme={theme} />
          <Input label="비활성" placeholder="입력 불가" disabled theme={theme} />
        </div>
      );
    case "Checkbox":
      return (
        <div className="flex flex-col gap-2">
          <Checkbox label="동의" defaultChecked theme={theme} />
          <Checkbox label="부분 선택" indeterminate theme={theme} />
          <Checkbox label="비활성" disabled theme={theme} />
        </div>
      );
    case "Spinner":
      return (
        <div className="flex items-center gap-4">
          <Spinner size="xs" />
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </div>
      );
    case "Select":
      return (
        <Select
          label="카테고리"
          placeholder="선택하세요"
          options={[
            { label: "공지", value: "notice" },
            { label: "IR", value: "ir" },
          ]}
        />
      );
    case "TextArea":
      return (
        <div className="grid gap-3">
          <TextArea label="설명" placeholder="내용을 입력" theme={theme} />
          <TextArea label="오류" state="error" errorMessage="필수 입력" theme={theme} />
        </div>
      );
    case "Radio":
      return (
        <div className="flex items-center gap-4">
          <Radio label="공지" name="r1" defaultChecked />
          <Radio label="IR" name="r1" />
        </div>
      );
    case "Divider":
      return (
        <div className="w-full">
          <p className="text-sm">상단 콘텐츠</p>
          <Divider label="구분" />
          <p className="text-sm">하단 콘텐츠</p>
        </div>
      );
    case "Skeleton":
      return (
        <div className="flex items-center gap-3">
          <Skeleton variant="text" className="w-24" />
          <Skeleton variant="rect" className="h-10 w-24" />
          <Skeleton variant="circle" className="h-10 w-10" />
        </div>
      );
    case "Tag":
      return (
        <div className="flex flex-wrap items-center gap-2">
          <Tag>Default</Tag>
          <Tag variant="selected">Selected</Tag>
          <Tag variant="outline">Outline</Tag>
        </div>
      );
    case "Toggle":
      return (
        <div className="flex items-center gap-4">
          <Toggle checked label="On" />
          <Toggle checked={false} label="Off" />
        </div>
      );
    case "Tooltip":
      return (
        <Tooltip content="툴팁 내용">
          <IconButton aria-label="툴팁">?</IconButton>
        </Tooltip>
      );
    case "TextLink":
      return (
        <div className="flex items-center gap-4">
          <TextLink href="#" theme={theme}>내부 링크</TextLink>
          <TextLink href="https://example.com" target="_blank" theme={theme}>외부 링크</TextLink>
        </div>
      );
    default:
      return <p className="text-sm text-zinc-500">프리뷰 준비 중</p>;
  }
}

function renderMoleculePreview(name: string, theme: "light" | "dark") {
  switch (name) {
    case "HeroBanner":
      return (
        <div className="grid gap-4">
          <HeroBanner
            title="Gradient 배경"
            subtitle="기업 비전과 핵심 사업을 빠르게 확인하고 문의까지 연결하세요."
            primaryAction={{ label: "서비스 살펴보기", href: "#" }}
            secondaryAction={{ label: "문의하기", href: "#" }}
            backgroundType="gradient"
          />
          <HeroBanner
            title="Solid 배경"
            subtitle="단색 배경으로 간결하게 강조합니다."
            primaryAction={{ label: "문의하기", href: "#" }}
            backgroundType="solid"
            alignment="center"
          />
          <HeroBanner
            title="이미지 배경"
            subtitle="이미지 위에 오버레이를 적용합니다."
            primaryAction={{ label: "자세히 보기", href: "#" }}
            backgroundType="image"
            backgroundImageUrl="https://picsum.photos/1200/600"
          />
        </div>
      );
    case "FeatureCard":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <FeatureCard
            title="Default 변형"
            description="가벼운 카드 스타일"
            href="#"
            theme={theme}
          />
          <FeatureCard
            title="Emphasis 변형"
            description="강조 카드 스타일"
            variant="emphasis"
            href="#"
            theme={theme}
          />
        </div>
      );
    case "StatCard":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard label="전체 게시물" value="128" trend={{ direction: "up", value: "+8.4%" }} theme={theme} />
          <StatCard label="활성 사용자" value="32" unit="명" variant="compact" theme={theme} />
          <StatCard label="일간 방문자" value="1,284" trend={{ direction: "up", value: "+3.1%" }} graph={{ data: [12,14,9,11,16,18,15,20,22,19,24], color: "emerald" }} theme={theme} />
        </div>
      );
    case "FooterLinks":
      return (
        <FooterLinks
          title="회사"
          links={[{ label: "소개", href: "#" }, { label: "연혁", href: "#" }]}
        />
      );
    case "ContactForm":
      return <ContactForm fields={contactFormFields} theme={theme} />;
    case "NewsTicker":
      return (
        <div className="grid gap-4">
          <NewsTicker items={newsTickerItems} autoplay={false} theme={theme} />
          <NewsTicker items={newsTickerItems} autoplay theme={theme} />
        </div>
      );
    case "CtaSection":
      return (
        <CtaSection
          title="프로젝트 상담을 신청하세요"
          description="전문 컨설턴트가 2영업일 내에 연락드립니다."
          primaryAction={{ label: "상담 예약", href: "#" }}
          secondaryAction={{ label: "자료 요청", href: "#" }}
        />
      );
    case "TimelineItem":
      return (
        <div className="grid gap-3">
          <TimelineItem year="2023" title="창립" description="설립 및 전략 수립" theme={theme} />
          <TimelineItem year="2024" title="해외 진출" description="3개국 프로젝트 런칭" align="right" theme={theme} />
        </div>
      );
    case "TeamMemberCard":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <TeamMemberCard name="김현우" role="투자 전략 리드" bio="스마트 인프라와 ESG 투자 전략 담당" theme={theme} />
          <TeamMemberCard name="이지은" role="프로젝트 매니저" bio="지자체 프로젝트 실행 및 품질 총괄" theme={theme} />
        </div>
      );
    default:
      return <p className="text-sm text-zinc-500">프리뷰 준비 중</p>;
  }
}

function renderOrganismPreview(name: string, theme: "light" | "dark") {
  switch (name) {
    case "GlobalHeader":
      return (
        <GlobalHeader
          brandName="FM Corporation"
          navigation={sampleNavigation}
          cta={{ label: "문의하기", href: "/contact" }}
          theme={theme}
        />
      );
    case "GlobalFooter":
      return (
        <GlobalFooter
          {...sampleFooter}
          newsletter={{ description: "FM의 최신 소식과 인사이트를 받아보세요." }}
          theme={theme}
        />
      );
    case "NoticeList":
      return (
        <div className="grid gap-6">
          <NoticeList items={sampleNotices} variant="grid" theme={theme} />
          <NoticeList items={sampleNotices} variant="list" theme={theme} />
        </div>
      );
    case "PostDetail":
      return (
        <div className="grid gap-6">
          <PostDetail
            title="썸네일 있는 게시물"
            category="IR"
            author="FM Corporation"
            publishedAt="2025-10-01T00:00:00.000Z"
            content="<p>4분기 주요 실적과 향후 계획을 공유드립니다.</p>"
            thumbnailUrl="https://picsum.photos/1200/600"
            theme={theme}
          />
          <PostDetail
            title="텍스트 중심 게시물"
            category="공지"
            author="FM Corporation"
            publishedAt="2025-09-20T00:00:00.000Z"
            content="<p>텍스트만 포함된 공지입니다.</p>"
            theme={theme}
          />
        </div>
      );
    case "AboutOverview":
      return (
        <AboutOverview
          cards={[
            { title: "미션", description: "지속 가능한 도시를 위한 플랫폼" },
            { title: "비전", description: "데이터로 연결되는 공공 서비스" },
            { title: "핵심 역량", description: "도시 데이터, ESG, 인프라" },
          ]}
          theme={theme}
        />
      );
    case "VisionValues":
      return (
        <VisionValues
          items={[
            { key: "vision", title: "Vision", imageUrl: "https://picsum.photos/seed/dev-vision/640/360", imageAlt: "비전 이미지" },
            { key: "mission", title: "Mission", imageUrl: "https://picsum.photos/seed/dev-mission/640/360", imageAlt: "미션 이미지" },
            { key: "values", title: "Values", imageUrl: "https://picsum.photos/seed/dev-values/640/360", imageAlt: "핵심 가치 이미지" },
          ]}
          theme={theme}
        >
          <VisionValuesContent tabKey="vision">
            <p className="text-sm leading-relaxed text-zinc-600">사람과 도시를 연결</p>
          </VisionValuesContent>
          <VisionValuesContent tabKey="mission">
            <p className="text-sm leading-relaxed text-zinc-600">데이터 기반 의사결정</p>
          </VisionValuesContent>
          <VisionValuesContent tabKey="values">
            <p className="text-sm leading-relaxed text-zinc-600">신뢰, 투명, 혁신</p>
          </VisionValuesContent>
        </VisionValues>
      );
    case "ContactSection":
      return (
        <ContactSection
          address="서울특별시 강남구 테헤란로 123"
          email="contact@fm-corp.com"
          phone="02-123-4567"
          formFields={contactFormFields}
          theme={theme}
        />
      );
    case "AdminSidebar":
      return (
        <AdminSidebar
          items={[
            { label: "대시보드", href: "#", icon: "🏠", active: true },
            { label: "게시물", href: "#", icon: "📝" },
            { label: "사용자", href: "#", icon: "👥" },
          ]}
          theme={theme}
        />
      );
    case "CategoryFilterPanel":
      return (
        <CategoryFilterPanel
          categories={[
            { id: "notice", label: "공지", count: 12 },
            { id: "ir", label: "IR", count: 8 },
          ]}
          theme={theme}
        />
      );
    case "AdminDashboardOverview":
      return (
        <AdminDashboardOverview
          stats={dashboardStats}
          recentActivities={dashboardActivities}
          alerts={dashboardAlerts}
          theme={theme}
        />
      );
    case "BusinessExplorer":
      return (
        <BusinessExplorer
          items={[
            {
              key: "platform",
              title: "플랫폼 개발",
              summary: "UX 중심 설계 + 클라우드 네이티브",
              content: (
                <div>
                  <p>맞춤형 플랫폼 설계·구축 및 시스템 통합.</p>
                  <ul className="mt-2 list-disc pl-5">
                    <li>Web/App, SSO, API, 인증, CMS</li>
                    <li>클라우드 아키텍처, 데이터 관리</li>
                  </ul>
                </div>
              ),
            },
            {
              key: "investment",
              title: "투자 및 사업 육성",
              summary: "성과 창출형 투자 구조",
              content: (
                <div>
                  <p>기술 스타트업/프로젝트에 전략적 투자.</p>
                  <ul className="mt-2 list-disc pl-5">
                    <li>공동 개발, R&D 지원, IP 사업화</li>
                  </ul>
                </div>
              ),
            },
            {
              key: "public",
              title: "공공 및 사회혁신",
              summary: "기술로 사회적 가치 확산",
              content: (
                <div>
                  <p>공공데이터 플랫폼과 행정정보 통합.</p>
                  <ul className="mt-2 list-disc pl-5">
                    <li>디지털화/자동화/시각화 기반 혁신</li>
                  </ul>
                </div>
              ),
            },
          ]}
          theme={theme}
        />
      );
    default:
      return <p className="text-sm text-zinc-500">프리뷰 준비 중</p>;
  }
}

function ComponentSection({
  title,
  description,
  items,
  layout = "row",
  columns = 2,
  theme = "light",
}: {
  title: CatalogCategory;
  description: string;
  items: ComponentItem[];
  layout?: "row" | "column"; // row: 좌/우, column: 상/하
  columns?: 1 | 2; // 카드 그리드 열 수
  theme?: "light" | "dark";
}) {
  // Storybook의 kind 슬러그 규칙을 따름: 카테고리/컴포넌트명 →
  // `category`는 소문자, `컴포넌트명`은 영숫자만 남기고 모두 소문자 (CamelCase도 하이픈 없이 연결)
  // 예) Organisms/GlobalHeader → organisms-globalheader
  const toStoryKindSlug = (name: string) => name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

  const getStorybookDocsUrl = (section: CatalogCategory, compName: string) => {
    const group = section.toLowerCase();
    const id = `${group}-${toStoryKindSlug(compName)}`;
    // 스토리 변형이 아닌 컴포넌트 Docs 페이지로 연결
    return `http://localhost:6006/?path=/docs/${id}`;
  };
  const getPriorityBadgeClasses = (priority: ComponentItem["priority"]) => {
    switch (priority) {
      case "A":
        return "border-red-200 bg-red-50 text-red-700";
      case "B":
        return "border-amber-200 bg-amber-50 text-amber-700";
      case "C":
        return "border-zinc-200 bg-zinc-100 text-zinc-700";
      default:
        return "border-zinc-200 bg-white text-zinc-600";
    }
  };
  const renderPreview = (name: string) => {
    if (title === "Atoms") return renderAtomPreview(name, theme);
    if (title === "Molecules") return renderMoleculePreview(name, theme);
    return renderOrganismPreview(name, theme);
  };

  const isDark = theme === "dark";
  const sectionTitleClass = isDark ? "text-zinc-100" : "text-zinc-900";
  const sectionDescClass = isDark ? "text-zinc-400" : "text-zinc-500";
  const cardClass = isDark
    ? "rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-200"
    : "rounded-xl border border-zinc-100 bg-zinc-50 text-zinc-700";
  const subTitleClass = isDark ? "text-zinc-200" : "text-zinc-800";
  const listTextClass = isDark ? "text-zinc-400" : "text-zinc-600";
  const dividerClass = isDark ? "border-zinc-700" : "border-zinc-200";

  return (
    <section className="flex flex-col gap-4">
      <header className="flex flex-col gap-2">
        <h2 className={cn("text-2xl font-semibold", sectionTitleClass)}>{title}</h2>
        <p className={cn("text-sm", sectionDescClass)}>{description}</p>
      </header>
      <div className={columns === 1 ? "grid gap-4" : "grid gap-4 md:grid-cols-2"}>
        {items.map((item) => (
          <article
            key={item.name}
            className={cn("flex flex-col gap-4 p-5", cardClass)}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className={cn("text-lg font-bold", isDark ? "text-zinc-100" : "text-zinc-900")}>{item.name}</h3>
              <div className="flex items-center gap-2">
                <Button asChild variant="outline" color="primary" size="sm">
                  <Link href={getStorybookDocsUrl(title, item.name)} target="_blank" rel="noreferrer">
                    Docs
                  </Link>
                </Button>
                <span
                  className={
                    "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase " +
                    getPriorityBadgeClasses(item.priority)
                  }
                >
                  Priority {item.priority}
                </span>
              </div>
            </div>
            <p className="text-sm leading-6">{item.description}</p>
            <div
              className={
                layout === "row"
                  ? "grid gap-6 lg:grid-cols-2"
                  : "flex flex-col gap-4"
              }
            >
              <div
                className={
                  title === "Atoms"
                    ? "grid gap-4 text-sm leading-6"
                    : "grid gap-4 text-sm leading-6 md:grid-cols-2"
                }
              >
                <div>
                  <p className={cn("font-semibold", subTitleClass)}>상호작용 가이드</p>
                  <ul className={cn("mt-1 list-disc space-y-1 pl-5", listTextClass)}>
                    {item.interactions.map((interaction) => (
                      <li key={interaction}>{interaction}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className={cn("font-semibold", subTitleClass)}>사용 시 참고</p>
                  <ul className={cn("mt-1 list-disc space-y-1 pl-5", listTextClass)}>
                    {item.guidelines.map((guide) => (
                      <li key={guide}>{guide}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div
                className={
                  layout === "row"
                    ? cn("border-t pt-4 lg:border-t-0 lg:border-l lg:pl-6", dividerClass, isDark ? "text-zinc-100" : undefined)
                    : cn("border-t pt-4", dividerClass, isDark ? "text-zinc-100" : undefined)
                }
              >
                {renderPreview(item.name)}
              </div>
            </div>
          </article>
        ))}
      </div>
      <p className={cn("text-xs", isDark ? "text-zinc-500" : "text-zinc-400") }>
        각 카드에는 컴포넌트 스토리, 테스트, 접근성 체크리스트가 연결될 예정입니다.
      </p>
    </section>
  );
}

export default function DevCatalogPage() {
  const [theme, setTheme] = React.useState<"light" | "dark">("light");
  const [isMobilePreview, setIsMobilePreview] = React.useState(false);
  const pageBg = theme === "dark" ? "bg-zinc-900" : "bg-zinc-100";
  const containerClass = isMobilePreview ? "mx-auto w-full max-w-[420px]" : "mx-auto w-full max-w-6xl";
  return (
    <div className={cn("min-h-screen py-16", pageBg)}>
      <main className={cn("flex flex-col gap-10 px-6", containerClass)}>
        <header className="flex flex-col gap-4">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            디자인 시스템 카탈로그
          </p>
          <h1 className={cn("text-4xl font-semibold", theme === "dark" ? "text-zinc-100" : "text-zinc-900")}>
            홈페이지 UI 컴포넌트
          </h1>
          <p className={cn("max-w-3xl text-base", theme === "dark" ? "text-zinc-400" : "text-zinc-600") }>
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
          layout="row"
          columns={1}
          theme={theme}
        />
        <ComponentSection
          title="Molecules"
          description="Atoms를 조합해 특정 목적을 수행하는 중간 규모의 패턴입니다."
          items={molecules}
          layout="column"
          columns={1}
          theme={theme}
        />
        <ComponentSection
          title="Organisms"
          description="페이지 섹션을 구성하는 대형 컴포넌트로, 완성된 사용자 경험을 제공합니다."
          items={organisms}
          layout="column"
          columns={1}
          theme={theme}
        />
        {/* 항목별 프리뷰는 각 섹션 카드 내 좌/우 또는 상/하로 렌더링됩니다. */}
        {/* 플로팅 프리뷰 컨트롤 */}
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
          <div className={cn("flex items-center gap-2 rounded-full border px-3 py-2 shadow-sm",
            theme === "dark" ? "bg-zinc-800/90 border-zinc-700 text-zinc-200" : "bg-white/90 border-zinc-200 text-zinc-700")}
          >
            <Tooltip content={isMobilePreview ? "데스크톱 미리보기" : "모바일 미리보기"} placement="left">
              <IconButton
                aria-label={isMobilePreview ? "데스크톱 미리보기" : "모바일 미리보기"}
                onClick={() => setIsMobilePreview((v) => !v)}
                theme={theme}
                variant="ghost"
              >
                {isMobilePreview ? "🖥️" : "📱"}
              </IconButton>
            </Tooltip>
            <Tooltip content={theme === "dark" ? "라이트 테마" : "다크 테마"} placement="left">
              <IconButton
                aria-label={theme === "dark" ? "라이트 테마" : "다크 테마"}
                onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
                theme={theme}
                variant="ghost"
              >
                {theme === "dark" ? "☀️" : "🌙"}
              </IconButton>
            </Tooltip>
          </div>
        </div>
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
