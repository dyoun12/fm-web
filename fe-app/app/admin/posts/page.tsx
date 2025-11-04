import { FilterBar } from "../../components/molecules/filter-bar/filter-bar";
import { Select } from "../../components/atoms/select/select";
import { SearchInput } from "../../components/molecules/search-input/search-input";
import { DataTable } from "../../components/molecules/data-table/data-table";
import { Pagination } from "../../components/molecules/pagination/pagination";
import { EmptyState } from "../../components/molecules/empty-state/empty-state";

export default function AdminPostsPage() {
  const columns = [
    { key: "title", header: "제목" },
    { key: "category", header: "카테고리" },
    { key: "author", header: "작성자" },
  ];
  const rows: Array<Record<string, React.ReactNode>> = [];

  return (
    <div className="grid gap-4">
      <FilterBar>
        <Select size="sm" options={[{ label: "전체", value: "all" }, { label: "IR", value: "ir" }, { label: "공지", value: "notice" }]} aria-label="카테고리" />
        <SearchInput placeholder="제목 검색" />
      </FilterBar>
      <div className="grid gap-3">
        {rows.length === 0 ? (
          <EmptyState title="게시물이 없습니다" description="우측 상단의 '새 게시물' 버튼으로 추가하세요" />
        ) : (
          <DataTable columns={columns} rows={rows} caption="게시물 목록" />
        )}
        <div className="flex justify-end">
          <Pagination page={1} pageSize={10} total={0} />
        </div>
      </div>
    </div>
  );
}
