"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { DataTable, type DataTableColumn } from "../../components/molecules/data-table/data-table";
import { EmptyState } from "../../components/molecules/empty-state/empty-state";
import { FilterBar } from "../../components/molecules/filter-bar/filter-bar";
import { Badge } from "../../components/atoms/badge/badge";
import type { ContactInquiry } from "@/api/contact";

export default function AdminContactPage() {
  const router = useRouter();
  const [items, setItems] = useState<ContactInquiry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await fetch("/api/contact", { method: "GET" });
        const json = await r.json();
        if (!mounted) return;
        if (!json || json.success !== true) {
          throw new Error(json?.error?.message ?? "문의 목록을 불러오지 못했습니다.");
        }
        setItems(json.data.items ?? []);
      } catch (err) {
        if (!mounted) return;
        setItems([]);
        setError(err instanceof Error ? err.message : "문의 목록을 불러오지 못했습니다.");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const renderStatusBadge = (value: string | undefined) => {
    const statusValue = value ?? "new";
    let color: "default" | "info" | "success" | "warning" = "default";
    let label = statusValue;

    switch (statusValue) {
      case "new":
        color = "warning";
        label = "신규";
        break;
      case "in_progress":
        color = "info";
        label = "처리 중";
        break;
      case "done":
        color = "success";
        label = "완료";
        break;
      default:
        color = "default";
        label = statusValue;
    }

    return (
      <Badge color={color}>
        {label}
      </Badge>
    );
  };

  const columns: DataTableColumn[] = [
    { key: "createdAt", header: "접수일시", width: "180px" },
    { key: "subject", header: "제목" },
    { key: "name", header: "이름" },
    { key: "email", header: "이메일" },
    { key: "status", header: "상태", width: "140px" },
  ];

  const rows: Array<Record<string, ReactNode>> =
    items?.map((item) => ({
      createdAt: new Date(item.createdAt).toLocaleString(),
      name: item.name,
      email: item.email,
      subject: (
        <button
          type="button"
          className="text-left text-blue-600 underline underline-offset-2"
          onClick={() => router.push(`/admin/contact/${item.inquiryId}`)}
        >
          {item.subject || "(제목 없음)"}
        </button>
      ),
      status: renderStatusBadge(item.status),
    })) ?? [];

  return (
    <div className="grid gap-4">
      <FilterBar className="items-center justify-between">
        <div className="flex flex-col gap-1 text-left">
          <span className="text-sm font-semibold text-zinc-800">문의 관리</span>
          <span className="text-xs text-zinc-500">
            `/contact` 페이지에서 접수된 문의 내역을 확인합니다.
          </span>
        </div>
      </FilterBar>

      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {items === null && !error ? (
        <DataTable columns={columns} rows={[]} loading caption="문의" />
      ) : items && items.length > 0 ? (
        <DataTable columns={columns} rows={rows} caption="문의" />
      ) : (
        <EmptyState
          icon="mail"
          title="접수된 문의가 없습니다"
          description="사용자가 `/contact` 페이지를 통해 문의를 남기면 이곳에 표시됩니다."
        />
      )}
    </div>
  );
}
