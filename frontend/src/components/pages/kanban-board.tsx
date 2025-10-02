import { useState } from "react";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Status, type SubTaskWithParent } from "@/types";
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

const statuses = [
  { value: Status.NEW, label: Status.NEW },
  { value: Status.IN_PROGRESS, label: Status.IN_PROGRESS },
  { value: Status.COMPLETED, label: Status.COMPLETED },
];

export default function KanbanBoard() {
  const queryClient = useQueryClient();
  const [statusValue, setStatusValue] = useState<Record<string, string>>({});

  const [searchNew, setSearchNew] = useState("");
  const [searchInProgress, setSearchInProgress] = useState("");
  const [searchCompleted, setSearchCompleted] = useState("");

  const debouncedSearchNew = useDebounce(searchNew, 300);
  const debouncedSearchInProgress = useDebounce(searchInProgress, 300);
  const debouncedSearchCompleted = useDebounce(searchCompleted, 300);

  const { data: statusNew = [] } = useAllTasksWithStatusNew(debouncedSearchNew);
  const { data: statusInProgress = [] } = useAllTasksWithStatusInProgress(debouncedSearchInProgress);
  const { data: statusCompleted = [] } = useAllTasksWithStatusCompleted(debouncedSearchCompleted);

  const renderTaskPanel = (tasks: SubTaskWithParent[], status: Status, search: string, setSearch: (val: string) => void) => (
    <div className="flex flex-col gap-1 h-full p-2 pt-0 overflow-y-auto">

      <div className="sticky top-0 bg-background w-full rounded shadow p-2 z-10">
        <div className="flex flex-wrap gap-2 justify-between items-center">
          <span className="font-semibold text-center capitalize min-w-[150px]">Status: {status}</span>
          <Input
            type="text"
            placeholder="Search..."
            className="p-1 border rounded flex-1 max-w-[20rem]"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {tasks.map(task => (
        <div key={task._id} className="flex flex-col gap-2 border p-2 rounded shadow">
          <Badge variant="secondary" className="whitespace-normal break-words max-w-full">{task.parentName}</Badge>
          <span>{task.task_name}</span>
          <Separator orientation="horizontal" />
          <Select
            value={statusValue[task._id as string] || task.status}
            onValueChange={async val => {
              setStatusValue(prev => ({ ...prev, [task._id as string]: val }));
              await updateSubTaskStatus(task._id as string, val as Status);
              queryClient.invalidateQueries({ queryKey: ['allTasksWithStatusNew'] });
              queryClient.invalidateQueries({ queryKey: ['allTasksWithStatusInProgress'] });
              queryClient.invalidateQueries({ queryKey: ['allTasksWithStatusCompleted'] });
            }}
          >
            <SelectTrigger className="w-full cursor-pointer capitalize">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {statuses.map(s => (
                  <SelectItem key={s.value} value={s.value} className="capitalize">
                    {s.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Separator orientation="horizontal" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <div className="flex flex-col">
              <span>Start: {format(task.start_date, 'dd-MM-yyyy')}</span>
              <span>{format(task.start_date, 'HH:mm')}</span>
            </div>
            <div className="flex flex-col">
              <span>End: {format(task.end_date, 'dd-MM-yyyy')}</span>
              <span>{format(task.end_date, 'HH:mm')}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full p-4 space-y-4">
      <ResizablePanelGroup direction="horizontal" className="min-h-[15rem] max-h-[88dvh] rounded-lg border">
        <ResizablePanel defaultSize={33.34}>
          {renderTaskPanel(statusNew, Status.NEW, searchNew, setSearchNew)}
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={33.33}>
          {renderTaskPanel(statusInProgress, Status.IN_PROGRESS, searchInProgress, setSearchInProgress)}
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={33.33}>
          {renderTaskPanel(statusCompleted, Status.COMPLETED, searchCompleted, setSearchCompleted)}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
