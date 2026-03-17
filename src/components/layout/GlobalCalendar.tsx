import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

type GlobalCalendarProps = {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: (date: Date) => boolean
}

export default function GlobalCalendar({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled
}: GlobalCalendarProps) {

  const [openCalendar, setOpenCalendar] = useState<boolean>(false);

  return (
    <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
      
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            readOnly
            value={value ? format(value, "dd/MM/yyyy") : ""}
            placeholder={placeholder}
            className="w-full pr-10"
          />
          <CalendarIcon
            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60"
            size={18}
          />
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0 z-9999" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange?.(date)
            setOpenCalendar(false)
          }}
          disabled={disabled}
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  )
}