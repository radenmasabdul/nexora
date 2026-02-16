import { useState } from "react";
import { Search, RotateCcw } from "lucide-react";
import GlobalSearch from "./GlobalSearch";
import GlobalSelect from "./GlobalSelect";

export type Option = {
  label: string;
  value: string;
};

export type ToolbarFilter = {
  key: string;
  options: Option[];
  placeholder: string;
};

type GlobalToolbarProps = {
  filters?: ToolbarFilter[];
  showSearch?: boolean;
  onSearch: (payload: {
    keyword: string;
    filters: Record<string, string>;
  }) => void;
};

export default function GlobalToolbar({
  filters = [],
  showSearch = true,
  onSearch,
}: GlobalToolbarProps) {
  const [keyword, setKeyword] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const handleSearch = () => {
    onSearch({
      keyword,
      filters: filterValues,
    });
  };

  const handleReset = () => {
    setKeyword("");
    setFilterValues({});
    onSearch({
      keyword: "",
      filters: {},
    });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
      {showSearch && (
        <div className="w-full">
          <GlobalSearch
            value={keyword}
            onChange={setKeyword}
            onSearch={handleSearch}
          />
        </div>
      )}

      {filters.map((filter) => (
        <GlobalSelect
          key={filter.key}
          options={filter.options}
          placeholder={filter.placeholder}
          value={filterValues[filter.key] || ""}
          onChange={(value) =>
            setFilterValues((prev) => ({
              ...prev,
              [filter.key]: value,
            }))
          }
          contentClassName="z-[9999]"
          groupClassName="bg-surface"
        />
      ))}

      <div className="flex gap-2">
        <button
          onClick={handleSearch}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 whitespace-nowrap cursor-pointer"
        >
          <Search className="w-4 h-4" />
          Search
        </button>

        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 whitespace-nowrap cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>
    </div>
  );
};