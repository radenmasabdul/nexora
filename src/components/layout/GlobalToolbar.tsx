import { useState } from "react";
import { Search, RotateCcw } from "lucide-react";
import GlobalSearch from "./GlobalSearch";
import GlobalSelect from "./GlobalSelect";

type Option = {
  label: string;
  value: string;
};

type GlobalToolbarProps = {
  options: Option[];
  placeholder: string;
  onSearch: (payload: { keyword: string; filter: string }) => void;
};

export default function GlobalToolbar({ options, placeholder, onSearch } : GlobalToolbarProps) {
  const [keyword, setKeyword] = useState("");
  const [filter, setFilter] = useState("");

  const handleSearch = () => {
    onSearch({ keyword, filter });
  };

  const handleReset = () => {
    setKeyword("");
    setFilter("");
    onSearch({ keyword: "", filter: "" });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
      <GlobalSearch
        value={keyword}
        onChange={setKeyword}
        onSearch={handleSearch}
      />

      <GlobalSelect
        options={options}
        placeholder={placeholder}
        value={filter}
        onChange={setFilter}
        contentClassName="z-[9999]"
        groupClassName="bg-surface"
      />

      <div className="flex gap-2">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2"
          onClick={handleSearch}
        >
          <Search className="w-4 h-4" />
          Search
        </button>
        <button
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2"
          onClick={handleReset}
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>
    </div>
  );
}