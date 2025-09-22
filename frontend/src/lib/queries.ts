import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { getAllDailyTasks, createDailyTask, createSubTask } from './dailyTasks';
import type { DailyTasks, Task } from '@/types';

export function useAllDailyTasks() {
  return useQuery({
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
