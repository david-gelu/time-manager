export const Status = {
  NEW: 'new',
  IN_PROGRESS: 'in progress',
  COMPLETED: 'completed'
} as const;

export type Status = (typeof Status)[keyof typeof Status];

export type Task = {
  id: string,
  task_name: string,
  status: Status,
  start_date: string,
  end_date: string,
  description: string
}

export interface DailyTasks {
  id: string,
  name: string,
  date: string,
  status: Status
  description: string,
  tasks: Task[],
  userId?: string
}

export type DailyTasksRow = DailyTasks & { id: string }