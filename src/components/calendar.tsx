import { useState, type AllHTMLAttributes } from "react";
import { Calendar as PrimereactCalendar } from "primereact/calendar";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { format } from "date-fns";
import type { Nullable } from "primereact/ts-helpers";

type CalendarValue = Nullable<Date | Date[] | (Date | null)[]>;

export default function Calendar({
  showTime,
  selectionMode = "single",
  desc,
}: {
  showTime?: boolean;
  selectionMode?: "single" | "multiple" | "range";
  desc?: string;
}) {
  const [dates, setDates] = useState<CalendarValue>(null);

  function formatDateLabel(value: CalendarValue, mode: "single" | "multiple" | "range"): string {
    if (!value) return "Select date";

    if (mode === "single" && value instanceof Date) {
      return format(value, showTime ? "dd.MM.yyyy HH:mm" : "dd.MM.yyyy");
    }
    if (mode === "multiple" && Array.isArray(value)) {
      return value
        .filter((d): d is Date => d !== null && d instanceof Date)
        .map((d) => format(d as string | number | Date, "dd.MM.yyyy"))
        .join(", ");
    }

    if (mode === "range" && Array.isArray(value)) {
      const [from, to] = value;
      if (from instanceof Date && to instanceof Date) {
        return `${format(from, "dd.MM.yyyy")} - ${format(to, "dd.MM.yyyy")}`;
      } else if (from instanceof Date) {
        return `${format(from, "dd.MM.yyyy")} - ...`;
      }
    }

    return "Select date";
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{formatDateLabel(dates, selectionMode)}</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-full sm:max-w-[85vw] md:max-w-[70vw] lg:max-w-[40vw]">
        <DialogHeader>
          <DialogTitle>Calendar</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>
        <PrimereactCalendar
          className="w-full max-w-full sm:max-w-[80vw] md:max-w-[70vw] lg:max-w-[40vw]"
          inline
          id="calendar"
          value={dates}
          onChange={(e) => setDates(e.value)}
          showTime={showTime}
          hourFormat="24"
          selectionMode={selectionMode}
          pt={{
            day: {
              className: ({ context }: { context: AllHTMLAttributes<HTMLDivElement> }) =>
                context.selected ? "bg-blue-500 rounded-md" : "",
            },
          }}
        />

        <div className="text-muted-foreground">
          <strong>Selected:</strong> {formatDateLabel(dates, selectionMode)}
        </div>

        {showTime && selectionMode === "single" && dates instanceof Date &&
          <div className="text-muted-foreground">
            <strong>Time selected:</strong> {format(dates, "HH:mm:ss")}
          </div>
        }

        {showTime && selectionMode === "range" && Array.isArray(dates) &&
          <div className="text-muted-foreground">
            <strong>Start time:</strong>{" "}
            {dates[0] instanceof Date ? format(dates[0], "HH:mm:ss") : "..."} <br />
            <strong>End time:</strong>{" "}
            {dates[1] instanceof Date ? format(dates[1], "HH:mm:ss") : "..."}
          </div>
        }
        <DialogFooter>
          <Button className=" bg-teal-400" type="submit">Save changes</Button>
          <DialogClose asChild>
            <Button variant="outlineDestructive">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
