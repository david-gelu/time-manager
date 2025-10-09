import type { SubTaskWithParent, Task } from "@/types";
import apiFetch from "./apiClient";

export async function getSubTask(id: string = ""): Promise<Task> {
  const res = await apiFetch(`/sub-tasks/${id}`, { method: "GET" });
  return res as Task;
}

export async function getAllTasksWithStatusNew(search: string = ""): Promise<SubTaskWithParent[]> {
  const res = await apiFetch(
    `/sub-tasks/all-status-new?search=${encodeURIComponent(search)}`,
    { method: "GET" }
  );
  return res as SubTaskWithParent[];
}

export async function getAllTasksWithStatusInProgress(search: string = ""): Promise<SubTaskWithParent[]> {
  const res = await apiFetch(
    `/sub-tasks/all-status-in-progress?search=${encodeURIComponent(search)}`,
    { method: "GET" }
  );
  return res as SubTaskWithParent[];
}

export async function getAllTasksWithStatusCompleted(search: string = ""): Promise<SubTaskWithParent[]> {
  const res = await apiFetch(
    `/sub-tasks/all-status-completed?search=${encodeURIComponent(search)}`,
    { method: "GET" }
  );
  return res as SubTaskWithParent[];
}