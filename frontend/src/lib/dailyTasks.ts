import { auth } from "@/lib/firebase";
import type { DailyTasks, Task } from "@/types";


export async function getAllDailyTasks(): Promise<DailyTasks[]> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("No user logged in");

  const res = await fetch("/api/daily-tasks", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.error || "Failed to get tasks");
  }

  return res.json() || [];
}


export async function createDailyTask(taskData: DailyTasks) {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("No user logged in");
  const res = await fetch("/api/daily-tasks/add-task", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });

  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.error || "Failed to create task");
  }

  return res.json();
}

export async function updateDailyTask(taskId: string, taskData: DailyTasks) {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("No user logged in");
  const res = await fetch("/api/daily-tasks/edit-task", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ taskId, taskData }),
  });

  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.error || "Failed to create sub task");
  }
  return res.json();
}


export async function createSubTask(taskData: Task, parentTaskId: string) {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("No user logged in");
  const res = await fetch("/api/daily-tasks/add-sub-task", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ parentTaskId, taskData }),
  });

  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.error || "Failed to create sub task");
  }

  return res.json();
}

export async function updateSubTask(subTaskId: string, taskData: Task) {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("No user logged in");
  const res = await fetch("/api/daily-tasks/edit-sub-task", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ subTaskId, taskData }),
  });

  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.error || "Failed to create sub task");
  }

  return res.json();
}
