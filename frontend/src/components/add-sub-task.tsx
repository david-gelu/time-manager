import { useState } from "react"
import Calendar, { type CalendarValue } from "./calendar"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { createSubTask } from "@/lib/dailyTasks"
import { Status, type DailyTasks, type Task } from "@/types"
import { useQueryClient } from "@tanstack/react-query"
import { normalizeCalendarValue } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./ui/dropdown-menu"

interface AddSubTaskProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: DailyTasks | null
}

export default function AddSubTask({ open: openModal, onOpenChange, task }: AddSubTaskProps) {
  const now = new Date()

  const defaultStart = new Date(now)
  defaultStart.setHours(9, 0, 0, 0)

  const defaultEnd = new Date(now)
  defaultEnd.setHours(19, 0, 0, 0)

  const [startDate, setStartDate] = useState<CalendarValue>(defaultStart)
  const [endDate, setEndDate] = useState<CalendarValue>(defaultEnd)
  const [name, setName] = useState("")
  const [details, setDetails] = useState("")
  const [status, setStatus] = useState<Status>(Status.NEW)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const queryClient = useQueryClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    if (!name.trim()) {
      setError("Task name is required")
      setIsSubmitting(false)
      return
    }
    if (!details.trim()) {
      setError("Task description is required")
      setIsSubmitting(false)
      return
    }

    const toLocalISOString = (date: Date) => {
      const tzOffset = date.getTimezoneOffset() * 60000
      return new Date(date.getTime() - tzOffset).toISOString().slice(0, 19)
    }

    const normalizedStart = normalizeCalendarValue(startDate)
    const normalizedEnd = normalizeCalendarValue(endDate)

    let isoStart = ""
    let isoEnd = ""

    if (normalizedStart instanceof Date) isoStart = toLocalISOString(normalizedStart)
    else if (Array.isArray(normalizedStart)) isoStart = toLocalISOString(normalizedStart[0])

    if (normalizedEnd instanceof Date) isoEnd = toLocalISOString(normalizedEnd)
    else if (Array.isArray(normalizedEnd)) isoEnd = toLocalISOString(normalizedEnd[0])

    try {
      const taskData: Task = {
        task_name: name,
        description: details,
        start_date: isoStart,
        end_date: isoEnd,
        status: status ?? Status.NEW,
      }

      await createSubTask(taskData, task?._id || "")

      queryClient.invalidateQueries({ queryKey: ['allDailyTasks'] })

      setName("")
      setDetails("")
      setStartDate(defaultStart)
      setEndDate(defaultEnd)
      onOpenChange(false)
    } catch (err: any) {
      setError(err.message || "Failed to create task")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={openModal} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Sub task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[70vw]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Subtask {task?.name ? `for ${task?.name}` : ""}</DialogTitle>
            <DialogDescription>Fill in the details below to create a new subtask</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 mt-4">
            {error && <p className="text-red-500">{error}</p>}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="name">Subtask name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="New task to do"
                  value={name}
                  maxLength={50}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <DropdownMenu >
                  <DropdownMenuTrigger asChild>
                    <Button className="w-full capitalize" variant="outline"> Selected status: {status}</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Select Status</DropdownMenuLabel>
                    {Object.values(Status).map(s => (
                      <DropdownMenuItem className="capitalize" key={s} onSelect={() => setStatus(s)} >
                        {s}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="details">Details</Label>
              <Textarea
                id="details"
                name="details"
                placeholder="Details about the task"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Start date</Label>
                <Calendar
                  showTime
                  selectionMode="single"
                  inline
                  value={startDate}
                  onChange={setStartDate}
                />
              </div>
              <div className="grid gap-2">
                <Label>End date</Label>
                <Calendar
                  showTime
                  selectionMode="single"
                  inline
                  value={endDate}
                  onChange={setEndDate}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-between mt-4">
            <Button
              className="bg-teal-400"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
            <DialogClose asChild>
              <Button variant="outlineDestructive" onClick={() => onOpenChange(false)}>Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog >
  )
}
