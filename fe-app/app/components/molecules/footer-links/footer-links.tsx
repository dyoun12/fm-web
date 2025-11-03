"use client";

import Link from "next/link";
import { cn } from "@/lib/classnames";

export type FooterLinksProps = {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
  theme?: "light" | "dark" | "contact";
};

export function FooterLinks({ title, links, theme = "light" }: FooterLinksProps) {
  const isContact = theme === "contact";
  const isDark = theme === "dark" || isContact;
  return (
    <div className="flex flex-col gap-3">
      <h3 className={cn("text-sm font-semibold", isContact ? "text-white" : isDark ? "text-zinc-200" : "text-zinc-800")}>{title}</h3>
      <ul className={cn("flex flex-col gap-2 text-sm", isContact ? "text-white" : isDark ? "text-zinc-400" : "text-zinc-600") }>
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className={cn("transition", isContact ? "hover:text-white" : "hover:text-blue-600")}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
