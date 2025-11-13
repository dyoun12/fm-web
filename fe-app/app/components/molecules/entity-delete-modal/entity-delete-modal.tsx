"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "../../atoms/button/button";
import { cn } from "@/lib/classnames";

export type RelatedEntity = Record<string, unknown> & {
  id?: string;
  label?: string;
  description?: string;
};

export type EntityDeleteModalProps = {
  open: boolean;
  parentEntityDisplayName: string;
  parentEntityName?: string;
  parentEntityKeyLabel?: string;
  parentEntityKeyValue?: string;
  childEntityName?: string;
  childEntityKey?: string;
  relatedEntities?: RelatedEntity[];
  onClose: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  checking?: boolean;
  blockedMessage?: string;
  emptyMessage?: string;
  errorMessage?: string;
};

export function EntityDeleteModal({
  open,
  parentEntityDisplayName,
  parentEntityName = "엔티티",
  parentEntityKeyLabel,
  parentEntityKeyValue,
  childEntityName = "연결된 항목",
  childEntityKey = "label",
  relatedEntities = [],
  onClose,
  onConfirm,
  confirmLabel = "삭제",
  cancelLabel = "취소",
  loading,
  checking,
  blockedMessage,
  emptyMessage,
  errorMessage,
}: EntityDeleteModalProps) {
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    if (!open) setShowList(false);
  }, [open]);

  const relationCount = relatedEntities.length;
  const isBlocked = relationCount > 0;

  const parentKeyText = useMemo(() => {
    if (parentEntityKeyLabel && parentEntityKeyValue) {
      return `${parentEntityKeyLabel} '${parentEntityKeyValue}'`;
    }
    return parentEntityDisplayName;
  }, [parentEntityDisplayName, parentEntityKeyLabel, parentEntityKeyValue]);

  const computedBlockedMessage = blockedMessage ?? `${parentKeyText}에 포함된 ${childEntityName}이 있어 삭제할 수 없습니다.`;

  const headline = useMemo(() => {
    if (checking) return "삭제 가능 여부를 확인하는 중입니다.";
    if (isBlocked) return `${parentEntityName} 삭제 불가`;
    return `${parentEntityDisplayName} 삭제`;
  }, [checking, isBlocked, parentEntityDisplayName, parentEntityName]);

  const canDelete = !isBlocked && !checking && !errorMessage;

  if (!open) return null;

  const renderChildLabel = (entity: RelatedEntity): string => {
    const value = entity[childEntityKey];
    if (typeof value === "string" || typeof value === "number") {
      return String(value);
    }
    if (typeof entity.label === "string" && entity.label) return entity.label;
    return "이름 없는 항목";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">{headline}</h2>
            <p className="mt-1 text-sm text-zinc-500">삭제 시 복구가 어려울 수 있습니다.</p>
          </div>
          <button className="text-sm text-zinc-500 hover:text-zinc-900" onClick={onClose} aria-label="닫기">
            닫기
          </button>
        </div>

        <div className="mt-6 space-y-4 text-sm text-zinc-700">
          {checking ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 px-4 py-3 text-center text-zinc-500">연결된 항목을 확인하는 중입니다...</div>
          ) : (
            <>
              {errorMessage && (
                <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {errorMessage}
                </div>
              )}
              {isBlocked ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900">
                  <p className="font-medium">{computedBlockedMessage}</p>
                  <p className="mt-1 text-sm text-amber-800">
                    연결된 {childEntityName}을 다른 {parentEntityName}으로 이동하거나 삭제한 뒤 다시 시도하세요.
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    color="neutral"
                    className="mt-3 text-sm"
                    onClick={() => setShowList((prev) => !prev)}
                  >
                    {showList ? `연결된 ${childEntityName} 숨기기` : `연결된 ${childEntityName} 보기 (${relationCount})`}
                  </Button>
                  {showList && (
                    <ul className="mt-3 max-h-60 space-y-2 overflow-y-auto">
                      {relatedEntities.map((entity, idx) => {
                        const label = renderChildLabel(entity);
                        return (
                          <li key={entity.id ?? `${label}-${idx}`} className="rounded-xl border border-zinc-200 px-3 py-2">
                            <div className="text-sm font-medium text-zinc-900">{label}</div>
                            {typeof entity.description === "string" && entity.description && (
                              <p className="text-xs text-zinc-500">{entity.description}</p>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                  <p>{emptyMessage ?? `‘${parentEntityDisplayName}’을 삭제하시겠습니까?`}</p>
                  <p className="mt-1 text-xs text-zinc-500">삭제 후에는 내용을 되돌릴 수 없습니다.</p>
                </div>
              )}
            </>
          )}
        </div>

        <div className={cn("mt-6 flex justify-end gap-2", (isBlocked || errorMessage) && "justify-end")}>
          <Button type="button" variant="ghost" color="neutral" onClick={onClose}>
            {cancelLabel}
          </Button>
          {canDelete && (
            <Button
              type="button"
              color="neutral"
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={onConfirm}
              loading={loading}
              aria-label={`${parentEntityDisplayName} 삭제 확인`}
            >
              {confirmLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
