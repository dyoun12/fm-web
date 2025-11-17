"use client";

import { EntityFormCard } from "@/app/components/molecules/entity-form-card/entity-form-card";
import { EntityDeleteModal } from "@/app/components/molecules/entity-delete-modal/entity-delete-modal";
import { Input } from "@/app/components/atoms/input/input"
import { Select } from "@/app/components/atoms/select/select"
import { getPost, createPost, updatePost, deletePost, type Post } from "@/api/posts";
import { listCategories, type Category } from "@/api/categories";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { JSONContent } from "@tiptap/react";
import { SimpleEditor } from "@/app/components/tiptap-templates/simple/simple-editor";

export type SidebarClientProps = {
  postId: string
}

export function EditPostController({ postId }: SidebarClientProps) {  
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetPost, setDeleteTargetPost] = useState<Post | null>(null);

  const [post, setPost] = useState<Post | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);

  const [title, setTitle] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [author, setAuthor] = useState("");

  // ⭐ 핵심: content는 로컬 상태로만 관리
  const [content, setContent] = useState<JSONContent | null>(null);

  const [mode, setMode] = useState<"create" | "edit">("edit");

  // -----------------------
  // init load
  // -----------------------
  useEffect(() => {
    async function init() {
      if (postId === "new-post") {
        handleOpenCreate();
        setContent(null);
      } else {
        const loadedPost = await getPost(postId);
        setPost(loadedPost);
        setContent(loadedPost.content); // ⭐ load content
        handleOpenEdit(loadedPost);
      }
    }

    init();
  }, [postId]);

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

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSaving(true);
      setFormError(null);

      const payload = {
        title: title.trim(),
        category: (formCategory || editingPost?.category || "").trim(),
        content: content ?? undefined,  // ⭐ Redux → useState
        thumbnailUrl: thumbnailUrl.trim() || undefined,
        author: author.trim() || undefined,
      };

      if (!payload.category) return setFormError("카테고리를 선택하세요.");
      if (!payload.title) return setFormError("제목을 입력하세요.");
      if (!payload.content) return setFormError("본문을 입력하세요.");

      try {
        if (mode === "edit" && editingPost) {
          await updatePost(editingPost.postId, payload);
        } else {
          await createPost(payload);
        }
      } catch (err: unknown) {
        setFormError(err instanceof Error ? err.message : "저장 실패");
      } finally {
        setSaving(false);
      }
    },
    [author, content, editingPost, formCategory, mode, thumbnailUrl, title]
  );

  // -----------------------
  // Mode handling
  // -----------------------
  useEffect(() => {
    if (mode !== "create") return;
    if (formCategory) return;
    if (!categories || categories.length === 0) return;
    setFormCategory(categories[0].slug);
  }, [categories, formCategory, mode]);

  const resetForm = useCallback(() => {
    setTitle("");
    setFormCategory("");
    setThumbnailUrl("");
    setAuthor("");
    setFormError(null);
    setContent(null);
  }, []);

  const handleOpenCreate = useCallback(() => {
    resetForm();
    setEditingPost(null);
    setMode("create");
  }, [resetForm]);

  const handleOpenEdit = useCallback((post: Post) => {
    setEditingPost(post);
    setTitle(post.title);
    setFormCategory(post.category);
    setThumbnailUrl(post.thumbnailUrl ?? "");
    setAuthor(post.author ?? "");
    setMode("edit");
  }, []);

  // -----------------------
  // Delete
  // -----------------------
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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "삭제 실패";
      setDeleteError(message);
    } finally {
      setDeleting(false);
    }
  }, [deleteTargetPost]);


  const modalReadOnlyFields = useMemo(() => {
    if (mode !== "edit" || !editingPost) return undefined;
    return [
      { label: "ID", value: editingPost.postId },
      { label: "생성일", value: editingPost.createdAt },
      { label: "수정일", value: editingPost.updatedAt },
    ];
  }, [editingPost, mode]);

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setDeleteTargetPost(null);
    setDeleteError(null);
    setDeleting(false);
  }, []);

  return (
    
    <div className="flex h-full gap-6">
      <SimpleEditor
        key={content ? "loaded" : "empty"}
        content={content}
        onChange={(value) => setContent(value)}
      />

      <EntityFormCard
        variant="sidebar"
        open={mode !== null}
        mode={mode ?? "create"}
        title={mode === "edit" ? "게시물 편집" : "새 게시물"}
        description={mode === "edit" ? "필요한 내용을 수정하고 저장하세요." : "게시판에 노출될 새 게시물을 작성합니다."}
        onSubmit={handleSubmit}
        saving={saving}
        submitLabel={mode === "edit" ? "변경 사항 저장" : "게시물 생성"}
        readOnlyFields={modalReadOnlyFields}
        onDelete={mode === "edit" ? handleRequestDelete : undefined}
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
      </EntityFormCard>

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
    </div>
  );
}
