"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Input } from "../../atoms/input/input";
import { Button } from "../../atoms/button/button";
import { cn } from "@/lib/classnames";

export type FooterLinkGroup = {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
};

export type GlobalFooterProps = {
  companyInfo: {
    name: string;
    address: string;
    businessNumber?: string;
    email?: string;
    phone?: string;
  };
  navigationSections: FooterLinkGroup[];
  legalLinks?: { label: string; href: string }[];
  socialLinks?: { label: string; href: string }[];
  newsletter?: {
    description: string;
    onSubmit?: (email: string) => Promise<void> | void;
  };
  theme?: "light" | "dark";
};

export function GlobalFooter({
  companyInfo,
  navigationSections,
  legalLinks,
  socialLinks,
  newsletter,
  theme = "light",
}: GlobalFooterProps) {
  const isDark = theme === "dark";
  return (
    <footer className={cn(isDark ? "border-t border-zinc-800 bg-zinc-900" : "border-t border-zinc-200 bg-zinc-50") }>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 lg:flex-row lg:gap-16">
        <aside className="flex flex-1 flex-col gap-4">
          <h2 className={cn("text-xl font-semibold", isDark ? "text-zinc-100" : "text-zinc-900") }>
            {companyInfo.name}
          </h2>
          <p className={cn("text-sm", isDark ? "text-zinc-400" : "text-zinc-600")}>{companyInfo.address}</p>
          <dl className={cn("flex flex-col gap-1 text-xs", isDark ? "text-zinc-400" : "text-zinc-500") }>
            {companyInfo.businessNumber && (
              <div className="flex gap-2">
                <dt className="font-medium">사업자등록번호</dt>
                <dd>{companyInfo.businessNumber}</dd>
              </div>
            )}
            {companyInfo.email && (
              <div className="flex gap-2">
                <dt className="font-medium">이메일</dt>
                <dd>
                  <Link href={`mailto:${companyInfo.email}`}>
                    {companyInfo.email}
                  </Link>
                </dd>
              </div>
            )}
            {companyInfo.phone && (
              <div className="flex gap-2">
                <dt className="font-medium">대표번호</dt>
                <dd>
                  <Link href={`tel:${companyInfo.phone}`}>
                    {companyInfo.phone}
                  </Link>
                </dd>
              </div>
            )}
          </dl>
          {newsletter && (
            <NewsletterForm
              description={newsletter.description}
              onSubmit={newsletter.onSubmit}
              theme={theme}
            />
          )}
        </aside>

        <div className="grid flex-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {navigationSections.map((section) => (
            <div key={section.title} className="flex flex-col gap-3">
              <h3 className={cn("text-sm font-semibold", isDark ? "text-zinc-200" : "text-zinc-800") }>
                {section.title}
              </h3>
              <ul className={cn("flex flex-col gap-2 text-sm", isDark ? "text-zinc-400" : "text-zinc-600") }>
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="transition hover:text-blue-600"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className={cn(isDark ? "border-t border-zinc-800 bg-zinc-900" : "border-t border-zinc-200 bg-white") }>
        <div className={cn("mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-6 text-sm md:flex-row md:items-center md:justify-between", isDark ? "text-zinc-400" : "text-zinc-500") }>
          <span>© {new Date().getFullYear()} {companyInfo.name}. All rights reserved.</span>
          <div className="flex flex-wrap items-center gap-4">
            {legalLinks?.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-blue-600"
              >
                {item.label}
              </Link>
            ))}
            {socialLinks?.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-blue-600"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

type NewsletterFormProps = {
  description: string;
  onSubmit?: (email: string) => Promise<void> | void;
  theme?: "light" | "dark";
};

function NewsletterForm({ description, onSubmit, theme = "light" }: NewsletterFormProps) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const email = formData.get("newsletter-email");
    try {
      if (typeof email === "string" && onSubmit) {
        await onSubmit(email);
      }
      setStatus("success");
      event.currentTarget.reset();
    } catch (error) {
      console.error("뉴스레터 구독 실패:", error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="mt-4 flex w-full flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4"
      onSubmit={handleSubmit}
    >
      <p className="text-sm text-zinc-600">{description}</p>
      <div className="flex items-center gap-2">
        <Input
          label="뉴스레터 이메일"
          hideLabel
          type="email"
          name="newsletter-email"
          placeholder="이메일 주소"
          required
          className="flex-1"
          theme={theme}
        />
        <Button type="submit" loading={loading} disabled={loading} theme={theme}>
          {loading ? "처리 중..." : "구독"}
        </Button>
      </div>
      {status === "success" && (
        <p className="text-xs text-green-600">구독이 완료되었습니다.</p>
      )}
      {status === "error" && (
        <p className="text-xs text-red-500">
          구독 처리에 실패했습니다. 잠시 후 다시 시도해주세요.
        </p>
      )}
    </form>
  );
}
