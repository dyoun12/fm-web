import type { Metadata } from "next";
import { ContactBackground } from "./contact-background";
import { ContactFormContainer } from "./contact-form-container";

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
      <section className="mx-auto max-w-[800px] max-w-6xl px-6 py-12" aria-labelledby="contact-heading">
        <h1 id="contact-heading" className="mb-3 text-3xl font-semibold text-white">연락처</h1>
        <p className="mb-8 max-w-2xl text-white/85">
          문의 내용을 작성해주시면 2영업일 내 담당자가 회신드립니다.
        </p>
        <ContactFormContainer />
      </section>
    </div>
  );
}
