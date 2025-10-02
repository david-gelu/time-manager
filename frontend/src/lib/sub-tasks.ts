import type { SubTaskWithParent } from "@/types";
import { auth } from "./firebase";

export async function getAllTasksWithStatusNew(search: string = ""): Promise<SubTaskWithParent[]> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("No user logged in");

  const res = await fetch(`/api/sub-tasks/all-status-new?search=${encodeURIComponent(search)}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.error || "Failed to get tasks with status new");
  }

  return res.json() || [];
}

export async function getAllTasksWithStatusInProgress(search: string = ""): Promise<SubTaskWithParent[]> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("No user logged in");

  const res = await fetch(`/api/sub-tasks/all-status-in-progress?search=${encodeURIComponent(search)}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.error || "Failed to get tasks with status in progress");
  }

  return res.json() || [];
}

export async function getAllTasksWithStatusCompleted(search: string = ""): Promise<SubTaskWithParent[]> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("No user logged in");

  const res = await fetch(`/api/sub-tasks/all-status-completed?search=${encodeURIComponent(search)}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.error || "Failed to get tasks with status completed");
  }

  return res.json() || [];
}