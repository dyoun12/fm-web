"use client";

import Link from "next/link";
import { cn } from "@/lib/classnames";
import { ComponentPropsWithoutRef, CSSProperties } from "react";

export type TextLinkProps = {
  theme?: "light" | "dark";
  underline?: boolean;
  showIcon?: boolean;
} & ComponentPropsWithoutRef<"a">;

export function TextLink({
  href = "#",
  children,
  className,
  theme,
  underline = false,
  showIcon = true,
  target,
  rel,
  style: inlineStyle,
  ...rest
}: TextLinkProps) {
  // 아이콘은 내부/외부 링크 모두에 표시한다.
  // theme prop이 지정되면 컴포넌트 스코프에서 링크 색 토큰을 오버라이드한다.
  const themeStyle: CSSProperties | undefined = theme
    ? (theme === "dark"
        ? ({
            ["--link-color"]: "#93C5FD",
            ["--link-color-hover"]: "#BFDBFE",
          } as CSSProperties)
        : ({
            ["--link-color"]: "#9CA3AF", // neutral-400
            ["--link-color-hover"]: "var(--color-neutral-900)",
          } as CSSProperties))
    : undefined;
  const computedRel = target === "_blank" && !rel ? "noopener noreferrer" : rel;
  return (
    <Link
      href={href}
      target={target}
      rel={computedRel}
      style={{ ...(themeStyle || {}), ...(inlineStyle || {}) }}
      className={cn(
        // 베이스 타이포 + 포커스 링
        "inline-flex items-center gap-1.5 font-medium underline-offset-4 decoration-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition-colors",
        // 언더라인 제거(hover 포함). 필요 시 underline=true로 강제 표시
        underline ? "underline" : "no-underline hover:no-underline",
        // visited 상태: 색상 변화 금지 + 언더라인 제거
        "visited:no-underline",
        // 링크 컬러 토큰 적용(라이트/다크 자동 대응)
        "text-[var(--link-color)] hover:text-[var(--link-color-hover)] visited:text-[var(--link-color)]",
        className,
      )}
      {...rest}
    >
      {showIcon && (
        <i className="ri-external-link-line text-[0.95em] text-current" aria-hidden="true" />
      )}
      {children}
    </Link>
  );
}
