
import type { DailyTasks, Status, Task } from "@/types";
import apiFetch from "./apiClient";


export async function getAllDailyTasks(): Promise<DailyTasks[]> {
  return apiFetch("/daily-tasks", { method: "GET" });
}

export async function createDailyTask(taskData: DailyTasks) {
  return apiFetch("/daily-tasks/add-task", {
    method: "POST",
    body: JSON.stringify(taskData),
  });
}
export async function duplicateDailyTask(taskData: DailyTasks) {
  return apiFetch("/daily-tasks/duplicate-task", {
    method: "POST",
    body: JSON.stringify({ taskData }),
  });
}

export async function updateDailyTask(taskId: string, taskData: DailyTasks) {
  return apiFetch("/daily-tasks/edit-task", {
    method: "POST",
    body: JSON.stringify({ taskId, taskData }),
  });
}

export async function deleteDailyTask(taskId: string) {
  return apiFetch("/daily-tasks/delete-task", {
    method: "POST",
    body: JSON.stringify({ taskId }),
  });
}

export async function createSubTask(taskData: Task, parentTaskId: string) {
  return apiFetch("/daily-tasks/add-sub-task", {
    method: "POST",
    body: JSON.stringify({ parentTaskId, taskData }),
  });
}

export async function updateSubTask(subTaskId: string, taskData: Task) {
  return apiFetch("/daily-tasks/edit-sub-task", {
    method: "POST",
    body: JSON.stringify({ subTaskId, taskData }),
  });
}
export async function updateSubTaskStatus(subTaskId: string, newStatus: Status) {
  return apiFetch("/daily-tasks/update-sub-task-status", {
    method: "POST",
    body: JSON.stringify({ subTaskId, newStatus }),
  });
}

export async function deleteSubTask(subTaskId: string) {
  return apiFetch("/daily-tasks/delete-sub-task", {
    method: "POST",
    body: JSON.stringify({ subTaskId }),
  });
}
