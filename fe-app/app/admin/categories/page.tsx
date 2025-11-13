"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { FilterBar } from "../../components/molecules/filter-bar/filter-bar";
import { SearchInput } from "../../components/molecules/search-input/search-input";
import { DataTable } from "../../components/molecules/data-table/data-table";
import { EmptyState } from "../../components/molecules/empty-state/empty-state";
import { Input } from "../../components/atoms/input/input";
import { TextArea } from "../../components/atoms/text-area/text-area";
import { Button } from "../../components/atoms/button/button";
import { createCategory, listCategories, type Category } from "@/api/categories";
import { slugify } from "@/lib/slug";

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<Category[] | null>(null);
  const [q, setQ] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState("0");
  const [slugEdited, setSlugEdited] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await listCategories();
        if (!alive) return;
        setItems(res.items);
      } catch (e: unknown) {
        if (!alive) return;
        const message = e instanceof Error ? e.message : "카테고리 불러오기 실패";
        setError(message);
        setItems([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!slugEdited) {
      setSlug(slugify(name));
    }
  }, [name, slugEdited]);

  const filtered = useMemo(() => {
    if (!items) return [];
    const term = q.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) => item.name.toLowerCase().includes(term) || item.slug.toLowerCase().includes(term));
  }, [items, q]);

  const rows: Array<Record<string, ReactNode>> = useMemo(() => {
    return filtered.map((cat) => ({
      name: cat.name,
      slug: cat.slug,
      order: cat.order ?? 0,
    }));
  }, [filtered]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setFormError(null);
    setSuccessMessage(null);
  }, []);

  const openModal = useCallback(() => {
    setFormError(null);
    setSuccessMessage(null);
    setModalOpen(true);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSaving(true);
      setFormError(null);
      setSuccessMessage(null);
      try {
        const payload = {
          name,
          slug: slug || slugify(name),
          description: description || undefined,
          order: Number.isNaN(Number(order)) ? 0 : Number(order),
        };
        const created = await createCategory(payload);
        setItems((prev) => {
          const next = [...(prev ?? []), created];
          return next.sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name));
        });
        setName("");
        setSlug("");
        setDescription("");
        setOrder("0");
        setSlugEdited(false);
        setSuccessMessage("카테고리를 생성했습니다.");
        closeModal();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "저장 실패";
        setFormError(message);
      } finally {
        setSaving(false);
      }
    },
    [closeModal, description, name, order, setItems, slug]
  );

  return (
    <>
      <div className="grid gap-4">
        <FilterBar className="justify-between">
          <SearchInput
            className="flex-1 sm:max-w-xs"
            placeholder="카테고리 검색"
            value={q}
            onChange={(e) => setQ((e.target as HTMLInputElement).value)}
          />
          <Button type="button" size="md" onClick={openModal}>
            New
          </Button>
        </FilterBar>
        {error && (
          <div role="alert" className="text-sm text-red-600">
            {error}
          </div>
        )}
        {!items || rows.length === 0 ? (
          <EmptyState title="카테고리가 없습니다" description="‘새 카테고리’ 버튼으로 추가하세요" />
        ) : (
          <DataTable
            columns={[
              { key: "name", header: "이름" },
              { key: "slug", header: "슬러그" },
              { key: "order", header: "정렬" },
            ]}
            rows={rows}
            caption="카테고리 목록"
          />
        )}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">새 카테고리</h2>
                <p className="mt-1 text-sm text-zinc-500">게시물 분류용 카테고리를 생성합니다.</p>
              </div>
              <button className="text-sm text-zinc-500 hover:text-zinc-800" onClick={closeModal}>
                닫기
              </button>
            </div>
            {formError && (
              <div role="alert" className="mt-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {formError}
              </div>
            )}
            {successMessage && (
              <div className="mt-3 rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                {successMessage}
              </div>
            )}
            <form className="mt-4 grid gap-4" onSubmit={handleSubmit}>
              <Input label="이름" placeholder="예: IR" required value={name} onChange={(e) => setName((e.target as HTMLInputElement).value)} />
              <Input
                label="슬러그"
                placeholder="예: ir"
                required
                value={slug}
                onChange={(e) => {
                  setSlug((e.target as HTMLInputElement).value);
                  setSlugEdited(true);
                }}
                helperText="URL에 사용되는 식별자이며 소문자/하이픈 형태를 권장합니다."
              />
              <Input
                label="정렬 순서"
                type="number"
                value={order}
                onChange={(e) => setOrder((e.target as HTMLInputElement).value)}
                helperText="숫자가 작을수록 앞에 배치됩니다."
              />
              <TextArea label="설명" rows={4} value={description} onChange={(e) => setDescription((e.target as HTMLTextAreaElement).value)} placeholder="카테고리 설명" />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" color="neutral" onClick={closeModal}>
                  취소
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "생성 중..." : "카테고리 생성"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
