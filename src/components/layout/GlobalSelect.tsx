import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Option = {
  label: string;
  value: string;
};

type GlobalFilterProps = {
  options: Option[];
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  contentClassName?: string;
  groupClassName?: string;
};

export default function GlobalSelect({ options, placeholder, value, onChange, className, contentClassName, groupClassName } : GlobalFilterProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent position="popper" className={contentClassName}>
        <SelectGroup className={groupClassName}>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}