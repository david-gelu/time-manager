import { useState } from "react";
import { Calendar as PrimereactCalendar } from "primereact/calendar";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "./ui/dialog";
import { format } from "date-fns";
import type { Nullable } from "primereact/ts-helpers";
import { type AllHTMLAttributes } from "react";
import { normalizeCalendarValue } from "@/lib/utils";

export type CalendarValue = Nullable<Date | Date[] | (Date | null)[]>;
interface CalendarDayContext {
  date: Date;
  day: number;
  month: number;
  year: number;
  today: boolean;
  selected: boolean;
  selectable: boolean;
  inRange?: boolean;
  disabled?: boolean;
}
interface CalendarProps {
  value?: CalendarValue;
  onChange?: (value: CalendarValue) => void;
  showTime?: boolean;
  selectionMode?: "single" | "multiple" | "range";
  desc?: string;
  inline?: boolean;
}

export default function Calendar({
  value,
  onChange,
  showTime,
  selectionMode = "single",
  desc,
  inline,
}: CalendarProps) {
  const [open, setOpen] = useState(false);
  const [tempValue, setTempValue] = useState<CalendarValue>(value);

  const isDate = (value: unknown): value is Date => {
    return value instanceof Date;
  }

  const formatDateLabel = (
    value: CalendarValue,
    mode: "single" | "multiple" | "range",
    showTime?: boolean
  ): string => {
    if (!value) return "Select date";

    if (mode === "single") {
      return value instanceof Date
        ? format(value, showTime ? "dd.MM.yyyy HH:mm" : "dd.MM.yyyy")
        : "Select date";
    }

    if (mode === "multiple" && Array.isArray(value)) {
      const validDates = value.filter(isDate);
      if (validDates.length === 0) return "Select date";
      return validDates.map((d) => format((d as Date), "dd.MM.yyyy HH:mm")).join(", ");
    }

    if (mode === "range" && Array.isArray(value)) {
      const [from, to] = value;
      if (isDate(from) && isDate(to)) {
        return `${format(from, "dd.MM.yyyy HH:mm")} - ${format(to, "dd.MM.yyyy HH:mm")}`;
      } else if (isDate(from)) {
        return `${format(from, "dd.MM.yyyy HH:mm")} - ...`;
      }
    }

    return "Select date";
  }
  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) setTempValue(value);
    }}>
      <DialogTrigger asChild>
        <Button variant="outline">{formatDateLabel(value, selectionMode)}</Button>
      </DialogTrigger>
      <DialogContent className="z-[99999] w-full max-w-full gap-1">
        <DialogHeader>
          <DialogTitle>Calendar</DialogTitle>
          <DialogDescription>{desc && desc}</DialogDescription>
        </DialogHeader>
        <PrimereactCalendar
          inline={inline}
          id="calendar"
          value={tempValue}
          onChange={(e) => setTempValue(e.value)}
          showTime={showTime}
          hourFormat="24"
          selectionMode={selectionMode}
          pt={{
            day: ({ context }: { context: CalendarDayContext }) => ({
              className: `
              ${context.inRange && !context.selected ? "!bg-secondary/10" : ""}
              ${context.selected ? "!bg-secondary !text-secondary-foreground !rounded-md" : ""} 
              p-1
            `,
              style: {
                ...(context.today && !context.selected && {
                  color: 'hsl(var(--primary-foreground))',
                  borderRadius: '0.375rem',
                  fontWeight: 'bold'
                }),
                ...(context.selected && {
                  backgroundColor: 'hsl(var(--secondary))',
                  color: 'hsl(var(--secondary-foreground))',
                  borderRadius: '0.375rem'
                }),
                ...(context.inRange && !context.selected && {
                  backgroundColor: 'hsl(var(--secondary) / 0.1)'
                })
              }
            })
          }}
        />
        <div className="text-muted-foreground">
          <strong>Selected:</strong> {formatDateLabel(tempValue, selectionMode)}
        </div>
        {showTime && selectionMode === "single" && tempValue instanceof Date && (
          <div className="text-muted-foreground">
            <strong>Time selected:</strong> {format(tempValue, "HH:mm:ss")}
          </div>
        )}
        {showTime && selectionMode === "range" && Array.isArray(tempValue) && (
          <div className="text-muted-foreground flex gap-2">
            <strong>Start time:</strong> {tempValue[0] instanceof Date ? format(tempValue[0], "HH:mm:ss") : "..."}
            <strong>End time:</strong> {tempValue[1] instanceof Date ? format(tempValue[1], "HH:mm:ss") : "..."}
          </div>
        )}
        <DialogFooter className="flex justify-between">
          <Button
            className="bg-teal-400"
            onClick={() => {
              onChange && onChange(normalizeCalendarValue(tempValue));
              setOpen(false);
            }}
          >
            Save Date
          </Button>
          <DialogClose asChild>
            <Button variant="outlineDestructive" onClick={() => setTempValue(value)}>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
