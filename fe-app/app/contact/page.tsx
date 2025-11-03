import type { Metadata } from "next";
import { ContactForm } from "../components/molecules/contact-form/contact-form";
import { ContactBackground } from "./contact-background";

export const metadata: Metadata = {
  title: "연락처",
  description: "FM Corp 문의처와 연락처, 문의 양식을 제공합니다.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "FM Corp — 연락처",
    description: "FM Corp 문의처와 연락처, 문의 양식을 제공합니다.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="w-full">
      <ContactBackground />
      <section className="mx-auto w-full max-w-6xl px-6 py-12" aria-labelledby="contact-heading">
        <h1 id="contact-heading" className="mb-3 text-3xl font-semibold text-white">문의하기</h1>
        <p className="mb-8 max-w-2xl text-white/85">
          문의 내용을 작성해주시면 2영업일 내 담당자가 회신드립니다.
        </p>
        <ContactForm
          fields={[
            // 1행: 회사명 (full)
            { id: "company", label: "회사명", type: "text", colSpan: 2 },
            // 2행: 직책, 이름 (half + half)
            { id: "title", label: "직책", type: "text", placeholder: "예: 팀장" },
            { id: "name", label: "이름", type: "text", required: true },
            // 3행: 이메일 (full)
            { id: "email", label: "이메일", type: "email", required: true, colSpan: 2 },
            // 4행: 유입경로 (full)
            {
              id: "referral",
              label: "유입경로",
              type: "select",
              placeholder: "유입경로 선택",
              options: [
                { label: "인터넷검색", value: "search" },
                { label: "지인추천", value: "friend" },
                { label: "기타", value: "other" },
              ],
              colSpan: 2,
            },
            // 5행: 제목 (full)
            { id: "subject", label: "제목", type: "text", colSpan: 2 },
            // 6행: 내용 (full, textarea)
            { id: "message", label: "내용", type: "textarea", required: true },
          ]}
          submitLabel="문의하기"
          showHeader={false}
        />
      </section>
    </div>
  );
}
