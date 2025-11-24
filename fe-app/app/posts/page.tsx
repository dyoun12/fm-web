import Link from "next/link";
import { listPosts, type Post } from "@/api/posts";
import { listCategories, type Category } from "@/api/categories";
import { DataTable, type DataTableColumn } from "@/app/components/molecules/data-table/data-table";
import { EmptyState } from "@/app/components/molecules/empty-state/empty-state";
import type { ReactNode } from "react";

type PostsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const rawCategory = resolvedSearchParams.category;
  const categorySlug = Array.isArray(rawCategory) ? rawCategory[0] : rawCategory;

  let items: Post[] = [];
  let categories: Category[] | null = null;
  let error: string | null = null;

  try {
    const res = await listPosts({
      category: categorySlug || undefined,
    });
    items = res.items;
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "게시물 목록을 불러오지 못했습니다.";
    error = message;
    items = [];
  }

  try {
    const res = await listCategories();
    categories = res.items;
  } catch {
    categories = null;
  }

  const categoryLabelMap =
    categories?.reduce<Record<string, string>>((acc, cat) => {
      acc[cat.slug] = cat.name;
      return acc;
    }, {}) ?? null;

  const columns: DataTableColumn[] = [
    { key: "createdAt", header: "등록일", width: "20%" },
    { key: "title", header: "제목" },
    { key: "category", header: "카테고리", width: "20%" },
  ];

  const rows: Array<Record<string, ReactNode>> = items.map((post) => ({
    createdAt: new Date(post.createdAt).toLocaleDateString("ko-KR"),
    title: (
      <Link href={`/posts/${post.postId}`} className="text-blue-600 underline underline-offset-2">
        {post.title}
      </Link>
    ),
    category: categoryLabelMap?.[post.category] ?? post.category,
  }));

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

      {rows.length === 0 ? (
        <EmptyState
          title="게시물이 없습니다"
          description={categorySlug ? "해당 카테고리에 등록된 게시물이 없습니다." : "등록된 게시물이 없습니다."}
        />
      ) : (
        <DataTable columns={columns} rows={rows} caption="게시물 목록" total={items.length} />
      )}
    </section>
  );
}
