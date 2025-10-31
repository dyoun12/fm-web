"use client";

import Link from "next/link";
import { Button } from "../../atoms/button/button";

export type CtaSectionProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  primaryAction: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
};

export function CtaSection({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
}: CtaSectionProps) {
  return (
    <section className="rounded-3xl bg-gradient-to-r from-blue-600 to-emerald-500 px-8 py-12 text-white shadow-lg">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-2">
          {eyebrow && (
            <span className="text-xs font-semibold uppercase tracking-wide text-white/80">
              {eyebrow}
            </span>
          )}
          <h2 className="text-3xl font-semibold">{title}</h2>
          {description && (
            <p className="text-sm text-white/85">{description}</p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Primary: outline 스타일 + primary 팔레트 */}
          <Button asChild variant="outline" color="primary" className="text-blue-700">
            <Link href={primaryAction.href} className="text-current no-underline">
              {primaryAction.label}
            </Link>
          </Button>
          {secondaryAction && (
            <Button
              asChild
              variant="ghost"
              className="text-white border border-white/60 hover:bg-white/10"
            >
              <Link href={secondaryAction.href} className="text-current no-underline">
                {secondaryAction.label}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
