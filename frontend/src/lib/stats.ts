import { auth } from "./firebase";

export async function countDailysWithStatusNew(): Promise<number> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("No user logged in");

  const res = await fetch('/api/stats/count-daily-status-new', {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.error || "Failed to get tasks with status new");
  }

  return res.json() || [];
}

export async function countDailysWithStatusInProgress(): Promise<number> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("No user logged in");

  const res = await fetch('/api/stats/count-daily-status-in-progress', {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.error || "Failed to get tasks with status in progress");
  }

  return res.json() || [];
}

export async function countDailysWithStatusCompleted(): Promise<number> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("No user logged in");

  const res = await fetch('/api/stats/count-daily-status-completed', {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.error || "Failed to get tasks with status completed");
  }

  return res.json() || [];
}
export async function countSubTasksWithStatusNew(): Promise<number> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("No user logged in");

  const res = await fetch('/api/stats/count-subtasks-status-new', {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.error || "Failed to get subtask with status new");
  }

  return res.json() || [];
}

export async function countSubTasksWithStatusInProgress(): Promise<number> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("No user logged in");

  const res = await fetch('/api/stats/count-subtasks-status-in-progress', {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.error || "Failed to get subtask with status in progress");
  }

  return res.json() || [];
}

export async function countSubTasksWithStatusCompleted(): Promise<number> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("No user logged in");

  const res = await fetch('/api/stats/count-subtasks-status-completed', {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.error || "Failed to get subtask with status completed");
  }

  return res.json() || [];
}