import { useState } from "react"
import Calendar, { type CalendarValue } from "./calendar"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { useQueryClient } from "@tanstack/react-query"
import { normalizeCalendarValue } from "@/lib/utils"
import { Status, type DailyTasks, type Task } from "@/types"
import { updateSubTask, updateDailyTask } from "@/lib/dailyTasks"

interface EditTaskProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dailyTask?: DailyTasks
  subTask?: Task
}

export default function EditTask({ open, onOpenChange, dailyTask, subTask }: EditTaskProps) {
  const now = new Date()

  const defaultStart = subTask?.start_date ? new Date(subTask.start_date) : new Date(now.setHours(9, 0, 0, 0))
  const defaultEnd = subTask?.end_date ? new Date(subTask.end_date) : new Date(now.setHours(19, 0, 0, 0))
  const defaultDate = dailyTask?.date ? new Date(dailyTask?.date) : new Date()

  const [startDate, setStartDate] = useState<CalendarValue>(defaultStart)
  const [endDate, setEndDate] = useState<CalendarValue>(defaultEnd)
  const [date, setDate] = useState<CalendarValue>(defaultDate)

  const [name, setName] = useState(subTask?.task_name || dailyTask?.name || "")
  const [details, setDetails] = useState(subTask?.description || dailyTask?.description || "")
  const [status, setStatus] = useState<Status>(subTask?.status || dailyTask?.status || Status.NEW)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const queryClient = useQueryClient()
  const isSubTask = !!subTask

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    if (!name.trim() || !details.trim()) {
      setError("Name and description are required")
      setIsSubmitting(false)
      return
    }

    const toLocalISOString = (date: Date) => {
      const tzOffset = date.getTimezoneOffset() * 60000
      return new Date(date.getTime() - tzOffset).toISOString().slice(0, 19)
    }

    const normalizedStart = normalizeCalendarValue(startDate)
    const normalizedEnd = normalizeCalendarValue(endDate)
    const normalizedDate = normalizeCalendarValue(date);

    let isoStart = ""
    let isoEnd = ""
    let isoDate = ""
    if (normalizedStart instanceof Date) isoStart = toLocalISOString(normalizedStart)
    else if (Array.isArray(normalizedStart)) isoStart = toLocalISOString(normalizedStart[0])

    if (normalizedEnd instanceof Date) isoEnd = toLocalISOString(normalizedEnd)
    else if (Array.isArray(normalizedEnd)) isoEnd = toLocalISOString(normalizedEnd[0])

    if (normalizedDate instanceof Date) isoDate = toLocalISOString(normalizedDate)
    else if (Array.isArray(normalizedDate)) isoDate = toLocalISOString(normalizedDate[0])

    try {
      const subTaskData: Task = {
        _id: subTask?._id || '',
        task_name: name,
        description: details,
        start_date: isoStart,
        end_date: isoEnd,
        status: status ?? Status.NEW,
      }

      const dailyTaskData: DailyTasks = {
        _id: dailyTask?._id || '',
        name,
        description: details,
        date: isoDate,
        status: status ?? Status.NEW,
        tasks: dailyTask?.tasks || [],
      }

      try {
        if (isSubTask && subTask?._id) {
          await updateSubTask(subTask._id, subTaskData)
        } else if (dailyTask?._id) {
          await updateDailyTask(dailyTask._id, dailyTaskData)
        }

        queryClient.invalidateQueries({ queryKey: ['allDailyTasks'] })
        setName("")
        setDetails("")
        setStartDate(defaultStart)
        setEndDate(defaultEnd)
        setDate(defaultDate)
        setStatus(Status.NEW)
        onOpenChange(false)
      } catch (err: any) {
        setError(err.message || "Failed to save task")
      } finally {
        setIsSubmitting(false)
      }
    } catch (err: any) {
      setError(err.message || "Failed to save task")
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[70vw]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{"Edit"} {isSubTask ? "Subtask" : "Task"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 mt-4">
            {error && <p className="text-red-500">{error}</p>}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input value={name} onChange={e => setName(e.target.value)} maxLength={50} />
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-full capitalize" variant="outline">{status}</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Select Status</DropdownMenuLabel>
                    {Object.values(Status).map(s => (
                      <DropdownMenuItem key={s} onSelect={() => setStatus(s)} className="capitalize">
                        {s}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Details</Label>
              <Textarea value={details} onChange={e => setDetails(e.target.value)} />
            </div>

            {isSubTask ? <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Start Date</Label>
                <Calendar inline value={startDate} onChange={setStartDate} showTime selectionMode="single" />
              </div>

              <div className="grid gap-2">
                <Label>End Date</Label>
                <Calendar inline value={endDate} onChange={setEndDate} showTime selectionMode="single" />
              </div>
            </div> :
              <div className="grid gap-2">
                <Label>Date</Label>
                <Calendar inline value={date} onChange={setDate} showTime selectionMode="single" />
              </div>
            }
          </div>

          <DialogFooter className="flex justify-between mt-4">
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save"}</Button>
            <DialogClose asChild>
              <Button variant="outlineDestructive">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
