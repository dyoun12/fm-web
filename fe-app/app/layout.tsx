import type { Metadata } from "next";
// Google Fonts remote fetch is disabled in offline CI; use system fonts.
import "./globals.css";
import { StoreProvider } from "../store/provider";
import SiteFooter from "./site-footer";
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
      <body className={`antialiased font-sans min-h-screen flex flex-col`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-blue-600 focus:px-3 focus:py-2 focus:text-white">본문으로 건너뛰기</a>
        <StoreProvider>
          <SiteHeader />
          <main id="main-content" role="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </StoreProvider>
      </body>
    </html>
  );
}
