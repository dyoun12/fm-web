"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { FilterBar } from "../../components/molecules/filter-bar/filter-bar";
import { SearchInput } from "../../components/molecules/search-input/search-input";
import { DataTable } from "../../components/molecules/data-table/data-table";
import { EmptyState } from "../../components/molecules/empty-state/empty-state";
import { Input } from "../../components/atoms/input/input";
import { TextArea } from "../../components/atoms/text-area/text-area";
import { Button } from "../../components/atoms/button/button";
import { EntityFormModal } from "../../components/molecules/entity-form-modal/entity-form-modal";
import { EntityDeleteModal } from "../../components/molecules/entity-delete-modal/entity-delete-modal";
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
  type Category,
} from "@/api/categories";
import { listPosts, type Post } from "@/api/posts";
import { slugify } from "@/lib/slug";

type ModalMode = "create" | "edit" | null;

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<Category[] | null>(null);
  const [q, setQ] = useState("");
  const [error, setError] = useState<string | null>(null);

  // form state
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState("0");
  const [slugEdited, setSlugEdited] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [checkingRelations, setCheckingRelations] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState<Post[] | null>(null);
  const [deleteModalError, setDeleteModalError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await listCategories();
        if (!alive) return;
        setItems(res.items);
      } catch (err: unknown) {
        if (!alive) return;
        const message = err instanceof Error ? err.message : "카테고리 불러오기 실패";
        setError(message);
        setItems([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (modalMode === "create" && !slugEdited) {
      setSlug(slugify(name));
    }
  }, [modalMode, name, slugEdited]);

  const resetForm = useCallback(() => {
    setName("");
    setSlug("");
    setDescription("");
    setOrder("0");
    setSlugEdited(false);
    setFormError(null);
  }, []);

  const closeModal = useCallback(() => {
    setModalMode(null);
    setEditingCategory(null);
    setFormError(null);
    setSaving(false);
    setDeleting(false);
    setDeleteModalOpen(false);
    setRelatedPosts(null);
    setDeleteModalError(null);
    setCheckingRelations(false);
  }, []);

  const handleOpenCreate = useCallback(() => {
    resetForm();
    setEditingCategory(null);
    setModalMode("create");
  }, [resetForm]);

  const handleOpenEdit = useCallback((category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setSlug(category.slug);
    setDescription(category.description ?? "");
    setOrder(String(category.order ?? 0));
    setSlugEdited(true);
    setFormError(null);
    setModalMode("edit");
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSaving(true);
      setFormError(null);
      const payload: {
        name: string;
        slug?: string;
        description?: string;
        order?: number;
      } = {
        name,
        description: description || undefined,
        order: Number.isNaN(Number(order)) ? 0 : Number(order),
      };
      
      try {
        if (modalMode === "edit" && editingCategory) {
          const updated = await updateCategory(editingCategory.categoryId, payload);
          setItems((prev) => prev?.map((c) => (c.categoryId === updated.categoryId ? updated : c)) ?? [updated]);
        } else {
          const created = await createCategory({
            ...payload,
            slug: payload.slug ?? slugify(name)
          });
          setItems((prev) => {
            const next = [...(prev ?? []), created];
            return next.sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name));
          });
        }
        resetForm();
        closeModal();
      } catch (err: unknown) {
        setFormError(err instanceof Error ? err.message : "저장 실패");
      } finally {
        setSaving(false);
      }
    },
    [closeModal, description, editingCategory, modalMode, name, order, resetForm, slug]
  );

  const handleRequestDelete = useCallback(async () => {
    if (!editingCategory) return;
    setDeleteModalOpen(true);
    setDeleteModalError(null);
    setRelatedPosts(null);
    setCheckingRelations(true);
    try {
      const res = await listPosts({ category: editingCategory.slug });
      setRelatedPosts(res.items);
    } catch (err: unknown) {
      setDeleteModalError(err instanceof Error ? err.message : "연결된 게시물을 불러오지 못했습니다.");
      setRelatedPosts([]);
    } finally {
      setCheckingRelations(false);
    }
  }, [editingCategory]);

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setRelatedPosts(null);
    setDeleteModalError(null);
    setCheckingRelations(false);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!editingCategory) return;
    try {
      setDeleting(true);
      await deleteCategory(editingCategory.categoryId);
      setItems((prev) => prev?.filter((cat) => cat.categoryId !== editingCategory.categoryId) ?? null);
      handleCloseDeleteModal();
      closeModal();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "삭제 실패");
      setDeleteModalError(err instanceof Error ? err.message : "삭제 실패");
    } finally {
      setDeleting(false);
    }
  }, [closeModal, editingCategory, handleCloseDeleteModal]);

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
      actions: (
        <button className="text-sm text-blue-600 underline" onClick={() => handleOpenEdit(cat)}>
          편집
        </button>
      ),
    }));
  }, [filtered, handleOpenEdit]);

  return (
    <>
      <div className="grid gap-4">
        <FilterBar className="flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput
            className="w-full sm:max-w-xs"
            placeholder="카테고리 검색"
            value={q}
            onChange={(e) => setQ((e.target as HTMLInputElement).value)}
          />
          <Button type="button" onClick={handleOpenCreate}>
            새 카테고리
          </Button>
        </FilterBar>

        {error && (
          <div role="alert" className="text-sm text-red-600">
            {error}
          </div>
        )}

        {!items || rows.length === 0 ? (
          <EmptyState title="카테고리가 없습니다" description="‘새 카테고리’ 버튼으로 추가하세요." />
        ) : (
          <DataTable
            columns={[
              { key: "name", header: "이름" },
              { key: "slug", header: "슬러그" },
              { key: "order", header: "정렬" },
              { key: "actions", header: "" },
            ]}
            rows={rows}
            caption="카테고리 목록"
          />
        )}
      </div>

      <EntityFormModal
        open={modalMode !== null}
        mode={modalMode ?? "create"}
        title={modalMode === "edit" ? "카테고리 편집" : "새 카테고리"}
        description={modalMode === "edit" ? "필요한 속성을 수정하고 저장하세요." : "게시물 분류용 카테고리를 생성합니다."}
        onClose={closeModal}
        onSubmit={handleSubmit}
        saving={saving}
        readOnlyFields={
          modalMode === "edit" && editingCategory
            ? [
                { label: "ID", value: editingCategory.categoryId },
                { label: "생성일", value: editingCategory.createdAt ?? "-" },
                { label: "수정일", value: editingCategory.updatedAt ?? "-" },
              ]
            : undefined
        }
        onDelete={modalMode === "edit" ? handleRequestDelete : undefined}
        deleting={deleting}
        submitLabel={modalMode === "edit" ? "변경 사항 저장" : "카테고리 생성"}
      >
        {formError && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {formError}
          </div>
        )}
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
          disabled={modalMode === "edit"}
          readOnly={modalMode === "edit"}
          helperText="URL에 사용되는 식별자이며 소문자/하이픈 형태를 권장합니다."
        />
        <Input
          label="정렬 순서"
          type="number"
          value={order}
          onChange={(e) => setOrder((e.target as HTMLInputElement).value)}
          helperText="숫자가 작을수록 앞에 배치됩니다."
        />
        <TextArea
          label="설명"
          rows={4}
          value={description}
          onChange={(e) => setDescription((e.target as HTMLTextAreaElement).value)}
          placeholder="카테고리 설명"
        />
      </EntityFormModal>

      <EntityDeleteModal
        open={deleteModalOpen}
        parentEntityDisplayName={editingCategory?.name ?? ""}
        parentEntityName="카테고리"
        parentEntityKeyLabel="슬러그"
        parentEntityKeyValue={editingCategory?.slug ?? ""}
        childEntityName="게시물"
        childEntityKey="title"
        relatedEntities={relatedPosts ?? []}
        checking={checkingRelations}
        errorMessage={deleteModalError ?? undefined}
        onClose={handleCloseDeleteModal}
        onConfirm={relatedPosts && relatedPosts.length === 0 && !deleteModalError ? handleDelete : undefined}
        loading={deleting}
      />
    </>
  );
}
