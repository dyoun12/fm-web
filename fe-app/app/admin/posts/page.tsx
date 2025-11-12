"use client";

import { FilterBar } from "../../components/molecules/filter-bar/filter-bar";
import { Select } from "../../components/atoms/select/select";
import { SearchInput } from "../../components/molecules/search-input/search-input";
import { DataTable } from "../../components/molecules/data-table/data-table";
import { Pagination } from "../../components/molecules/pagination/pagination";
import { EmptyState } from "../../components/molecules/empty-state/empty-state";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { deletePost, listPosts, type Post } from "@/api/posts";
import { listCategories, type Category } from "@/api/categories";

export default function AdminPostsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Post[] | null>(null);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [q, setQ] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await listPosts({ category: category && category !== "all" ? category : undefined, q: q || undefined });
        if (!alive) return;
        setItems(res.items);
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
  }, [category, q]);

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
        // 실패 시 기본값 유지(하드코딩)
        setCategories(null);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const columns = [
    { key: "title", header: "제목" },
    { key: "category", header: "카테고리" },
    { key: "author", header: "작성자" },
    { key: "actions", header: "" },
  ];
  const rows: Array<Record<string, React.ReactNode>> = useMemo(() => {
    if (!items) return [];
    return items.map((p) => ({
      title: (
        <button className="underline" onClick={() => router.push(`/admin/posts/edit?id=${p.postId}`)}>
          {p.title}
        </button>
      ),
      category: p.category,
      author: p.author || "-",
      actions: (
        <div className="flex justify-end gap-2">
          <button className="text-sm text-blue-600 underline" onClick={() => router.push(`/admin/posts/edit?id=${p.postId}`)}>
            편집
          </button>
          <button
            className="text-sm text-red-600 underline"
            onClick={async () => {
              if (!confirm("삭제하시겠습니까?")) return;
              await deletePost(p.postId);
              setItems((prev) => (prev ? prev.filter((x) => x.postId !== p.postId) : prev));
            }}
          >
            삭제
          </button>
        </div>
      ),
    }));
  }, [items, router]);

  return (
    <div className="grid gap-4">
      <FilterBar>
        <Select
          size="sm"
          options={[
            { label: "전체", value: "all" },
            ...(
              categories
                ? categories.map((c) => ({ label: c.name, value: c.slug }))
                : [
                    { label: "IR", value: "ir" },
                    { label: "공지", value: "notice" },
                  ]
            ),
          ]}
          aria-label="카테고리"
          onChange={(e) => setCategory((e.target as HTMLSelectElement).value)}
        />
        <SearchInput placeholder="제목 검색" onChange={(e) => setQ((e.target as HTMLInputElement).value)} />
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
            description="아래 '새 게시물' 버튼으로 추가하세요"
            actionLabel="새 게시물"
            onAction={() => router.push("/admin/posts/edit")}
          />
        ) : (
          <DataTable columns={columns} rows={rows} caption="게시물 목록" />
        )}
        <div className="flex justify-end">
          <Pagination page={1} pageSize={10} total={items?.length ?? 0} />
        </div>
      </div>
    </div>
  );
}
