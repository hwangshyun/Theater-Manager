import { useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale"; // ✅ 한글 로케일 추가
import { DateRange } from "react-day-picker";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function DateRangePicker({ onChange }: { onChange: (value: string) => void }) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [isSoldOut, setIsSoldOut] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDateChange = (newDate: DateRange | undefined) => {
    if (!newDate) return;
    setDate(newDate);
    setIsSoldOut(false);

    if (newDate.from && newDate.to) {
      const formattedStart = format(newDate.from, "yyyy.MM.dd", { locale: ko });
      const formattedEnd = format(newDate.to, "yyyy.MM.dd", { locale: ko });
      onChange(`${formattedStart} - ${formattedEnd}`);
      setIsOpen(false);
    }
  };

  const handleSoldOut = () => {
    if (!date?.from) return;
    setIsSoldOut(true);
    onChange(`${format(date.from, "yyyy.MM.dd", { locale: ko })} - 소진시`);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="justify-between text-xs bg-gray-900 text-white bg-opacity-80 px-3 py-2 rounded-md w-full border border-gray-700 outline-none focus:ring-2 focus:ring-gray-600"
        >
          {date?.from
            ? `${format(date.from, "yyyy.MM.dd", { locale: ko })} - ${
                isSoldOut
                  ? "소진시"
                  : date.to
                  ? format(date.to, "yyyy.MM.dd", { locale: ko })
                  : "종료일 선택"
              }`
            : "제공 기간 선택"}
          <CalendarIcon className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-1 absolute -top-40">
        <Calendar
          locale={ko}
          mode="range" // ✅ 한 번에 기간 선택 가능
          selected={date}
          onSelect={handleDateChange}
          numberOfMonths={1} // ✅ 두 달 표시
          className="text-xs"
          initialFocus
        />
        <Button
          className="mt-2 w-full text-xs bg-gray-900 text-white bg-opacity-80 px-3 py-2 rounded-md border border-gray-700 outline-none focus:ring-2 focus:ring-gray-600"
          onClick={handleSoldOut}
          disabled={!date?.from} // ✅ 시작 날짜 없을 시 비활성화
        >
          소진시
        </Button>
      </PopoverContent>
    </Popover>
  );
}

export default DateRangePicker;