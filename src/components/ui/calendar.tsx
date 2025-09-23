import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";

interface CalendarProps {
  className?: string;
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
}

export function Calendar({
  className,
  selectedDate = new Date(),
  onDateChange,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(
    selectedDate.getMonth()
  );
  const [currentYear, setCurrentYear] = React.useState(
    selectedDate.getFullYear()
  );

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    onDateChange?.(newDate);
  };

  return (
    <div className={cn("p-3", className)}>
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" size="icon" onClick={handlePrevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">
          {new Date(currentYear, currentMonth).toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <Button variant="outline" size="icon" onClick={handleNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-medium text-sm py-1">
            {day}
          </div>
        ))}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}
        {days.map((day) => (
          <Button
            key={day}
            variant="ghost"
            className={cn(
              "h-8 w-8 p-0 font-normal",
              selectedDate.getDate() === day &&
                selectedDate.getMonth() === currentMonth &&
                selectedDate.getFullYear() === currentYear
                ? "bg-primary text-primary-foreground"
                : ""
            )}
            onClick={() => handleDateClick(day)}
          >
            {day}
          </Button>
        ))}
      </div>
    </div>
  );
}
