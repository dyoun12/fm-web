import { FilterBar } from "../../components/molecules/filter-bar/filter-bar";
import { Select } from "../../components/atoms/select/select";
import { SearchInput } from "../../components/molecules/search-input/search-input";
import { DataTable } from "../../components/molecules/data-table/data-table";
import { EmptyState } from "../../components/molecules/empty-state/empty-state";

export default function AdminUsersPage() {
  const columns = [
    { key: "email", header: "이메일" },
    { key: "role", header: "역할" },
    { key: "status", header: "상태" },
  ];
  const rows: Array<Record<string, React.ReactNode>> = [];

  return (
    <div className="grid gap-4">
      <FilterBar>
        <SearchInput placeholder="사용자 검색" />
        <Select options={[{ label: "전체", value: "all" }, { label: "admin", value: "admin" }, { label: "editor", value: "editor" }, { label: "viewer", value: "viewer" }]} aria-label="역할" />
      </FilterBar>
      {rows.length === 0 ? (
        <EmptyState title="사용자가 없습니다" description="'사용자 초대' 버튼으로 추가하세요" />
      ) : (
        <DataTable columns={columns} rows={rows} caption="사용자 목록" />
      )}
    </div>
  );
}

