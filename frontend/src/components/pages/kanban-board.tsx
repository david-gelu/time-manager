import { useEffect, useState } from "react";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Status, type Task } from "@/types";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { updateSubTaskStatus } from "@/lib/dailyTasks";
import {
  useAllTasksWithStatusNew,
  useAllTasksWithStatusInProgress,
  useAllTasksWithStatusCompleted,
} from "@/lib/queries";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "../ui/input";
import EditTask from "../edit-tasks";
import { Button } from "../ui/button";
import { motion } from 'framer-motion'
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { SubTaskDetails } from "../sub-task-details";

const statuses = [
  { value: Status.NEW, label: Status.NEW },
  { value: Status.IN_PROGRESS, label: Status.IN_PROGRESS },
  { value: Status.COMPLETED, label: Status.COMPLETED },
];

export default function KanbanBoard() {
  const queryClient = useQueryClient();
  const [statusValue, setStatusValue] = useState<Record<string, string>>({});
  const [openEditModal, setOpenEditModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const [searchNew, setSearchNew] = useState("");
  const [searchInProgress, setSearchInProgress] = useState("");
  const [searchCompleted, setSearchCompleted] = useState("");

  const debouncedSearchNew = useDebounce(searchNew, 300);
  const debouncedSearchInProgress = useDebounce(searchInProgress, 300);
  const debouncedSearchCompleted = useDebounce(searchCompleted, 300);

  const { data: statusNew = [] } = useAllTasksWithStatusNew(debouncedSearchNew);
  const { data: statusInProgress = [] } = useAllTasksWithStatusInProgress(debouncedSearchInProgress);
  const { data: statusCompleted = [] } = useAllTasksWithStatusCompleted(debouncedSearchCompleted);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['allTasksWithStatusNew'] })
    queryClient.invalidateQueries({ queryKey: ['allTasksWithStatusInProgress'] })
    queryClient.invalidateQueries({ queryKey: ['allTasksWithStatusCompleted'] })
  }, [openEditModal, selectedTask])


  return (
    <div className="w-full p-4 flex flex-col gap-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-[15rem] max-h-[90dvh] rounded-lg border"
        >
          <ResizablePanel defaultSize={33.34}>
            <div className="bg-card flex flex-col gap-1 h-full p-2 pt-0 overflow-y-auto">
              <div className="sticky top-0 bg-card w-full rounded shadow py-2 z-10">
                <div className="flex flex-wrap gap-2 justify-between items-center">
                  <span className="font-semibold capitalize min-w-[150px]">Status: {Status.NEW}</span>
                  <Input
                    type="text"
                    placeholder="Search..."
                    className="p-1 border rounded flex-1 min-w-[120px]"
                    value={searchNew}
                    onChange={e => setSearchNew(e.target.value)}
                  />
                </div>
              </div>
              {statusNew.map((task) =>
                <div className="flex flex-col gap-2 border p-2 rounded shadow" key={task._id}>
                  <Badge variant='default'> {task.parentName}</Badge>
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <span>{task.task_name}</span>
                    <Button size="sm" variant="outline" onClick={() => { setSelectedTask(task); setOpenEditModal(true) }}>Edit</Button>
                    <SubTaskDetails taskId={task._id as string} />
                  </div>
                  <Separator orientation="horizontal" />
                  <Select
                    value={statusValue[task._id as string] || task.status}
                    onValueChange={async (val: string) => {
                      setStatusValue(prev => ({ ...prev, [task._id as string]: val }))
                      await updateSubTaskStatus(task._id as string, val as Status)
                      queryClient.invalidateQueries({ queryKey: ['allTasksWithStatusNew'] })
                      if (val === Status.IN_PROGRESS) queryClient.invalidateQueries({ queryKey: ['allTasksWithStatusInProgress'] })
                      else queryClient.invalidateQueries({ queryKey: ['allTasksWithStatusCompleted'] })
                    }}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild className="w-full">
                        <SelectTrigger className="w-full cursor-pointer capitalize">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </TooltipTrigger>
                      <TooltipContent side='left' className='cursor-pointer'>
                        Change status.
                      </TooltipContent>
                    </Tooltip>
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
                    <div className="flex flex-col text-xs">
                      <span>Start: {format(task.start_date, 'dd-MM-yyyy')}</span>
                      <span className="ml-[5ch]">{format(task.start_date, 'HH:mm')}</span>
                    </div>
                    <div className="flex flex-col text-xs">
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
            <div className="bg-card flex flex-col gap-1 h-full p-2 pt-0 overflow-y-auto">
              <div className="sticky top-0 bg-card w-full rounded shadow py-2 z-10">
                <div className="flex flex-wrap gap-2 justify-between items-center">
                  <span className="font-semibold capitalize min-w-[150px]">Status: {Status.IN_PROGRESS}</span>
                  <Input
                    type="text"
                    placeholder="Search..."
                    className="p-1 border rounded flex-1 min-w-[120px]"
                    value={searchInProgress}
                    onChange={e => setSearchInProgress(e.target.value)}
                  />
                </div>
              </div>
              {statusInProgress.map((task) =>
                <div className="flex flex-col gap-2 border p-2 rounded shadow" key={task._id}>
                  <Badge variant='default'> {task.parentName}</Badge>
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <span>{task.task_name}</span>
                    <Button size="sm" variant="outline" onClick={() => { setSelectedTask(task); setOpenEditModal(true) }}>Edit</Button>
                    <SubTaskDetails taskId={task._id as string} />
                  </div>
                  <Separator orientation="horizontal" />
                  <Select
                    value={statusValue[task._id as string] || task.status}
                    onValueChange={async (val: string) => {
                      setStatusValue(prev => ({ ...prev, [task._id as string]: val }))
                      await updateSubTaskStatus(task._id as string, val as Status)
                      queryClient.invalidateQueries({ queryKey: ['allTasksWithStatusInProgress'] })
                      if (val === Status.NEW) queryClient.invalidateQueries({ queryKey: ['allTasksWithStatusNew'] })
                      else queryClient.invalidateQueries({ queryKey: ['allTasksWithStatusCompleted'] })
                    }}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild className="w-full">
                        <SelectTrigger className="w-full cursor-pointer capitalize">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </TooltipTrigger>
                      <TooltipContent side='left' className='cursor-pointer'>
                        Change status.
                      </TooltipContent>
                    </Tooltip>
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
                    <div className="flex flex-col text-xs">
                      <span>Start: {format(task.start_date, 'dd-MM-yyyy')}</span>
                      <span className="ml-[5ch]">{format(task.start_date, 'HH:mm')}</span>
                    </div>
                    <div className="flex flex-col text-xs">
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
            <div className="bg-card flex flex-col gap-1 h-full p-2 pt-0 overflow-y-auto">
              <div className="sticky top-0 bg-card w-full rounded shadow py-2 z-10">
                <div className="flex flex-wrap gap-2 justify-between items-center">
                  <span className="font-semibold capitalize min-w-[150px]">Status: {Status.COMPLETED}</span>
                  <Input
                    type="text"
                    placeholder="Search..."
                    className="p-1 border rounded flex-1 min-w-[120px]"
                    value={searchCompleted}
                    onChange={e => setSearchCompleted(e.target.value)}
                  />
                </div>
              </div>
              {statusCompleted.map((task) =>
                <div className="flex flex-col gap-2 border p-2 rounded shadow" key={task._id}>
                  <Badge variant='default'> {task.parentName}</Badge>
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <span>{task.task_name}</span>
                    <Button size="sm" variant="outline" onClick={() => { setSelectedTask(task); setOpenEditModal(true) }}>Edit</Button>
                    <SubTaskDetails taskId={task._id as string} />
                  </div>
                  <Separator orientation="horizontal" />
                  <Select
                    value={statusValue[task._id as string] || task.status}
                    onValueChange={async (val: string) => {
                      setStatusValue(prev => ({ ...prev, [task._id as string]: val }))
                      await updateSubTaskStatus(task._id as string, val as Status)
                      queryClient.invalidateQueries({ queryKey: ['allTasksWithStatusCompleted'] })
                      if (val === Status.IN_PROGRESS) queryClient.invalidateQueries({ queryKey: ['allTasksWithStatusInProgress'] })
                      else queryClient.invalidateQueries({ queryKey: ['allTasksWithStatusNew'] })
                    }}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild className="w-full">
                        <SelectTrigger className="w-full cursor-pointer capitalize">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </TooltipTrigger>
                      <TooltipContent side='left' className='cursor-pointer'>
                        Change status.
                      </TooltipContent>
                    </Tooltip>
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
                    <div className="flex flex-col text-xs">
                      <span>Start: {format(task.start_date, 'dd-MM-yyyy')}</span>
                      <span className="ml-[5ch]">{format(task.start_date, 'HH:mm')}</span>
                    </div>
                    <div className="flex flex-col text-xs">
                      <span>End: {format(task.end_date, 'dd-MM-yyyy')}</span>
                      <span className="ml-[4ch]">{format(task.end_date, 'HH:mm')}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </motion.div>
      {openEditModal && <EditTask open={openEditModal} onOpenChange={setOpenEditModal} subTask={selectedTask as Task} />}
    </div>
  );
}
