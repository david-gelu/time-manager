import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import Calendar, { type CalendarValue } from "./calendar"
import { normalizeCalendarValue } from "@/lib/utils"
import { createDailyTask } from "@/lib/dailyTasks"
import { Status, type DailyTasks } from "@/types"

const taskSchema = z.object({
  name: z.string().min(1, "Task name is required").max(15, "Max 15 characters"),
  description: z.string().min(1, "Task description is required"),
  date: z.date(),
})

type TaskFormValues = z.infer<typeof taskSchema>

export default function AddNewTask() {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: "",
      description: "",
      date: new Date(),
    },
  })

  const onSubmit = async (values: TaskFormValues) => {
    try {
      const taskData: DailyTasks = {
        _id: "",
        name: values.name,
        description: values.description,
        date: values.date.toISOString(),
        status: Status.NEW,
        tasks: [],
      }

      await createDailyTask(taskData)
      queryClient.invalidateQueries({ queryKey: ["allDailyTasks"] })

      form.reset()
      setOpen(false)
    } catch (err: any) {
      console.error(err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Daily Task</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[70vw]">
        <DialogHeader>
          <DialogTitle>Add Daily Task</DialogTitle>
          <DialogDescription>Fill in the details below to create a new task.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task name</FormLabel>
                  <FormControl>
                    <Input placeholder="New task to do" {...field} maxLength={15} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Details</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Details about the task" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Calendar
                      showTime
                      selectionMode="single"
                      inline
                      value={field.value}
                      onChange={(value: CalendarValue) => {
                        const normalized = normalizeCalendarValue(value)
                        if (normalized instanceof Date) field.onChange(normalized)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-between pt-4">
              <Button
                className="bg-teal-400"
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Saving..." : "Save changes"}
              </Button>

              <DialogClose asChild>
                <Button variant="outlineDestructive" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
