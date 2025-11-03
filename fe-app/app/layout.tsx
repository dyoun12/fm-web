import type { Metadata } from "next";
// Google Fonts remote fetch is disabled in offline CI; use system fonts.
import "./globals.css";
import { StoreProvider } from "../store/provider";
import { GlobalFooter } from "./components/organisms/global-footer/global-footer";
import SiteHeader from "./site-header";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "FM Corp — 공식 홈페이지",
    template: "%s | FM Corp",
  },
  description: "FM Corp의 공식 홈페이지입니다. 회사 소개, 비전, 소식, 문의 정보를 확인하세요.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "FM Corp — 공식 홈페이지",
    description: "FM Corp의 공식 홈페이지입니다. 회사 소개, 비전, 소식, 문의 정보를 확인하세요.",
    url: "/",
    siteName: "FM Corp",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FM Corp — 공식 홈페이지",
    description: "FM Corp의 공식 홈페이지입니다. 회사 소개, 비전, 소식, 문의 정보를 확인하세요.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* Remix Icon CDN (icons guideline: docs/icons-remix.md) */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css"
        />
        {/* JSON-LD: Organization & WebSite */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "FM Corp",
              url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
              logo: "/favicon.ico",
            }),
          }}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "FM Corp",
              url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
              potentialAction: {
                "@type": "SearchAction",
                target: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className={`antialiased font-sans`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-blue-600 focus:px-3 focus:py-2 focus:text-white">본문으로 건너뛰기</a>
        <StoreProvider>
          <SiteHeader />
          <main id="main-content" role="main">
            {children}
          </main>
          <GlobalFooter
            companyInfo={{
              name: "FM Corp",
              address: "서울특별시 중구 세종대로 110",
              businessNumber: "000-00-00000",
              representative: "홍길동",
              email: "contact@fm-corp.example",
              phone: "02-000-0000",
            }}
            navigationSections={[
              {
                title: "회사",
                links: [
                  { label: "회사 소개", href: "/about" },
                  { label: "비전", href: "/vision" },
                  { label: "연락처", href: "/contact" },
                ],
              },
              {
                title: "자료",
                links: [
                  { label: "공지사항", href: "/notice" },
                  { label: "IR", href: "/ir" },
                ],
              },
              {
                title: "정책",
                links: [
                  { label: "개인정보 처리방침", href: "/privacy" },
                  { label: "이용약관", href: "/terms" },
                ],
              },
            ]}
            legalLinks={[{ label: "개인정보 처리방침", href: "/privacy" }, { label: "이용약관", href: "/terms" }]}
          />
        </StoreProvider>
      </body>
    </html>
  );
}
