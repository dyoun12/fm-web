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
};

export function PostDetail({
  title,
  category,
  author,
  publishedAt,
  updatedAt,
  content,
  thumbnailUrl,
}: PostDetailProps) {
  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <header className="flex flex-col gap-4">
        <Badge variant="info">{category}</Badge>
        <h1 className="text-3xl font-semibold text-zinc-900">{title}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
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
          "prose prose-zinc max-w-none leading-7",
          "[&_h2]:mt-10 [&_h2]:text-2xl [&_p]:text-zinc-700",
        )}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
}
