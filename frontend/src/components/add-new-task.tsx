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
  DialogTrigger
} from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { createDailyTask } from "@/lib/dailyTasks"
import { Status, type DailyTasks } from "@/types"
import { useQueryClient } from "@tanstack/react-query"
import { normalizeCalendarValue } from "@/lib/utils"

export default function AddNewTask() {
  const [selectedDate, setSelectedDate] = useState<CalendarValue>(new Date())
  const [name, setName] = useState("")
  const [details, setDetails] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

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
    let isoDate: string | null = null;

    const normalizedDate = normalizeCalendarValue(selectedDate);

    if (normalizedDate instanceof Date) {
      isoDate = normalizedDate.toISOString();
    } else if (Array.isArray(normalizedDate)) {
      isoDate = normalizedDate[0].toISOString();
    }

    try {
      const taskData: DailyTasks = {
        id: "",
        name,
        description: details,
        date: isoDate || '',
        status: Status.NEW,
        tasks: [],
      }

      await createDailyTask(taskData)

      queryClient.invalidateQueries({ queryKey: ['allDailyTasks'] })

      setName("")
      setDetails("")
      setSelectedDate(new Date())
      setOpen(false)
    } catch (err: any) {
      setError(err.message || "Failed to create task")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add task</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[70vw]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New Task</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            {error && <p className="text-red-500">{error}</p>}
            <div className="grid gap-3">
              <Label htmlFor="name">Task name</Label>
              <Input
                id="name"
                name="name"
                placeholder="New task to do"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
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
            <div className="grid gap-3">
              <Label htmlFor="date">Date</Label>
              <Calendar
                showTime
                selectionMode="single"
                inline
                value={selectedDate}
                onChange={setSelectedDate}
              />
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <Button
              className="bg-teal-400"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
            <DialogClose asChild>
              <Button variant="outlineDestructive" onClick={() => setOpen(false)}>Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
