"use client";

import { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { Status, type Task } from "@/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SubTaskDetails } from "@/components/sub-task-details";

interface Props {
  tasks: Task[];
  onDelete?: (id: string, name: string) => void;
  onEdit?: (task: Task) => void;
  onStatusChange?: (id: string, status: string) => void;
}

const DEFAULT_WIDTHS = {
  name: 16.67,
  description: 16.67,
  status: 16.67,
  start: 16.67,
  end: 16.67,
  actions: 16.67
};

export function ResizableSubTasksTable({
  tasks = [],
  onDelete,
  onEdit,
  onStatusChange
}: Props) {

  const LOCAL_STORAGE_KEY = "resizable_subtasks_colWidths";

  const getInitialWidths = () => {
    if (typeof window === "undefined") return DEFAULT_WIDTHS;
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_WIDTHS;
  };

  const [colWidths, setColWidths] = useState(getInitialWidths);

  const setWidth = (key: keyof typeof DEFAULT_WIDTHS, size: number) => {
    setColWidths((prev: {
      name: number;
      description: number;
      status: number;
      start: number;
      end: number;
      actions: number;
    }) => {
      const updated = { ...prev, [key]: size };
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  return (
    <div className="flex flex-col border rounded-md overflow-hidden">
      {tasks.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">No sub tasks available</div>
      ) : (
        <>
          <div >
            <ResizablePanelGroup direction="horizontal" className="min-w-full">
              <ResizablePanel minSize={10} defaultSize={colWidths.name} onResize={(e) => setWidth("name", e)}>
                <div className="flex flex-col">
                  <div className="sticky top-0 z-10 border-b bg-secondary p-2 font-semibold text-sm">
                    Subtask name
                  </div>
                  {tasks.map((task, i) => (
                    <Tooltip key={`name-${i}`}>
                      <TooltipTrigger asChild>
                        <div className="p-2 border-b min-h-[3.5rem] flex items-center text-sm cursor-default">
                          <span className="truncate w-full">{task.task_name}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p className="font-semibold">Subtask name:</p>
                        <p>{task.task_name}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel minSize={10} defaultSize={colWidths.description} onResize={(e) => setWidth("description", e)}>
                <div className="flex flex-col">
                  <div className="sticky top-0 z-10 border-b bg-secondary p-2 font-semibold text-sm">
                    Description
                  </div>
                  {tasks.map((task, i) => (
                    <Tooltip key={`desc-${i}`}>
                      <TooltipTrigger asChild>
                        <div className="p-2 border-b min-h-[3.5rem] flex items-center text-sm cursor-default">
                          <span className="truncate w-full">{task.description}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p className="font-semibold">Description:</p>
                        <p>{task.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel minSize={10} defaultSize={colWidths.status} onResize={(e) => setWidth("status", e)}>
                <div className="flex flex-col">
                  <div className="sticky top-0 z-10 border-b bg-secondary p-2 font-semibold text-sm">
                    Status
                  </div>
                  {tasks.map((task, i) => (
                    <Tooltip key={`status-${i}`}>
                      <TooltipTrigger asChild>
                        <div className="p-2 border-b min-h-[3.5rem] flex items-center justify-center">
                          <Badge
                            variant={task.status === Status.COMPLETED ? "secondary" : task.status === Status.IN_PROGRESS ? "default" : "destructive"}
                            className="capitalize w-full text-center truncate"
                          >
                            {task.status}
                          </Badge>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p className="font-semibold">Status:</p>
                        <p className="capitalize">{task.status}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel minSize={10} defaultSize={colWidths.start} onResize={(e) => setWidth("start", e)}>
                <div className="flex flex-col">
                  <div className="sticky top-0 z-10 border-b bg-secondary p-2 font-semibold text-sm">
                    Start Date
                  </div>
                  {tasks.map((task, i) => (
                    <Tooltip key={`start-${i}`}>
                      <TooltipTrigger asChild>
                        <div className="p-2 border-b min-h-[3.5rem] flex flex-col justify-center text-sm cursor-default">
                          <span className="truncate">{format(task.start_date, 'dd-MM-yyyy')}</span>
                          <span className="text-xs text-muted-foreground truncate">{format(task.start_date, 'HH:mm')}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p className="font-semibold">Start Date:</p>
                        <p>{format(task.start_date, 'dd-MM-yyyy HH:mm:ss')}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel minSize={10} defaultSize={colWidths.end} onResize={(e) => setWidth("end", e)}>
                <div className="flex flex-col">
                  <div className="sticky top-0 z-10 border-b bg-secondary p-2 font-semibold text-sm">
                    End Date
                  </div>
                  {tasks.map((task, i) => (
                    <Tooltip key={`end-${i}`}>
                      <TooltipTrigger asChild>
                        <div className="p-2 border-b min-h-[3.5rem] flex flex-col justify-center text-sm cursor-default">
                          <span className="truncate">{format(task.end_date, 'dd-MM-yyyy')}</span>
                          <span className="text-xs text-muted-foreground truncate">{format(task.end_date, 'HH:mm')}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p className="font-semibold">End Date:</p>
                        <p>{format(task.end_date, 'dd-MM-yyyy HH:mm:ss')}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel minSize={3} defaultSize={colWidths.actions} onResize={(e) => setWidth("actions", e)}>
                <div className="flex flex-col">
                  <div className="sticky top-0 z-10 border-b bg-secondary p-2 font-semibold text-sm text-center">
                    Actions
                  </div>
                  {tasks.map((task, i) => (
                    <div key={`action-${i}`} className="py-2 border-b min-h-[3.5rem] flex items-center justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-3 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Tooltip>
                            <DropdownMenuItem asChild>
                              <SubTaskDetails
                                taskId={task._id as string}
                                trigger={
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" className="w-full justify-start px-2">View sub task</Button>
                                  </TooltipTrigger>
                                }
                              />
                            </DropdownMenuItem>
                            <TooltipContent side="left">
                              View sub task <strong>{task.task_name}</strong>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <DropdownMenuItem onClick={() => onEdit?.(task)}>
                              <TooltipTrigger>Edit sub task</TooltipTrigger>
                            </DropdownMenuItem>
                            <TooltipContent side="left">
                              Edit <strong>{task.task_name}</strong>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <DropdownMenuItem onClick={() => onDelete?.(task._id as string, task.task_name)}>
                              <TooltipTrigger>Delete sub task</TooltipTrigger>
                            </DropdownMenuItem>
                            <TooltipContent side="left">
                              Delete <strong>{task.task_name}</strong>
                            </TooltipContent>
                          </Tooltip>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </>
      )
      }
    </div >
  );
}

export default ResizableSubTasksTable;