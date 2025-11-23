"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { listPosts, type Post } from "@/api/posts";
import { listCategories, type Category } from "@/api/categories";
import { DataTable, type DataTableColumn } from "@/app/components/molecules/data-table/data-table";
import { EmptyState } from "@/app/components/molecules/empty-state/empty-state";

export default function PostsPage() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams?.get("category") ?? undefined;

  const [items, setItems] = useState<Post[] | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await listPosts({
          category: categorySlug || undefined,
        });
        if (!alive) return;
        setItems(res.items);
        setError(null);
      } catch (e: unknown) {
        if (!alive) return;
        const message = e instanceof Error ? e.message : "게시물 목록을 불러오지 못했습니다.";
        setError(message);
        setItems([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, [categorySlug]);

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

  const categoryLabelMap = useMemo(() => {
    if (!categories) return null;
    return categories.reduce<Record<string, string>>((acc, cat) => {
      acc[cat.slug] = cat.name;
      return acc;
    }, {});
  }, [categories]);

  const columns: DataTableColumn[] = [
    { key: "createdAt", header: "등록일", width: "20%" },
    { key: "title", header: "제목" },
    { key: "category", header: "카테고리", width: "20%" },
  ];

  const rows: Array<Record<string, ReactNode>> = useMemo(() => {
    if (!items) return [];
    return items.map((post) => ({
      createdAt: new Date(post.createdAt).toLocaleDateString("ko-KR"),
      title: (
        <Link href={`/posts/${post.postId}`} className="text-blue-600 underline underline-offset-2">
          {post.title}
        </Link>
      ),
      category: categoryLabelMap?.[post.category] ?? post.category,
    }));
  }, [categoryLabelMap, items]);

  const heading = categorySlug ? "게시물 목록" : "전체 게시물";

  return (
    <section className="mx-auto w-full max-w-[800px] px-6 py-12">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">{heading}</h1>
        {categorySlug && (
          <p className="mt-2 text-sm text-zinc-500">
            선택된 카테고리: <span className="font-medium">{categoryLabelMap?.[categorySlug] ?? categorySlug}</span>
          </p>
        )}
      </div>

      {error && (
        <div role="alert" className="mb-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {!items || rows.length === 0 ? (
        <EmptyState
          title="게시물이 없습니다"
          description={categorySlug ? "해당 카테고리에 등록된 게시물이 없습니다." : "등록된 게시물이 없습니다."}
        />
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          caption="게시물 목록"
          total={items.length}
        />
      )}
    </section>
  );
}
