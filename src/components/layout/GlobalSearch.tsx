import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react";

type GlobalSearchProps = {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  className?: string;
};

export default function GlobalSearch({ value, onChange, onSearch, className }: GlobalSearchProps) {
  return (
    <Field orientation="horizontal" className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
      <Input
        id="seacrh"
        name="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSearch();
        }}
        placeholder="Search..."
        className="w-full pl-10 pr-4 py-2.5 text-secondary border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </Field>
  );
}