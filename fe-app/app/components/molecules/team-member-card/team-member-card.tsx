"use client";

import Link from "next/link";

export type TeamMemberCardProps = {
  name: string;
  role: string;
  bio?: string;
  avatarUrl?: string;
  socialLinks?: { label: string; href: string }[];
  theme?: "light" | "dark";
};

export function TeamMemberCard({
  name,
  role,
  bio,
  avatarUrl,
  socialLinks,
  theme = "light",
}: TeamMemberCardProps) {
  const isDark = theme === "dark";
  return (
    <article className={
      [
        "flex flex-col gap-4 rounded-2xl p-6 shadow-sm hover:border-blue-200 hover:shadow-md",
        isDark ? "border border-zinc-700 bg-zinc-900 text-zinc-300" : "border border-zinc-200 bg-white text-zinc-700",
      ].join(" ")
    }>
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 overflow-hidden rounded-full bg-blue-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatarUrl ?? "https://via.placeholder.com/96"}
            alt={`${name} 프로필`}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className={isDark ? "text-lg font-semibold text-zinc-100" : "text-lg font-semibold text-zinc-900"}>{name}</span>
          <span className="text-sm text-blue-600">{role}</span>
        </div>
      </div>
      {bio && <p className={isDark ? "text-sm leading-6 text-zinc-400" : "text-sm leading-6"}>{bio}</p>}
      {socialLinks && socialLinks.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {socialLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-blue-600 transition hover:text-blue-500"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
