## 작업: Card 컴포넌트 추가 (Atoms)

- [x] 스토리 작성: `fe-app/app/components/atoms/card/card.stories.tsx`
- [x] 테스트 작성: `fe-app/app/components/atoms/card/card.test.tsx`
- [x] 컴포넌트 구현: `fe-app/app/components/atoms/card/card.tsx`
- [x] Dev 카탈로그 등록 및 프리뷰 추가: `fe-app/app/dev/page.tsx`
- [x] 문서 갱신(디자인 가이드 변형 표): `docs/design-guide.md`
  - ImageCard/ColorCard 추가 명시 포함

### 변경 요약
- Card(variant: outline|elevated|ghost|soft, padding: none|sm|md|lg, theme: light|dark) 추가
- Dev 카탈로그 Atoms 섹션에 Card 항목 및 예시 렌더 추가
 - ImageCard(배경 이미지), ColorCard(단색/그라디언트/틴트) 아톰 추가 및 스토리/테스트 포함

### Card로 교체한 컨테이너
- Molecules: StatCard, TeamMemberCard, TimelineItem(본문), FeatureCard(default 변형)
- Organisms: AboutOverview(항목), ContactSection(정보 패널), CategoryFilterPanel, VisionValues, NoticeList(아이템)

### 추가 교체 적용
- HeroBanner: ImageCard/ColorCard로 외곽 래핑 (배경 타입별)
- ContactForm: 외곽 컨테이너를 Card로 래핑
- NewsTicker: ColorCard(tint, blue) 적용
- CtaSection: ColorCard(gradient) 적용
- GlobalFooter: NewsletterForm 내부 컨테이너 Card로 래핑
- PostDetail: 본문 섹션을 Card(soft)로 래핑

### 검증 메모
- `npm run test -- --run` 실행 시 로컬 샌드박스 제한으로 Vitest가 포트를 열지 못해 실패(Eperm). 로컬 환경에서는 정상 동작 예상.
- Lint/Build는 Dev 환경에서 추가 확인 필요.

Refs: docs/design-guide.md, fe-app/app/dev/page.tsx
