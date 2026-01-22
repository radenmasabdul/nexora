import { useState } from "react";
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
      />

      <div className="flex">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </div>
  );
}