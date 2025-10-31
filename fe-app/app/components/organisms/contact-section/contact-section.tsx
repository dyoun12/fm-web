"use client";

import { cn } from "@/lib/classnames";
import { Card } from "../../atoms/card/card";
import { ContactForm, ContactFormField } from "../../molecules/contact-form/contact-form";

export type ContactSectionProps = {
  address: string;
  email: string;
  phone?: string;
  formFields: ContactFormField[];
  theme?: "light" | "dark";
};

export function ContactSection({ address, email, phone, formFields, theme = "light" }: ContactSectionProps) {
  const isDark = theme === "dark";
  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <Card theme={theme}>
        <h3 className={cn("text-lg font-semibold", isDark ? "text-zinc-100" : "text-zinc-900")}>연락처</h3>
        <dl className={cn("mt-3 space-y-2 text-sm", isDark ? "text-zinc-400" : "text-zinc-600") }>
          <div className="flex gap-2"><dt className="font-medium">주소</dt><dd>{address}</dd></div>
          <div className="flex gap-2"><dt className="font-medium">이메일</dt><dd>{email}</dd></div>
          {phone && <div className="flex gap-2"><dt className="font-medium">전화</dt><dd>{phone}</dd></div>}
        </dl>
      </Card>
      <ContactForm fields={formFields} theme={theme} />
    </section>
  );
}
