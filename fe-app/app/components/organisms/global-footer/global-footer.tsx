"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Input } from "../../atoms/input/input";
import { Button } from "../../atoms/button/button";
import { cn } from "@/lib/classnames";
import { Card } from "../../atoms/card/card";
import { FooterLinks as FooterLinksGroup } from "../../molecules/footer-links/footer-links";

export type FooterLinkGroup = {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
};

export type GlobalFooterProps = {
  companyInfo: {
    name: string;
    address: string;
    businessNumber?: string;
    representative?: string;
    email?: string;
    phone?: string;
    fax?: string;
  };
  navigationSections: FooterLinkGroup[];
  legalLinks?: { label: string; href: string }[];
  socialLinks?: { label: string; href: string }[];
  newsletter?: {
    description: string;
    onSubmit?: (email: string) => Promise<void> | void;
  };
  theme?: "light" | "dark" | "contact";
};

export function GlobalFooter({
  companyInfo,
  navigationSections,
  legalLinks,
  socialLinks,
  newsletter,
  theme = "light",
}: GlobalFooterProps) {
  const isContact = theme === "contact";
  const isDark = theme === "dark" || isContact;
  const linkHover = isContact ? "hover:text-white" : "hover:text-blue-600";
  return (
    <footer className={cn(isDark ? "border-t border-zinc-800 bg-zinc-900" : "border-t border-zinc-200 bg-zinc-50", isContact && "text-white") }>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
        {/* 1행: 좌측 회사 정보 / 우측 상단 FooterLinks */}
        <div className="grid w-full gap-10 lg:grid-cols-2">
          <aside className="flex flex-col gap-4">
            <h2 className={cn("text-xl font-semibold", isContact ? "text-white" : isDark ? "text-zinc-100" : "text-zinc-900") }>
              {companyInfo.name}
            </h2>
            <p className={cn("text-sm", isContact ? "text-white" : isDark ? "text-zinc-400" : "text-zinc-600")}>{companyInfo.address}</p>
            <dl className={cn("flex flex-col gap-1 text-xs", isContact ? "text-white" : isDark ? "text-zinc-400" : "text-zinc-500") }>
              {companyInfo.businessNumber && (
                <div className="flex gap-2">
                  <dt className="font-medium">사업자등록번호</dt>
                  <dd>{companyInfo.businessNumber}</dd>
                </div>
              )}
              {companyInfo.representative && (
                <div className="flex gap-2">
                  <dt className="font-medium">대표자</dt>
                  <dd>{companyInfo.representative}</dd>
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
              {companyInfo.fax && (
                <div className="flex gap-2">
                  <dt className="font-medium">팩스</dt>
                  <dd>{companyInfo.fax}</dd>
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
          </aside>

          {/* 우측: FooterLinks + 구독 패널을 같은 컬럼에 배치 */}
          <div className="place-self-start lg:justify-self-end w-full">
            <div className="grid w-full gap-6 grid-cols-3">
              {navigationSections.map((section) => (
                <FooterLinksGroup
                  key={section.title}
                  title={section.title}
                  links={section.links}
                  theme={isContact ? "contact" : theme}
                />
              ))}
            </div>
            {newsletter && (
              <div className="mt-8 w-full">
                <NewsletterForm
                  description={newsletter.description}
                  onSubmit={newsletter.onSubmit}
                  theme={theme}
                />
              </div>
            )}
          </div>
        </div>
        {/* 2행 섹션 제거: 구독 패널은 2열 내부에 배치됨 */}
      </div>

      <div className={cn(isDark ? "border-t border-zinc-800 bg-zinc-900" : "border-t border-zinc-200 bg-white") }>
        <div className={cn("mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-6 text-sm md:flex-row md:items-center md:justify-between", isContact ? "text-white" : isDark ? "text-zinc-400" : "text-zinc-500") }>
          <span>© {new Date().getFullYear()} {companyInfo.name}. All rights reserved.</span>
          <div className="flex flex-wrap items-center gap-4">
            {legalLinks?.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn("transition", linkHover)}
              >
                {item.label}
              </Link>
            ))}
            {socialLinks?.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn("transition", linkHover)}
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
  const isDark = theme === "dark";

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
    <Card className="mt-4 w-full" padding="sm" theme={theme}>
      <form className="w-full" onSubmit={handleSubmit}>
        <div className="w-full">
          {/* 설명 행 */}
          <p className={cn("text-sm", isDark ? "text-zinc-300" : "text-zinc-600")}>{description}</p>
          {/* 인풋/버튼 행 (너비 축소) */}
          <div className="mt-3 flex w-full items-center gap-3">
            <Input
              id="newsletter-email"
              label="뉴스레터 이메일"
              hideLabel
              type="email"
              name="newsletter-email"
              placeholder="이메일 주소"
              required
              className="h-9"
              wrapperClassName="gap-0 flex-1 min-w-0"
              theme={theme}
            />
            <Button type="submit" size="sm" loading={loading} disabled={loading} className="shrink-0" theme={theme}>
              {loading ? "처리 중..." : "구독"}
            </Button>
          </div>
        </div>
        {status === "success" && (
          <p className={cn("text-xs", isDark ? "text-emerald-300" : "text-emerald-600")}>구독이 완료되었습니다.</p>
        )}
        {status === "error" && (
          <p className={cn("text-xs", isDark ? "text-red-300" : "text-red-500") }>
            구독 처리에 실패했습니다. 잠시 후 다시 시도해주세요.
          </p>
        )}
      </form>
    </Card>
  );
}
