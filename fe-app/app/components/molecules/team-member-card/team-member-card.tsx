"use client";

import Link from "next/link";

export type TeamMemberCardProps = {
  name: string;
  role: string;
  bio?: string;
  avatarUrl?: string;
  socialLinks?: { label: string; href: string }[];
};

export function TeamMemberCard({
  name,
  role,
  bio,
  avatarUrl,
  socialLinks,
}: TeamMemberCardProps) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 text-zinc-700 shadow-sm hover:border-blue-200 hover:shadow-md">
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
          <span className="text-lg font-semibold text-zinc-900">{name}</span>
          <span className="text-sm text-blue-600">{role}</span>
        </div>
      </div>
      {bio && <p className="text-sm leading-6">{bio}</p>}
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
