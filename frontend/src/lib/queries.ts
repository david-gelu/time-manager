import { useQuery, useQueryClient, useMutation, keepPreviousData } from '@tanstack/react-query';
import {
  getAllDailyTasks,
  createDailyTask,
  createSubTask,
  updateDailyTask,
  updateSubTask,
  deleteDailyTask,
  deleteSubTask,
  duplicateDailyTask,
  updateSubTaskStatus
} from './dailyTasks';
import type { DailyTasks, Status, SubTaskWithParent, Task } from '@/types';
import {
  getAllTasksWithStatusCompleted,
  getAllTasksWithStatusInProgress,
  getAllTasksWithStatusNew,
  getSubTask
} from './sub-tasks';
import {
  countDailysWithStatusCompleted,
  countDailysWithStatusInProgress,
  countDailysWithStatusNew,
  countSubTasksWithStatusCompleted,
  countSubTasksWithStatusInProgress,
  countSubTasksWithStatusNew
} from './stats';

export function useAllDailyTasks() {
  return useQuery<DailyTasks[]>({
    queryKey: ['allDailyTasks'],
    queryFn: getAllDailyTasks,
    staleTime: 1000 * 60,
  });
}

export function useCreateDailyTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (task: DailyTasks) => createDailyTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allDailyTasks'] });
    },
  });
}

export function useDuplicateDailyTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (task: DailyTasks) => duplicateDailyTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allDailyTasks'] });
    },
  });
}

export function useEditTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ parentTaskId, task }: { parentTaskId: string, task: DailyTasks }) => updateDailyTask(parentTaskId, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allDailyTasks'] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ parentTaskId }: { parentTaskId: string }) => deleteDailyTask(parentTaskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allDailyTasks'] });
    },
  });
}

interface CreateSubTaskInput {
  task: Task;
  parentTaskId: string;
}

export function useCreateSubTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ task, parentTaskId }: CreateSubTaskInput) => createSubTask(task, parentTaskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allDailyTasks'] });
    },
  });
}

export function useEditSubTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ subTaskId, subTask }: { subTaskId: string, subTask: Task }) => updateSubTask(subTaskId, subTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allDailyTasks'] });
    },
  });
}

export function useUpdateSubTaskStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ subTaskId, newStatus }: { subTaskId: string, newStatus: Status }) => updateSubTaskStatus(subTaskId, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allDailyTasks'] });
    },
  });
}

export function useDeleteSubTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ subTaskId }: { subTaskId: string }) => deleteSubTask(subTaskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allDailyTasks'] });
    },
  });
}



// kanbarn board queries

export function useGetSubTask(taskId: string = "") {
  return useQuery<Task>({
    queryKey: ['getSubTask', taskId],
    queryFn: () => getSubTask(taskId),
    staleTime: 1000 * 60,
  });
}

export const useAllTasksWithStatusNew = (search: string = "") =>
  useQuery<SubTaskWithParent[], Error>({
    queryKey: ['allTasksWithStatusNew', search],
    queryFn: () => getAllTasksWithStatusNew(search),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  });

export const useAllTasksWithStatusInProgress = (search: string = "") =>
  useQuery<SubTaskWithParent[], Error>({
    queryKey: ['allTasksWithStatusInProgress', search],
    queryFn: () => getAllTasksWithStatusInProgress(search),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  });

export const useAllTasksWithStatusCompleted = (search: string = "") =>
  useQuery<SubTaskWithParent[], Error>({
    queryKey: ['allTasksWithStatusCompleted', search],
    queryFn: () => getAllTasksWithStatusCompleted(search),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  });


//stats queries
export const useCountDailysWithStatusNew = () =>
  useQuery<number, Error>({
    queryKey: ['countDailysWithStatusNew'],
    queryFn: () => countDailysWithStatusNew(),
    staleTime: 1000 * 60,
  });

export const useCountDailysWithStatusInProgress = () =>
  useQuery<number, Error>({
    queryKey: ['countDailysWithStatusInProgress'],
    queryFn: () => countDailysWithStatusInProgress(),
    staleTime: 1000 * 60,
  });

export const useCountDailysWithStatusCompleted = () =>
  useQuery<number, Error>({
    queryKey: ['countDailysWithStatusCompleted'],
    queryFn: () => countDailysWithStatusCompleted(),
    staleTime: 1000 * 60,
  });

export const useCountSubTasksWithStatusNew = () =>
  useQuery<number, Error>({
    queryKey: ['countSubTasksWithStatusNew'],
    queryFn: () => countSubTasksWithStatusNew(),
    staleTime: 1000 * 60,
  });

export const useCountSubTasksWithStatusInProgress = () =>
  useQuery<number, Error>({
    queryKey: ['countSubTasksWithStatusInProgress'],
    queryFn: () => countSubTasksWithStatusInProgress(),
    staleTime: 1000 * 60,
  });

export const useCountSubTasksWithStatusCompleted = () =>
  useQuery<number, Error>({
    queryKey: ['countSubTasksWithStatusCompleted'],
    queryFn: () => countSubTasksWithStatusCompleted(),
    staleTime: 1000 * 60,
  });