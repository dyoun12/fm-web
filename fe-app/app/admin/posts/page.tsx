"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { FilterBar } from "../../components/molecules/filter-bar/filter-bar";
import { Select } from "../../components/atoms/select/select";
import { SearchInput } from "../../components/molecules/search-input/search-input";
import { DataTable } from "../../components/molecules/data-table/data-table";
import { Pagination } from "../../components/molecules/pagination/pagination";
import { EmptyState } from "../../components/molecules/empty-state/empty-state";
import { useRouter } from "next/navigation";
import { Button } from "../../components/atoms/button/button";
import { listPosts, type Post } from "@/api/posts";
import { listCategories, type Category } from "@/api/categories";


export default function AdminPostsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Post[] | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [q, setQ] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // const triggerReload = useCallback(() => setReloadKey((prev) => prev + 1), []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await listPosts({
          category: categoryFilter !== "all" ? categoryFilter : undefined,
          q: q.trim() || undefined,
        });
        if (!alive) return;
        setItems(res.items);
        setError(null);
      } catch (e: unknown) {
        if (!alive) return;
        const message = e instanceof Error ? e.message : "불러오기에 실패했습니다";
        setError(message);
        setItems([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, [categoryFilter, q, reloadKey]);

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

  const columns = [
    { key: "title", header: "제목" },
    { key: "category", header: "카테고리" },
    { key: "author", header: "작성자" },
    { key: "actions", header: "" },
  ];

  const rows: Array<Record<string, ReactNode>> = useMemo(() => {
    if (!items) return [];
    return items.map((post) => ({
      title: (
        <button className="text-left underline underline-offset-2" onClick={() => router.push(`/admin/posts/edit/${post.postId}`)}>
          {post.title}
        </button>
      ),
      category: categoryLabelMap?.[post.category] ?? post.category,
      author: post.author ?? "-",
      actions: (
        <button className="text-sm text-blue-600 underline" onClick={() => router.push(`/admin/posts/edit/${post.postId}`)}>
          편집
        </button>
      ),
    }));
  }, [categoryLabelMap, items]);

  const categoryFilterOptions = useMemo(() => {
    const dynamic = categories ? categories.map((c) => ({ label: c.name, value: c.slug })) : [];
    return [{ label: "전체", value: "all" }, ...(dynamic.length ? dynamic : [
      { label: "IR", value: "ir" },
      { label: "공지", value: "notice" },
    ])];
  }, [categories]);

  const handleOpenCreate = () => {
    router.push(`/admin/posts/edit/new-post`)
  }

  return (
    <>
      <div className="grid gap-4">
        <FilterBar className="flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="grid w-full gap-3 sm:grid-cols-[200px_1fr]">
            <Select
              size="sm"
              options={categoryFilterOptions}
              aria-label="카테고리 필터"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter((e.target as HTMLSelectElement).value)}
            />
            <SearchInput
              placeholder="제목/본문 검색"
              value={q}
              onChange={(e) => setQ((e.target as HTMLInputElement).value)}
            />
          </div>
          <Button type="button" onClick={handleOpenCreate}>
            새 게시물
          </Button>
        </FilterBar>
        <div className="grid gap-3">
          {error && (
            <div role="alert" className="text-sm text-red-600">
              {error}
            </div>
          )}
          {!items || rows.length === 0 ? (
            <EmptyState
              title="게시물이 없습니다"
              description="‘새 게시물’ 버튼으로 추가하세요."
              actionLabel="새 게시물"
              onAction={handleOpenCreate}
            />
          ) : (
            <DataTable columns={columns} rows={rows} caption="게시물 목록" />
          )}
          <div className="flex justify-end">
            <Pagination page={1} pageSize={10} total={items?.length ?? 0} />
          </div>
        </div>
      </div>
    </>
  );
}
