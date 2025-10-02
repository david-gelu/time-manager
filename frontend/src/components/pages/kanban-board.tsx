import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { useAllTasksWithStatusCompleted, useAllTasksWithStatusInProgress, useAllTasksWithStatusNew } from "@/lib/queries"
import { Status } from "@/types"
import { Separator } from "../ui/separator"
import { Badge } from "../ui/badge"
import { format } from "date-fns"
import { useState } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { updateSubTaskStatus } from "@/lib/dailyTasks"
import { useQueryClient } from "@tanstack/react-query"

const statuses = [
  { value: Status.NEW, label: Status.NEW },
  { value: Status.IN_PROGRESS, label: Status.IN_PROGRESS },
  { value: Status.COMPLETED, label: Status.COMPLETED }
]


const KanbanBoard = () => {
  const [statusValue, setStatusValue] = useState<Record<string | number, string>>({})
  const queryClient = useQueryClient()
  const { data: statusNew = [] } = useAllTasksWithStatusNew()
  const { data: statusInProgress = [] } = useAllTasksWithStatusInProgress()
  const { data: statusCompleted = [] } = useAllTasksWithStatusCompleted()

  return (
    <div className="w-full p-4 space-y-4">
      <h1>KanbanBoard placeholder</h1>
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[15rem] max-h-[83dvh] rounded-lg border"
      >
        <ResizablePanel defaultSize={33.34}>
          <div className="flex flex-col gap-1 h-full p-2 pt-0 overflow-y-auto">
            <div className="font-semibold text-center capitalize sticky top-0 bg-background w-full min-h-[2.5rem] leading-10 rounded shadow">Status: {Status.NEW}</div>
            {statusNew.map((task) =>
              <div className="flex flex-col gap-2 border p-2 rounded shadow" key={task._id}>
                <Badge variant='secondary'> {task.parentName}</Badge>
                <span>{task.task_name}</span>
                <Separator orientation="horizontal" />
                <Select
                  value={statusValue[task._id as string] || task.status}
                  onValueChange={async (val: string) => {
                    setStatusValue(prev => ({ ...prev, [task._id as string]: val }))
                    await updateSubTaskStatus(task._id as string, val as Status)
                    queryClient.invalidateQueries({ queryKey: ['allTasksWithStatusNew'] })
                    if (val === Status.IN_PROGRESS) {
                      queryClient.invalidateQueries({ queryKey: ['allTasksWithStatusInProgress'] })
                    } else {
                      queryClient.invalidateQueries({ queryKey: ['allTasksWithStatusCompleted'] })
                    }
                  }}
                >
                  <SelectTrigger className="w-full cursor-pointer capitalize">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {statuses.map(status => (
                        <SelectItem key={status.value} value={status.value} className="capitalize">
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Separator orientation="horizontal" />
                <div className="flex justify-between">
                  <div className="flex flex-col text-xs text-muted-foreground">
                    <span>Start: {format(task.start_date, 'dd-MM-yyyy')}</span>
                    <span className="ml-[5ch]">{format(task.start_date, 'HH:mm')}</span>
                  </div>
                  <div className="flex flex-col text-xs text-muted-foreground">
                    <span>End: {format(task.end_date, 'dd-MM-yyyy')}</span>
                    <span className="ml-[4ch]">{format(task.end_date, 'HH:mm')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={33.33}>
          <div className="flex flex-col gap-1 h-full p-2 pt-0 overflow-y-auto">
            <div className="font-semibold text-center capitalize sticky top-0 bg-background w-full min-h-[2.5rem] leading-10 rounded shadow">Status: {Status.IN_PROGRESS}</div>
            {statusInProgress.map((task) =>
              <div className="flex flex-col gap-2 border p-2 rounded shadow" key={task._id}>
                <Badge variant='secondary'> {task.parentName}</Badge>
                <span>{task.task_name}</span>
                <Separator orientation="horizontal" />
                <Select
                  value={statusValue[task._id as string] || task.status}
                  onValueChange={async (val: string) => {
                    setStatusValue(prev => ({ ...prev, [task._id as string]: val }))
                    await updateSubTaskStatus(task._id as string, val as Status)
                    queryClient.invalidateQueries({ queryKey: ['allTasksWithStatusInProgress'] })
                    if (val === Status.NEW) {
                      queryClient.invalidateQueries({ queryKey: ['allTasksWithStatusNew'] })
                    } else {
                      queryClient.invalidateQueries({ queryKey: ['allTasksWithStatusCompleted'] })
                    }
                  }}
                >
                  <SelectTrigger className="w-full cursor-pointer capitalize">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {statuses.map(status => (
                        <SelectItem key={status.value} value={status.value} className="capitalize">
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Separator orientation="horizontal" />
                <div className="flex justify-between">
                  <div className="flex flex-col text-xs text-muted-foreground">
                    <span>{format(task.start_date, 'dd-MM-yyyy')}</span>
                    <span>{format(task.start_date, 'HH:mm')}</span>
                  </div>
                  <div className="flex flex-col text-xs text-muted-foreground">
                    <span>{format(task.end_date, 'dd-MM-yyyy')}</span>
                    <span>{format(task.end_date, 'HH:mm')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={33.33}>
          <div className="flex flex-col gap-1 h-full p-2 pt-0 overflow-y-auto">
            <div className="font-semibold text-center capitalize sticky top-0 bg-background w-full min-h-[2.5rem] leading-10 rounded shadow">Status: {Status.COMPLETED}</div>
            {statusCompleted.map((task) =>
              <div className="flex flex-col gap-2 border p-2 rounded shadow" key={task._id}>
                <Badge variant='secondary'> {task.parentName}</Badge>
                <span>{task.task_name}</span>
                <Separator orientation="horizontal" />
                <Select
                  value={statusValue[task._id as string] || task.status}
                  onValueChange={async (val: string) => {
                    setStatusValue(prev => ({ ...prev, [task._id as string]: val }))
                    await updateSubTaskStatus(task._id as string, val as Status)
                    queryClient.invalidateQueries({ queryKey: ['allTasksWithStatusCompleted'] })
                    if (val === Status.IN_PROGRESS) {
                      queryClient.invalidateQueries({ queryKey: ['allTasksWithStatusInProgress'] })
                    } else {
                      queryClient.invalidateQueries({ queryKey: ['allTasksWithStatusNew'] })
                    }
                  }}
                >
                  <SelectTrigger className="w-full cursor-pointer capitalize">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {statuses.map(status => (
                        <SelectItem key={status.value} value={status.value} className="capitalize">
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Separator orientation="horizontal" />
                <div className="flex justify-between">
                  <div className="flex flex-col text-xs text-muted-foreground">
                    <span>{format(task.start_date, 'dd-MM-yyyy')}</span>
                    <span>{format(task.start_date, 'HH:mm')}</span>
                  </div>
                  <div className="flex flex-col text-xs text-muted-foreground">
                    <span>{format(task.end_date, 'dd-MM-yyyy')}</span>
                    <span>{format(task.end_date, 'HH:mm')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default KanbanBoard