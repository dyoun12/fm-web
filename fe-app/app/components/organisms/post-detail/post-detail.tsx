"use client";

import { cn } from "@/lib/classnames";
import { Badge } from "../../atoms/badge/badge";
import { JSONContent } from "@tiptap/react";
import { generateHtml } from "@/lib/tiptap";

// --- Tiptap Node ---
import "@/app/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/app/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/app/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/app/components/tiptap-node/list-node/list-node.scss"
import "@/app/components/tiptap-node/image-node/image-node.scss"
import "@/app/components/tiptap-node/heading-node/heading-node.scss"
import "@/app/components/tiptap-node/paragraph-node/paragraph-node.scss"

export type PostDetailProps = {
  title: string;
  category: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  content: JSONContent;
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
    <article className="mx-auto flex w-full flex-col gap-8">
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
          "output-group",
          "tiptap",
          "simple-editor",
          "ProseMirror"
        )}
        dangerouslySetInnerHTML={{__html: generateHtml(content) }}
      />
    </article>
  );
}
