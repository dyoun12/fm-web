"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../../components/atoms/button/button";
import { DataTable } from "../../components/molecules/data-table/data-table";
import { EmptyState } from "../../components/molecules/empty-state/empty-state";
import { EntityFormCard } from "../../components/molecules/entity-form-card/entity-form-card";
import { EntityDeleteModal } from "../../components/molecules/entity-delete-modal/entity-delete-modal";
import { Input } from "../../components/atoms/input/input";
import { TextArea } from "../../components/atoms/text-area/text-area";
import { FilterBar } from "../../components/molecules/filter-bar/filter-bar";
import {
  createCorpMeta,
  deleteCorpMeta,
  listCorpMeta,
  updateCorpMeta,
  type CorpMeta,
} from "@/api/corp-meta";

type ModalMode = "create" | "edit" | null;

export default function AdminCorpMetaPage() {
  const [items, setItems] = useState<CorpMeta[] | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editing, setEditing] = useState<CorpMeta | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CorpMeta | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [corpNum, setCorpNum] = useState("");
  const [ceo, setCeo] = useState("");
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const hasItems = Boolean(items && items.length > 0);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await listCorpMeta();
        if (!mounted) return;
        setItems(sortCorpMeta(res.items ?? []));
      } catch (err: unknown) {
        if (!mounted) return;
        setItems([]);
        setListError(err instanceof Error ? err.message : "회사 정보를 불러오지 못했습니다.");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const resetForm = useCallback(() => {
    setAddress("");
    setCorpNum("");
    setCeo("");
    setEmail("");
    setHp("");
    setFormError(null);
  }, []);

  const closeModal = useCallback(() => {
    setModalMode(null);
    setEditing(null);
    setSaving(false);
    resetForm();
  }, [resetForm]);

  const handleOpenCreate = useCallback(() => {
    if (hasItems) return;
    resetForm();
    setModalMode("create");
    setEditing(null);
  }, [hasItems, resetForm]);

  const handleOpenEdit = useCallback((item: CorpMeta) => {
    setEditing(item);
    setModalMode("edit");
    setAddress(item.address ?? "");
    setCorpNum(item.corpNum ?? "");
    setCeo(item.ceo ?? "");
    setEmail(item.email ?? "");
    setHp(item.hp ?? "");
    setFormError(null);
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSaving(true);
      setFormError(null);
      const payload = {
        address: address.trim() || undefined,
        corpNum: corpNum.trim() || undefined,
        ceo: ceo.trim() || undefined,
        email: email.trim() || undefined,
        hp: hp.trim() || undefined,
      };
      try {
        if (modalMode === "edit" && editing) {
          const updated = await updateCorpMeta(editing.corpMetaId, payload);
          setItems((prev) => {
            const base = prev ?? [];
            const next = base.map((item) => (item.corpMetaId === updated.corpMetaId ? updated : item));
            return sortCorpMeta(next);
          });
        } else {
          const created = await createCorpMeta(payload);
          setItems((prev) => {
            const base = prev ?? [];
            return sortCorpMeta([created, ...base]);
          });
        }
        closeModal();
      } catch (err: unknown) {
        setFormError(err instanceof Error ? err.message : "저장에 실패했습니다.");
      } finally {
        setSaving(false);
      }
    },
    [address, corpNum, ceo, email, hp, modalMode, editing, closeModal],
  );

  const handleRequestDelete = useCallback((item: CorpMeta) => {
    setDeleteTarget(item);
    setDeleteModalOpen(true);
    setDeleteError(null);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setDeleteTarget(null);
    setDeleteError(null);
    setDeleting(false);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteCorpMeta(deleteTarget.corpMetaId);
      setItems((prev) => prev?.filter((item) => item.corpMetaId !== deleteTarget.corpMetaId) ?? []);
      handleCloseDeleteModal();
    } catch (err: unknown) {
      setDeleteError(err instanceof Error ? err.message : "삭제에 실패했습니다.");
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget, handleCloseDeleteModal]);

  const columns = useMemo(
    () => [
      { key: "address", header: "주소" },
      { key: "corpNum", header: "사업자등록번호" },
      { key: "ceo", header: "대표자" },
      { key: "contact", header: "연락처" },
      { key: "actions", header: "관리", align: "right", width: "140px" },
    ],
    [],
  );

  const rows = useMemo(() => {
    if (!items || items.length === 0) return [];
    return items.map((item) => ({
      address: (
        <div className="max-w-md text-sm text-zinc-700">
          {item.address || <span className="text-zinc-400">-</span>}
        </div>
      ),
      corpNum: item.corpNum || "-",
      ceo: item.ceo || "-",
      contact: (
        <div className="flex flex-col text-sm">
          <span>{item.email || "-"}</span>
          <span className="text-zinc-500">{item.hp || "-"}</span>
        </div>
      ),
      actions: (
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="ghost" onClick={() => handleOpenEdit(item)}>
            편집
          </Button>
          <Button size="sm" variant="ghost" color="neutral" onClick={() => handleRequestDelete(item)}>
            삭제
          </Button>
        </div>
      ),
    }));
  }, [items, handleOpenEdit, handleRequestDelete]);

  return (
    <div className="grid gap-4">
      <FilterBar className="items-center justify-between">
        <div className="flex flex-col gap-1 text-left">
          <span className="text-sm font-semibold text-zinc-800">회사 정보 관리</span>
          <span className="text-xs text-zinc-500">
            푸터·문의 섹션에 노출되는 대표 주소와 연락처를 업데이트하세요.
            <br />
            회사 정보는 단일 항목만 유지하며, 삭제 후 재등록 가능합니다.
          </span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Button size="sm" onClick={handleOpenCreate} disabled={hasItems}>
            회사 정보 등록
          </Button>
          {hasItems && (
            <p className="text-[11px] text-zinc-500">
              추가 등록은 불가하며, 기존 정보를 삭제한 다음 다시 등록하세요.
            </p>
          )}
        </div>
      </FilterBar>

      {listError && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {listError}
        </div>
      )}

      {items === null && !listError ? (
        <DataTable columns={columns} rows={[]} loading caption="회사 정보" />
      ) : hasItems ? (
        <DataTable columns={columns} rows={rows} caption="회사 정보" />
      ) : (
        <EmptyState
          icon="database"
          title="등록된 회사 정보가 없습니다"
          description="대표 주소/연락처를 입력하면 사이트 전역에서 동일하게 노출됩니다."
          actionLabel="회사 정보 등록"
          onAction={handleOpenCreate}
        />
      )}

      <EntityFormCard
        open={modalMode !== null}
        mode={modalMode ?? "create"}
        title={modalMode === "edit" ? "회사 정보 수정" : "회사 정보 등록"}
        description="사이트 푸터와 문의 채널에 바로 반영됩니다."
        onClose={closeModal}
        onSubmit={handleSubmit}
        submitLabel={modalMode === "edit" ? "저장" : "등록"}
        saving={saving}
      >
        {formError && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {formError}
          </div>
        )}
        <TextArea
          label="주소"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="서울특별시 ..."
        />
        <Input
          label="사업자등록번호"
          value={corpNum}
          onChange={(event) => setCorpNum(event.target.value)}
          placeholder="123-45-67890"
        />
        <Input
          label="대표자"
          value={ceo}
          onChange={(event) => setCeo(event.target.value)}
          placeholder="홍길동"
        />
        <Input
          label="이메일"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="contact@example.com"
        />
        <Input
          label="대표 전화"
          value={hp}
          onChange={(event) => setHp(event.target.value)}
          placeholder="02-000-0000"
        />
      </EntityFormCard>

      <EntityDeleteModal
        open={deleteModalOpen}
        parentEntityDisplayName="회사 정보"
        parentEntityName="회사 정보"
        parentEntityKeyLabel={
          deleteTarget?.ceo
            ? "대표자"
            : deleteTarget?.corpNum
              ? "사업자등록번호"
              : undefined
        }
        parentEntityKeyValue={
          deleteTarget?.ceo ??
          deleteTarget?.corpNum ??
          deleteTarget?.corpMetaId ??
          undefined
        }
        onClose={handleCloseDeleteModal}
        onConfirm={handleDelete}
        confirmLabel="삭제"
        loading={deleting}
        errorMessage={deleteError ?? undefined}
      />
    </div>
  );
}

function sortCorpMeta(list: CorpMeta[]): CorpMeta[] {
  return [...list].sort((a, b) => {
    const left = (b.updatedAt ?? b.createdAt ?? "").toString();
    const right = (a.updatedAt ?? a.createdAt ?? "").toString();
    return left.localeCompare(right);
  });
}
