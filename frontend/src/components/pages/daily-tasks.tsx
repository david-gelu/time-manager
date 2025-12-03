import { useState, useMemo } from "react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAllDailyTasks } from "@/lib/queries";
import { Status, type DailyTasks } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchParams } from "react-router";
import { deleteDailyTask, duplicateDailyTask } from "@/lib/dailyTasks";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import TableComponent from "../table/table";
import AddSubTask from "../add-sub-task";
import EditTask from "../edit-tasks";

export default function DailyTasks() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(searchInput, 500);
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading, error } = useAllDailyTasks(debouncedSearch);

  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<DailyTasks | null>(null);

  const getTasksForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return tasks.filter((task) => {
      const taskDate = format(new Date(task.date), "yyyy-MM-dd");
      return taskDate === dateStr;
    });
  };

  const getWeekDays = () => {
    return Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
  };

  const selectedDateTasks = getTasksForDate(selectedDate);

  const weekDays = getWeekDays();

  const goToPreviousWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentWeekStart(startOfWeek(today, { weekStartsOn: 1 }));
    setSelectedDate(today);
  };

  const handleAddSubTask = (task: DailyTasks) => {
    setSelectedTask(task);
    setOpenModal(true);
  };

  const handleEditTask = (task: DailyTasks) => {
    setSelectedTask(task);
    setOpenEditModal(true);
  };

  const handleDuplicateTask = async (task: DailyTasks) => {
    try {
      await duplicateDailyTask(task);
      toast.success(`${task.name} task was duplicated successfully`);
      queryClient.invalidateQueries({ queryKey: ['allDailyTasks'] });
    } catch (err) {
      console.error(`🚀 ~ err:`, err);
      toast.error("Failed to duplicate task");
    }
  };

  const handleDeleteTask = async (task: DailyTasks) => {
    try {
      await deleteDailyTask(task._id);
      toast.success(`${task.name} task deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ['allDailyTasks'] });
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">Error loading tasks: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="w-full p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Daily Tasks</h1>
        <Button onClick={goToToday} variant="outline">
          Today
        </Button>
      </div>

      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calendar" className="cursor-pointer">Calendar View</TabsTrigger>
          <TabsTrigger value="table" className="cursor-pointer">Table View</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Week of {format(currentWeekStart, "MMM d")} -{" "}
                  {format(addDays(currentWeekStart, 6), "MMM d, yyyy")}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={goToNextWeek}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  Loading tasks...
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
                  {weekDays.map((day, index) => {
                    const dayTasks = getTasksForDate(day);
                    const isToday = isSameDay(day, new Date());

                    return (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border-2 ${isToday ? 'border-primary' : ""} transition cursor-pointer bg-background`}
                        onClick={() => setSelectedDate(day)}
                      >
                        <div className='mb-3'>
                          <p className="font-semibold text-sm">
                            {format(day, "EEE")}
                            <span className="ms-2 text-lg font-bold">{format(day, "d")}</span>
                          </p>
                          {dayTasks.length > 0 && (
                            <span className="mt-2 text-xs font-semibold">
                              {dayTasks.length} task{dayTasks.length > 1 ? "s" : ""}
                            </span>
                          )}
                        </div>

                        <div className="space-y-2 h-100 max-h-[45dvh] overflow-y-auto">
                          {dayTasks.length > 0 ? (
                            dayTasks.map((task) => (
                              <div
                                key={task._id}
                                className={`
                                  group relative p-2 rounded text-xs cursor-pointer transition hover:shadow-md 
                                  ${task.status === Status.COMPLETED
                                    ? "bg-secondary"
                                    : task.status === Status.IN_PROGRESS
                                      ? "bg-primary"
                                      : "bg-destructive"
                                  }`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="flex items-start justify-between gap-1">
                                  <div className="flex items-start gap-1 flex-1 min-w-0">
                                    {task.status === Status.COMPLETED ? (
                                      <CheckCircle2 className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                                    ) : (
                                      <Circle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                    )}
                                    <span className="break-words line-clamp-2">
                                      {task.name}
                                    </span>
                                  </div>

                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="secondary"
                                        className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <MoreHorizontal className="h-3 w-3" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <Tooltip>
                                        <DropdownMenuItem onClick={() => handleAddSubTask(task)}>
                                          <TooltipTrigger>Add sub task</TooltipTrigger>
                                        </DropdownMenuItem>
                                        <TooltipContent side="left">
                                          Add new sub task for <strong>{task.name}</strong>
                                        </TooltipContent>
                                      </Tooltip>

                                      <Tooltip>
                                        <DropdownMenuItem onClick={() => handleEditTask(task)}>
                                          <TooltipTrigger>Edit daily task</TooltipTrigger>
                                        </DropdownMenuItem>
                                        <TooltipContent side="left">
                                          Edit <strong>{task.name}</strong> task
                                        </TooltipContent>
                                      </Tooltip>

                                      <Tooltip>
                                        <DropdownMenuItem onClick={() => handleDuplicateTask(task)}>
                                          <TooltipTrigger>Duplicate daily task</TooltipTrigger>
                                        </DropdownMenuItem>
                                        <TooltipContent side="left">
                                          This will duplicate the entire <strong>{task.name}</strong> task with sub tasks too
                                        </TooltipContent>
                                      </Tooltip>

                                      <Tooltip>
                                        <DropdownMenuItem onClick={() => handleDeleteTask(task)}>
                                          <TooltipTrigger>Delete daily task</TooltipTrigger>
                                        </DropdownMenuItem>
                                        <TooltipContent side="left">
                                          This will delete the entire <strong>{task.name}</strong> task with sub tasks too
                                        </TooltipContent>
                                      </Tooltip>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs">No tasks</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="table" className="space-y-4">
          <TableComponent />
        </TabsContent>
      </Tabs>

      {openModal && (
        <AddSubTask
          open={openModal}
          onOpenChange={setOpenModal}
          task={selectedTask as DailyTasks}
        />
      )}
      {openEditModal && (
        <EditTask
          open={openEditModal}
          onOpenChange={setOpenEditModal}
          dailyTask={selectedTask as DailyTasks}
        />
      )}
    </div>
  );
} 