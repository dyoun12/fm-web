"use client";

import { cn } from "@/lib/classnames";
import { ComponentPropsWithoutRef, ReactNode, useMemo, useState } from "react";
import { IconButton } from "../../atoms/icon-button/icon-button";
import { Pagination } from "../pagination/pagination";
import { Select } from "../../atoms/select/select";
import { Card } from "../../atoms/card/card";
import { Skeleton } from "../../atoms/skeleton/skeleton";
import { useAppTheme } from "@/lib/theme-context";

export type DataTableColumn = {
  key: string;
  header: ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
};

export type DataTableProps = {
  columns: DataTableColumn[];
  rows: Record<string, ReactNode>[];
  loading?: boolean;
  caption?: string;
  sortable?: boolean;
  theme?: "light" | "dark";
  onSort?: (key: string) => void; // deprecated: use onSortChange
  onSortChange?: (key: string | null, order: "asc" | "desc" | null) => void;
  defaultSortKey?: string;
  defaultSortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
} & ComponentPropsWithoutRef<"div">;

export function DataTable({ columns, rows, loading = false, caption, sortable = false, theme: themeProp, onSort, onSortChange, defaultSortKey, defaultSortOrder, page, pageSize, total, onPageChange, onPageSizeChange, className, ...rest }: DataTableProps) {
  const appTheme = useAppTheme();
  const theme = themeProp ?? appTheme;
  const isDark = theme === "dark";
  const [sortKey, setSortKey] = useState<string | null>(defaultSortKey ?? null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(defaultSortOrder ?? null);
  const [internalPage, setInternalPage] = useState<number>(page ?? 1);
  const [internalPageSize, setInternalPageSize] = useState<number>(pageSize ?? 10);

  const hasSortHandler = useMemo(
    () => Boolean(sortable && (onSort || onSortChange)),
    [sortable, onSort, onSortChange],
  );
  const effectivePage = page ?? internalPage;
  const effectivePageSize = pageSize ?? internalPageSize;
  const totalCount = total ?? rows.length;

  const handleSortClick = (key: string) => {
    let nextKey: string | null = key;
    let nextOrder: "asc" | "desc" | null = "desc"; // 첫 클릭 DESC
    if (sortKey === key) {
      // 동일 컬럼 클릭 시 순환: DESC -> ASC -> null
      if (sortOrder === "desc") nextOrder = "asc";
      else if (sortOrder === "asc") {
        nextOrder = null;
        nextKey = null;
      }
    }
    setSortKey(nextKey);
    setSortOrder(nextOrder);
    onSort?.(key);
    onSortChange?.(nextKey, nextOrder);
  };
  return (
    <Card padding="none" theme={theme} className={cn("relative", className)} {...rest}>
      <div className="overflow-x-auto">
        <table className={cn("w-full text-sm", isDark ? "text-zinc-200" : "text-zinc-800") }>
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead className={cn(isDark ? "bg-zinc-800" : "bg-zinc-200") }>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  style={{ width: col.width }}
                  className={cn(
                    "px-4 sm:px-5 py-2 text-left font-semibold border-b",
                    isDark ? "border-zinc-700" : "border-zinc-200",
                    col.align === "center" && "text-center",
                    col.align === "right" && "text-right",
                  )}
                >
                  <div className={cn("flex items-center gap-1", col.align === "right" && "justify-end", col.align === "center" && "justify-center")}>
                    <span className="select-none hover:no-underline">{col.header}</span>
                    {hasSortHandler && (
                      <IconButton
                        variant="ghost"
                        size="sm"
                        color={sortKey === col.key && sortOrder ? "primary" : "neutral"}
                        aria-label={`정렬: ${typeof col.header === "string" ? col.header : col.key}`}
                        onClick={() => handleSortClick(col.key)}
                        theme={theme}
                        className="h-7 w-7"
                      >
                        {sortKey === col.key && sortOrder === "desc" && (
                          <i className="ri-sort-desc" aria-hidden="true" />
                        )}
                        {sortKey === col.key && sortOrder === "asc" && (
                          <i className="ri-sort-asc" aria-hidden="true" />
                        )}
                        {(sortKey !== col.key || sortOrder === null) && (
                          <i className="ri-arrow-up-down-line" aria-hidden="true" />
                        )}
                      </IconButton>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: Math.min(3, Math.max(1, Math.ceil((total ?? columns.length) / (columns.length || 1)))) }).map((_, rIdx) => (
                <tr key={`sk-${rIdx}`} className={cn("border-b last:border-b-0", isDark ? "border-zinc-800" : "border-zinc-200") }>
                  {columns.map((col) => (
                    <td key={`sk-${rIdx}-${col.key}`} className="px-4 sm:px-5 py-3">
                      <Skeleton variant="text" />
                    </td>
                  ))}
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-center text-zinc-500" colSpan={columns.length}>데이터가 없습니다</td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <tr
                  key={idx}
                  className={cn(
                    // 라이트/다크 공통: 행 배경 통일(지브라 제거), 구분선으로만 구획
                    "border-b last:border-b-0",
                    isDark ? "border-zinc-800" : "border-zinc-200",
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-4 sm:px-5 py-3",
                        col.align === "center" && "text-center",
                        col.align === "right" && "text-right",
                      )}
                    >
                      {row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {(onPageChange || onPageSizeChange || total) && (
        <div className={cn("flex items-center justify-between border-t py-2 px-4 sm:px-5", isDark ? "border-zinc-700" : "border-zinc-200") }>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">페이지당</span>
            <div className="min-w-[88px]">
              <Select
                aria-label="페이지당 개수"
                size="sm"
                options={[
                  { label: "10", value: "10" },
                  { label: "25", value: "25" },
                  { label: "50", value: "50" },
                  { label: "100", value: "100" },
                ]}
                value={String(effectivePageSize)}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  if (onPageSizeChange) onPageSizeChange(next);
                  else setInternalPageSize(next);
                }}
                theme={theme}
              />
            </div>
          </div>
          <Pagination
            page={effectivePage}
            pageSize={effectivePageSize}
            total={totalCount}
            onPageChange={(p: number) => {
              if (onPageChange) onPageChange(p);
              else setInternalPage(p);
            }}
            theme={theme}
          />
        </div>
      )}
    </Card>
  );
}
