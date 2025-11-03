import type { Metadata } from "next";
import { ContactSection } from "../components/organisms/contact-section/contact-section";

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
      <section className="mx-auto w-full max-w-6xl px-6 py-12" aria-labelledby="contact-heading">
        <h1 id="contact-heading" className="mb-6 text-3xl font-semibold">연락처</h1>
        <ContactSection
          address="서울특별시 중구 세종대로 110"
          email="contact@fm-corp.example"
          phone="02-000-0000"
          formFields={[
            { id: "name", label: "이름", type: "text", required: true },
            { id: "email", label: "이메일", type: "email", required: true },
            { id: "subject", label: "제목", type: "text" },
            { id: "message", label: "메시지", type: "textarea", required: true },
          ]}
        />
      </section>
    </div>
  );
}
