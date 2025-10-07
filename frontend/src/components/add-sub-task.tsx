import { useState } from "react"
import Calendar from "./calendar"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "./ui/dropdown-menu"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "./ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

interface AddSubTaskProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: DailyTasks | null
}

const formSchema = z.object({
  name: z.string().min(1, "Subtask name is required").max(50, "Maximum 50 characters"),
  details: z.string().min(1, "Task description is required"),
  startDate: z.date(),
  endDate: z.date(),
  status: z.nativeEnum(Status)
}).refine((data) => data.endDate >= data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"]
})

type FormValues = z.infer<typeof formSchema>

export default function AddSubTask({ open: openModal, onOpenChange, task }: AddSubTaskProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()

  const defaultStart = new Date()
  defaultStart.setHours(9, 0, 0, 0)

  const defaultEnd = new Date()
  defaultEnd.setHours(19, 0, 0, 0)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      details: "",
      startDate: defaultStart,
      endDate: defaultEnd,
      status: Status.NEW
    }
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

    try {
      const toLocalISOString = (date: Date) => {
        const tzOffset = date.getTimezoneOffset() * 60000
        return new Date(date.getTime() - tzOffset).toISOString().slice(0, 19)
      }

      const taskData: Task = {
        task_name: data.name,
        description: data.details,
        start_date: toLocalISOString(data.startDate),
        end_date: toLocalISOString(data.endDate),
        status: data.status
      }

      await createSubTask(taskData, task?._id || "")

      queryClient.invalidateQueries({ queryKey: ["allDailyTasks"] })

      form.reset()
      onOpenChange(false)
    } catch (err: any) {
      console.error("Failed to create subtask:", err)
      form.setError("root", {
        type: "manual",
        message: err.message || "Failed to create subtask"
      })
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>
                Add Subtask {task?.name ? `for ${task?.name}` : ""}
              </DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new subtask
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 mt-4">
              {form.formState.errors.root && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.root.message}
                </p>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtask name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="New task to do"
                          maxLength={50}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button className="w-full capitalize" variant="outline">
                            Selected status: {field.value}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Select Status</DropdownMenuLabel>
                          {Object.values(Status).map((s) => (
                            <DropdownMenuItem
                              key={s}
                              className="capitalize"
                              onSelect={() => field.onChange(s)}
                            >
                              {s}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Details about the task"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start date</FormLabel>
                      <FormControl>
                        <Calendar
                          showTime
                          selectionMode="single"
                          inline
                          value={field.value}
                          onChange={(val) => {
                            const normalized = normalizeCalendarValue(val)
                            if (normalized instanceof Date) {
                              field.onChange(normalized)
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End date</FormLabel>
                      <FormControl>
                        <Calendar
                          showTime
                          selectionMode="single"
                          inline
                          value={field.value}
                          onChange={(val) => {
                            const normalized = normalizeCalendarValue(val)
                            if (normalized instanceof Date) {
                              field.onChange(normalized)
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <Button
                  variant="outlineDestructive"
                  onClick={() => onOpenChange(false)}
                >
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