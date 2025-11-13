"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { FilterBar } from "../../components/molecules/filter-bar/filter-bar";
import { Select } from "../../components/atoms/select/select";
import { SearchInput } from "../../components/molecules/search-input/search-input";
import { DataTable } from "../../components/molecules/data-table/data-table";
import { Pagination } from "../../components/molecules/pagination/pagination";
import { EmptyState } from "../../components/molecules/empty-state/empty-state";
import { EntityFormModal } from "../../components/molecules/entity-form-modal/entity-form-modal";
import { EntityDeleteModal } from "../../components/molecules/entity-delete-modal/entity-delete-modal";
import { Input } from "../../components/atoms/input/input";
import { TextArea } from "../../components/atoms/text-area/text-area";
import { Button } from "../../components/atoms/button/button";
import { createPost, deletePost, listPosts, updatePost, type Post } from "@/api/posts";
import { listCategories, type Category } from "@/api/categories";

type ModalMode = "create" | "edit" | null;

export default function AdminPostsPage() {
  const [items, setItems] = useState<Post[] | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [q, setQ] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [author, setAuthor] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetPost, setDeleteTargetPost] = useState<Post | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const triggerReload = useCallback(() => setReloadKey((prev) => prev + 1), []);

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

  useEffect(() => {
    if (modalMode !== "create") return;
    if (formCategory) return;
    if (!categories || categories.length === 0) return;
    setFormCategory(categories[0].slug);
  }, [categories, formCategory, modalMode]);

  const resetForm = useCallback(() => {
    setTitle("");
    setFormCategory("");
    setContent("");
    setThumbnailUrl("");
    setAuthor("");
    setFormError(null);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setDeleteTargetPost(null);
    setDeleteError(null);
    setDeleting(false);
  }, []);

  const closeModal = useCallback(() => {
    setModalMode(null);
    setEditingPost(null);
    setSaving(false);
    resetForm();
    handleCloseDeleteModal();
  }, [handleCloseDeleteModal, resetForm]);

  const handleOpenCreate = useCallback(() => {
    resetForm();
    setEditingPost(null);
    setModalMode("create");
  }, [resetForm]);

  const handleOpenEdit = useCallback((post: Post) => {
    setEditingPost(post);
    setTitle(post.title);
    setFormCategory(post.category);
    setContent(post.content);
    setThumbnailUrl(post.thumbnailUrl ?? "");
    setAuthor(post.author ?? "");
    setFormError(null);
    setModalMode("edit");
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSaving(true);
      setFormError(null);
      const payload = {
        title: title.trim(),
        category: (formCategory || editingPost?.category || "").trim(),
        content: content.trim(),
        thumbnailUrl: thumbnailUrl.trim() || undefined,
        author: author.trim() || undefined,
      };
      if (!payload.category) {
        setFormError("카테고리를 선택하세요.");
        setSaving(false);
        return;
      }
      if (!payload.title) {
        setFormError("제목을 입력하세요.");
        setSaving(false);
        return;
      }
      if (!payload.content) {
        setFormError("본문을 입력하세요.");
        setSaving(false);
        return;
      }
      try {
        if (modalMode === "edit" && editingPost) {
          await updatePost(editingPost.postId, payload);
        } else {
          await createPost(payload);
        }
        triggerReload();
        closeModal();
      } catch (err: unknown) {
        setFormError(err instanceof Error ? err.message : "저장 실패");
      } finally {
        setSaving(false);
      }
    },
    [author, closeModal, content, editingPost, formCategory, modalMode, thumbnailUrl, title, triggerReload]
  );

  const handleRequestDelete = useCallback(() => {
    if (!editingPost) return;
    setDeleteTargetPost(editingPost);
    setDeleteError(null);
    setDeleteModalOpen(true);
  }, [editingPost]);

  const handleDeletePost = useCallback(async () => {
    if (!deleteTargetPost) return;
    try {
      setDeleting(true);
      await deletePost(deleteTargetPost.postId);
      setItems((prev) => prev?.filter((post) => post.postId !== deleteTargetPost.postId) ?? null);
      triggerReload();
      closeModal();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "삭제 실패";
      setDeleteError(message);
    } finally {
      setDeleting(false);
    }
  }, [closeModal, deleteTargetPost, triggerReload]);

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
        <button className="text-left underline underline-offset-2" onClick={() => handleOpenEdit(post)}>
          {post.title}
        </button>
      ),
      category: categoryLabelMap?.[post.category] ?? post.category,
      author: post.author ?? "-",
      actions: (
        <button className="text-sm text-blue-600 underline" onClick={() => handleOpenEdit(post)}>
          편집
        </button>
      ),
    }));
  }, [categoryLabelMap, handleOpenEdit, items]);

  const categoryFilterOptions = useMemo(() => {
    const dynamic = categories ? categories.map((c) => ({ label: c.name, value: c.slug })) : [];
    return [{ label: "전체", value: "all" }, ...(dynamic.length ? dynamic : [
      { label: "IR", value: "ir" },
      { label: "공지", value: "notice" },
    ])];
  }, [categories]);

  const modalReadOnlyFields = useMemo(() => {
    if (modalMode !== "edit" || !editingPost) return undefined;
    return [
      { label: "ID", value: editingPost.postId },
      { label: "생성일", value: editingPost.createdAt },
      { label: "수정일", value: editingPost.updatedAt },
    ];
  }, [editingPost, modalMode]);

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

      <EntityFormModal
        open={modalMode !== null}
        mode={modalMode ?? "create"}
        title={modalMode === "edit" ? "게시물 편집" : "새 게시물"}
        description={modalMode === "edit" ? "필요한 내용을 수정하고 저장하세요." : "게시판에 노출될 새 게시물을 작성합니다."}
        onClose={closeModal}
        onSubmit={handleSubmit}
        saving={saving}
        submitLabel={modalMode === "edit" ? "변경 사항 저장" : "게시물 생성"}
        readOnlyFields={modalReadOnlyFields}
        onDelete={modalMode === "edit" ? handleRequestDelete : undefined}
        deleting={deleting}
      >
        {formError && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {formError}
          </div>
        )}
        <Input label="제목" placeholder="제목을 입력하세요" required value={title} onChange={(e) => setTitle((e.target as HTMLInputElement).value)} />
        <Select
          label="카테고리"
          placeholder="카테고리를 선택하세요"
          options={
            categories
              ? categories.map((c) => ({ label: c.name, value: c.slug }))
              : [
                  { label: "IR", value: "ir" },
                  { label: "공지", value: "notice" },
                ]
          }
          required
          value={formCategory}
          onChange={(e) => setFormCategory((e.target as HTMLSelectElement).value)}
        />
        <Input
          label="썸네일 URL"
          type="url"
          placeholder="https://example.com/image.png"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl((e.target as HTMLInputElement).value)}
        />
        <Input label="작성자" placeholder="작성자 이름" value={author} onChange={(e) => setAuthor((e.target as HTMLInputElement).value)} />
        <TextArea
          label="본문"
          placeholder="Markdown을 포함한 본문을 입력하세요"
          rows={10}
          required
          value={content}
          onChange={(e) => setContent((e.target as HTMLTextAreaElement).value)}
        />
      </EntityFormModal>

      <EntityDeleteModal
        open={deleteModalOpen}
        parentEntityDisplayName={deleteTargetPost?.title ?? ""}
        parentEntityName="게시물"
        parentEntityKeyLabel="제목"
        parentEntityKeyValue={deleteTargetPost?.title ?? ""}
        childEntityName="연결된 항목"
        relatedEntities={[]}
        checking={false}
        errorMessage={deleteError ?? undefined}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeletePost}
        loading={deleting}
      />
    </>
  );
}
