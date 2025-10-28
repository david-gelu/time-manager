import { useState } from "react";
import { Calendar, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [inputValue, setInputValue] = useState(formatDate(new Date()));
  const [viewMonth, setViewMonth] = useState(new Date());

  function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function parseDate(dateStr: string) {
    return new Date(dateStr);
  }

  function formatDisplay(date: Date) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  function getWeekNumber(date: Date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }


  function getStartOfWeek(date: Date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  function getStartOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  function getEndOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  function isSameDay(date1: Date, date2: Date) {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }

  function addDays(date: Date, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  function addMonths(date: Date, months: number) {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  const getWeeksInMonth = (monthDate: Date) => {
    const startOfMonth = getStartOfMonth(monthDate);
    const endOfMonth = getEndOfMonth(monthDate);

    const weeks = [];
    let currentWeek = getStartOfWeek(startOfMonth);

    while (currentWeek <= endOfMonth || currentWeek.getMonth() === monthDate.getMonth()) {
      const weekDays = [];
      const weekNumber = getWeekNumber(currentWeek);

      for (let i = 0; i < 7; i++) {
        const day = addDays(currentWeek, i);
        const today = new Date();
        weekDays.push({
          date: day,
          isCurrentMonth: day.getMonth() === monthDate.getMonth(),
          isToday: isSameDay(day, today),
          isSelected: isSameDay(day, parseDate(selectedDate))
        });
      }

      weeks.push({
        weekNumber,
        days: weekDays
      });

      currentWeek = addDays(currentWeek, 7);

      if (weeks.length > 6) break;
    }

    return weeks;
  };

  const handleDateSearch = () => {
    if (inputValue && inputValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
      setSelectedDate(inputValue);
      setViewMonth(parseDate(inputValue));
    }
  };

  const weeks = getWeeksInMonth(viewMonth);
  const selectedWeek = getWeekNumber(parseDate(selectedDate));

  const goToPreviousMonth = () => {
    setViewMonth(addMonths(viewMonth, -1));
  };

  const goToNextMonth = () => {
    setViewMonth(addMonths(viewMonth, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setSelectedDate(formatDate(today));
    setInputValue(formatDate(today));
    setViewMonth(today);
  };

  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const currentMonthDisplay = `${months[viewMonth.getMonth()]} ${viewMonth.getFullYear()}`;

  return (
    <div>
      <div className="mx-auto flex flex-col gap-6">
        <Card className="shadow-lg">
          <CardHeader className="rounded-t-lg">
            <CardTitle className="flex items-center gap-2 ">
              <Calendar className="w-4 h-4" />
              Calendar per week
            </CardTitle>
            <CardDescription>
              Search for a date to see what week of the year it is
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex gap-3">
              <Input
                type="date"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleDateSearch}> Search </Button>
              <Button onClick={goToToday} variant="outline">  Today </Button>
            </div>

            {selectedDate && (
              <div className="py-4 rounded">
                <p className="font-semibold"> Selected date: {formatDisplay(parseDate(selectedDate))} </p>
                <p className="mt-2">
                  Week {selectedWeek} of {parseDate(selectedDate).getFullYear()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button onClick={goToPreviousMonth} variant="outline">
                ← Prev month
              </Button>
              <CardTitle>
                {currentMonthDisplay}
              </CardTitle>
              <Button onClick={goToNextMonth} variant="outline">
                Next month →
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-8 gap-1 font-semibold text-center text-xs">
                <div className="py-2">Week</div>
                <div className="py-2">Mon</div>
                <div className="py-2">Tue</div>
                <div className="py-2">Wed</div>
                <div className="py-2">Thu</div>
                <div className="py-2">Fri</div>
                <div className="py-2">Sat</div>
                <div className="py-2">Sun</div>
              </div>

              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="grid grid-cols-8 gap-1">
                  <div className="flex items-center justify-center text-secondary-foreground shadow-lg font-bold rounded-lg text-xs">
                    W {week.weekNumber} <ChevronRight className="w-3 h-3" />
                  </div>
                  {week.days.map((day, dayIdx) => (
                    <Button
                      key={dayIdx}
                      onClick={() => {
                        const dateStr = formatDate(day.date);
                        setSelectedDate(dateStr);
                        setInputValue(dateStr);
                      }}
                      variant={
                        day.isCurrentMonth && !day.isToday && !day.isSelected ?
                          "outline" :
                          day.isToday && !day.isSelected ?
                            "link" :
                            day.isSelected ?
                              "default" :
                              "ghost"
                      }
                      className={`rounded-lg text-center transition-all duration-200 font-medium hover:cursor-pointer${day.isToday && !day.isSelected ? ' border border-primary' : ''}`}
                    >
                      <div>{day.date.getDate()}</div>
                    </Button>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}