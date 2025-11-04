import { FilterBar } from "../../components/molecules/filter-bar/filter-bar";
import { SearchInput } from "../../components/molecules/search-input/search-input";
import { DataTable } from "../../components/molecules/data-table/data-table";
import { EmptyState } from "../../components/molecules/empty-state/empty-state";

export default function AdminCategoriesPage() {
  const columns = [
    { key: "name", header: "이름" },
    { key: "slug", header: "슬러그" },
    { key: "order", header: "정렬" },
  ];
  const rows: Array<Record<string, React.ReactNode>> = [];

  return (
    <div className="grid gap-4">
      <FilterBar>
        <SearchInput placeholder="카테고리 검색" />
      </FilterBar>
      {rows.length === 0 ? (
        <EmptyState title="카테고리가 없습니다" description="'새 카테고리' 버튼으로 추가하세요" />
      ) : (
        <DataTable columns={columns} rows={rows} caption="카테고리 목록" />
      )}
    </div>
  );
}

