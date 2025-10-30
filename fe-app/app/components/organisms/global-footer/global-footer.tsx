"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

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
};

export function GlobalFooter({
  companyInfo,
  navigationSections,
  legalLinks,
  socialLinks,
  newsletter,
}: GlobalFooterProps) {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 lg:flex-row lg:gap-16">
        <aside className="flex flex-1 flex-col gap-4">
          <h2 className="text-xl font-semibold text-zinc-900">
            {companyInfo.name}
          </h2>
          <p className="text-sm text-zinc-600">{companyInfo.address}</p>
          <dl className="flex flex-col gap-1 text-xs text-zinc-500">
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
            />
          )}
        </aside>

        <div className="grid flex-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {navigationSections.map((section) => (
            <div key={section.title} className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-zinc-800">
                {section.title}
              </h3>
              <ul className="flex flex-col gap-2 text-sm text-zinc-600">
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

      <div className="border-t border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-6 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between">
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
};

function NewsletterForm({ description, onSubmit }: NewsletterFormProps) {
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
        <input
          className="flex-1 rounded-full border border-zinc-300 px-4 py-2 text-sm text-zinc-800 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
          type="email"
          name="newsletter-email"
          placeholder="이메일 주소"
          required
        />
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-full bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "처리 중..." : "구독"}
        </button>
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
