import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { fetchBackendData } from './useBackendData';
import { getAllDailyTasks, createDailyTask } from './dailyTasks';
import type { DailyTasks } from '@/types';

export function useBackendData() {
  return useQuery({
    queryKey: ['backendData'],
    queryFn: fetchBackendData,
  });
}

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
