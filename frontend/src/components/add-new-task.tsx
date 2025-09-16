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

export default function AddNewTask() {
  const [selectedDate, setSelectedDate] = useState<CalendarValue>(new Date())

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Add task</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[70vw]">
          <DialogHeader>
            <DialogTitle>New Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Task name</Label>
              <Input id="name" name="name" placeholder="New task to do" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="details">Details</Label>
              <Textarea id="details" name="details" placeholder="Details about the task" />
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
            <Button className="bg-teal-400" type="submit">Save changes</Button>
            <DialogClose asChild>
              <Button variant="outlineDestructive">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
