# CtaSection 테마 토큰 적용 작업

- [x] CtaSection에 테마/톤 토큰 props 추가 (`theme`, `tone`, `color`, `gradientFrom`, `gradientTo`, `rounded`, `padding`)
- [x] 하위 Button/ColorCard로 토큰 전파 및 대비 개선
- [x] Dev 카탈로그에서 `theme` 전달 추가
- [x] 스토리 변형(LightTint) 추가
- [x] 테스트: dark 테마에서 outline 버튼 `bg-white` 미적용 검증

## 변경 파일
- fe-app/app/components/molecules/cta-section/cta-section.tsx
- fe-app/app/components/molecules/cta-section/cta-section.stories.tsx
- fe-app/app/components/molecules/cta-section/cta-section.test.tsx
- fe-app/app/dev/page.tsx:948

## 메모
- Button의 `theme`를 상위에서 전달해 outline/ghost 변형이 어두운 배경에서 흰 배경을 사용하지 않도록 조정했습니다.
- ColorCard는 `textOnColor`를 내부에서 `theme`에 맞추어 설정하여 텍스트 대비를 유지합니다.
