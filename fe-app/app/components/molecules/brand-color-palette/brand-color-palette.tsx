"use client";

import { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/classnames";

type Swatch = { name: string; hex: string; token?: string };

export type BrandColorPaletteProps = {
  title: string;
  description?: string;
  palette: Swatch[];
  theme?: "light" | "dark";
  className?: string;
} & Omit<ComponentPropsWithoutRef<"section">, "className">;

export function BrandColorPalette({
  title,
  description,
  palette,
  theme = "light",
  className,
  ...rest
}: BrandColorPaletteProps) {
  const isDark = theme === "dark";
  return (
    <section
      className={cn(
        "grid items-start gap-6 md:grid-cols-2",
        isDark ? "text-zinc-100" : "text-zinc-900",
        className,
      )}
      {...rest}
    >
      {/* Left: palette */}
      <div className="grid grid-cols-2 gap-3 md:order-1">
        {palette.map((s, i) => (
          <div key={`${s.name}-${i}`} className="flex items-center gap-3 rounded-2xl border border-zinc-200 p-3">
            <span
              aria-hidden="true"
              className="h-10 w-10 flex-shrink-0 rounded-xl shadow-sm ring-1 ring-black/5"
              style={{ backgroundColor: s.hex }}
            />
            <div className="min-w-0">
              <div className="text-sm font-medium">{s.name}</div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400">{s.hex}{s.token ? ` · ${s.token}` : ""}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Right: description */}
      <div className="md:order-2">
        <h3 className="text-2xl font-semibold">{title}</h3>
        {description && <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{description}</p>}
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-300">
          <li>WCAG AA 대비 준수(텍스트/배경 조합 검사)</li>
          <li>UI 토큰 우선 사용, 커스텀 색은 CSS 변수로 노출</li>
          <li>상호작용 상태(Hover/Active/Disabled) 색상 일관성 유지</li>
        </ul>
      </div>
    </section>
  );
}

