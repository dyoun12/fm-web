"use client";

import { cn } from "@/lib/classnames";
import { ComponentPropsWithoutRef, ReactNode } from "react";

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
  theme?: "light" | "dark";
  onSort?: (key: string) => void;
} & ComponentPropsWithoutRef<"div">;

export function DataTable({ columns, rows, loading = false, caption, theme = "light", onSort, className, ...rest }: DataTableProps) {
  const isDark = theme === "dark";
  return (
    <div className={cn("relative overflow-x-auto rounded-2xl border", isDark ? "border-zinc-700" : "border-zinc-200", className)} {...rest}>
      <table className={cn("w-full text-sm", isDark ? "text-zinc-200" : "text-zinc-800") }>
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead className={cn(isDark ? "bg-zinc-900" : "bg-zinc-50") }>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                style={{ width: col.width }}
                className={cn(
                  "px-4 py-3 text-left font-semibold",
                  col.align === "center" && "text-center",
                  col.align === "right" && "text-right",
                )}
              >
                <button
                  type="button"
                  className="inline-flex items-center gap-1 hover:underline"
                  onClick={() => onSort?.(col.key)}
                  aria-label={`정렬: ${typeof col.header === "string" ? col.header : col.key}`}
                >
                  {col.header}
                  <i className="ri-arrow-up-down-line" aria-hidden="true" />
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td className="px-4 py-6 text-center text-zinc-500" colSpan={columns.length}>불러오는 중...</td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td className="px-4 py-6 text-center text-zinc-500" colSpan={columns.length}>데이터가 없습니다</td>
            </tr>
          ) : (
            rows.map((row, idx) => (
              <tr key={idx} className={cn(idx % 2 ? (isDark ? "bg-white/5" : "bg-zinc-50") : undefined)}>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-4 py-3",
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
  );
}

