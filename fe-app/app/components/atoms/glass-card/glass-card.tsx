"use client";

import { cn } from "@/lib/classnames";
import { ComponentPropsWithoutRef } from "react";

type GlassBlur = "sm" | "md" | "lg";
type Padding = "none" | "sm" | "md" | "lg";

const BLUR: Record<GlassBlur, string> = {
  sm: "backdrop-blur-[6px]",
  md: "backdrop-blur-[10px]",
  lg: "backdrop-blur-[16px]",
};

const PADDING: Record<Padding, string> = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export type GlassCardProps = {
  blur?: GlassBlur; // 유리 블러 강도
  padding?: Padding; // 내부 여백
  /** 테마에 따른 기본 틴트. 라이트는 더 밝고, 다크는 더 투명하게 */
  theme?: "light" | "dark";
  /** 상단 하이라이트/반사광 렌더링 여부 */
  reflect?: boolean;
  /** 프리즘(대각선 스펙큘러) 효과 렌더링 여부 */
  prism?: boolean;
} & ComponentPropsWithoutRef<"div">;

export function GlassCard({
  blur = "md",
  padding = "md",
  reflect = true,
  prism = true,
  className,
  children,
  ...rest
}: GlassCardProps) {
  // 지정된 색(투명 백)·보더 값은 요구안의 rgba를 그대로 사용
  // 가장자리 대비를 더 낮춤(이전 대비 1/2 수준)
  const tint = "bg-[rgba(255,255,255,0.2)] border-[rgba(255,255,255,0.1)] border";
  return (
    <div
      className={cn(
        // 베이스 유리 효과
        "relative overflow-hidden rounded-2xl backdrop-saturate-150",
        // 바깥 그림자 + 인셋 보정 그림자들 (투명도 1/2로 추가 완화)
        "shadow-[0_8px_32px_rgba(0,0,0,0.1),_inset_0_1px_0_rgba(255,255,255,0.18),_inset_0_-1px_0_rgba(255,255,255,0.04),_inset_0_0_16px_8px_rgba(255,255,255,0.33)]",
        BLUR[blur],
        // 링 효과 제거: 대신 투명 그라디언트 라인으로 경계 표현
        tint,
        PADDING[padding],
        className,
      )}
      {...rest}
    >
      {/* 상단 1px 반사 하이라이트 — 더 낮은 투명도로 대비 완화 */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-0 right-0 top-0 h-px",
          "bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.18)_50%,rgba(255,255,255,0)_100%)]",
        )}
      />
      {/* 좌측 1px 반사 라인 — 시작/끝 투명도 하향 */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-0 top-0 h-full w-px",
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0)_60%,rgba(255,255,255,0.09)_100%)]",
        )}
      />
      {/* 반사광: 상단에서 아래로 옅어지는 하이라이트 */}
      {reflect && (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 rounded-2xl",
            // 상단 하이라이트 → 중앙 페이드아웃
            "bg-gradient-to-b from-white/50 via-white/10 to-transparent",
            // 블렌드로 배경과 자연스럽게 섞이게
            "mix-blend-soft-light",
          )}
        />
      )}
      {/* 프리즘: 대각선 스펙큘러 라이트 스트립 */}
      {prism && (
        <div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-screen">
          {/* 곡선형(2차함수 느낌) 프리즘 하이라이트: 중앙으로 갈수록 곡률(R) 증가 */}
          <div
            className={cn(
              "absolute left-1/2 top-[-20%] h-[160%] w-[160%] -translate-x-1/2 opacity-45",
              // 타원형 반사 밴드: 중앙 상단을 기준으로 퍼지며 가장자리는 투명
              "bg-[radial-gradient(60%_40%_at_50%_20%,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.10)_35%,rgba(255,255,255,0)_60%)]",
            )}
          />
        </div>
      )}
      {children}
    </div>
  );
}
