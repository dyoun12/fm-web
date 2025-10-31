"use client";

import { cn } from "@/lib/classnames";
import { Badge } from "../../atoms/badge/badge";

export type PostDetailProps = {
  title: string;
  category: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  content: string;
  thumbnailUrl?: string;
  theme?: "light" | "dark";
};

export function PostDetail({
  title,
  category,
  author,
  publishedAt,
  updatedAt,
  content,
  thumbnailUrl,
  theme = "light",
}: PostDetailProps) {
  const isDark = theme === "dark";
  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <header className="flex flex-col gap-4">
        <Badge color="info" theme={theme} className="self-start">{category}</Badge>
        <h1 className={cn("text-3xl font-semibold", isDark ? "text-zinc-100" : "text-zinc-900")}>
          {title}
        </h1>
        <div className={cn("flex flex-wrap items-center gap-3 text-sm", isDark ? "text-zinc-400" : "text-zinc-500") }>
          <span>{author}</span>
          <span aria-hidden="true">•</span>
          <time dateTime={publishedAt}>
            {new Date(publishedAt).toLocaleDateString("ko-KR")}
          </time>
          {updatedAt && (
            <>
              <span aria-hidden="true">•</span>
              <span>
                수정{" "}
                {new Date(updatedAt).toLocaleDateString("ko-KR")}
              </span>
            </>
          )}
        </div>
      </header>
      {thumbnailUrl && (
        <div className="overflow-hidden rounded-3xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnailUrl}
            alt={`${title} 썸네일`}
            className="h-auto w-full object-cover"
          />
        </div>
      )}
      <section
        className={cn(
          "prose max-w-none leading-7",
          isDark ? "prose-invert" : "prose-zinc",
          "[&_h2]:mt-10 [&_h2]:text-2xl",
        )}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
}
