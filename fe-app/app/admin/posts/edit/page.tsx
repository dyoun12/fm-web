"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "../../../components/atoms/input/input";
import { Select } from "../../../components/atoms/select/select";
import { TextArea } from "../../../components/atoms/text-area/text-area";
import { Button } from "../../../components/atoms/button/button";
import Link from "next/link";
import { Card } from "../../../components/atoms/card/card";
import { useEffect, useState } from "react";
import { createPost, getPost, updatePost } from "@/api/posts";
import { listCategories, type Category } from "@/api/categories";

export default function AdminPostEditPage() {
  const router = useRouter();
  const params = useSearchParams();
  const postId = params.get("id");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);

  useEffect(() => {
    let alive = true;
    if (!postId) return;
    (async () => {
      try {
        const p = await getPost(postId);
        if (!alive) return;
        setTitle(p.title);
        setCategory(p.category);
        setContent(p.content);
      } catch (e: unknown) {
        if (!alive) return;
        const message = e instanceof Error ? e.message : "게시물 로딩 실패";
        setError(message);
      }
    })();
    return () => {
      alive = false;
    };
  }, [postId]);

  // 카테고리 로드
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await listCategories();
        if (!alive) return;
        setCategories(res.items);
      } catch {
        if (!alive) return;
        setCategories(null);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="grid gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {postId ? "게시물 편집" : "새 게시물"}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            제목, 카테고리, 본문을 입력해 게시물을 {postId ? "수정" : "생성"}합니다.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" color="neutral" asChild>
            <Link href="/admin/posts">취소</Link>
          </Button>
          <Button type="submit" form="post-form">저장</Button>
        </div>
      </header>

      <Card padding="lg">
        {error && (
          <div role="alert" className="mb-2 text-sm text-red-600">
            {error}
          </div>
        )}
        <form
          id="post-form"
          className="grid grid-cols-1 gap-6"
          onSubmit={async (e) => {
            e.preventDefault();
            setSaving(true);
            setError(null);
            try {
              if (postId) {
                await updatePost(postId, { title, category, content });
              } else {
                await createPost({ title, category, content });
              }
              router.push("/admin/posts");
            } catch (e: unknown) {
              const message = e instanceof Error ? e.message : "저장 실패";
              setError(message);
            } finally {
              setSaving(false);
            }
          }}
        >
          <Input label="제목" placeholder="제목을 입력하세요" required value={title} onChange={(e) => setTitle((e.target as HTMLInputElement).value)} />
          <Select
            aria-label="카테고리"
            placeholder="카테고리 선택"
            options={
              categories
                ? categories.map((c) => ({ label: c.name, value: c.slug }))
                : [
                    { label: "IR", value: "ir" },
                    { label: "공지", value: "notice" },
                  ]
            }
            value={category}
            onChange={(e) => setCategory((e.target as HTMLSelectElement).value)}
          />
          <TextArea label="본문" placeholder="내용을 입력하세요" rows={12} required value={content} onChange={(e) => setContent((e.target as HTMLTextAreaElement).value)} />

          <div className="mt-2 flex justify-end gap-2">
            <Button variant="ghost" color="neutral" asChild disabled={saving}>
              <Link href="/admin/posts">취소</Link>
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "저장 중..." : "저장하기"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
