import apiFetch from "./apiClient";

export async function countDailysWithStatusNew(): Promise<number> {
  const res = await apiFetch("/stats/count-daily-status-new", { method: "GET" });
  return res as number;
}

export async function countDailysWithStatusInProgress(): Promise<number> {
  const res = await apiFetch(
    "/stats/count-daily-status-in-progress",
    { method: "GET" }
  );
  return res as number;
}

export async function countDailysWithStatusCompleted(): Promise<number> {
  const res = await apiFetch(
    "/stats/count-daily-status-completed",
    { method: "GET" }
  );
  return res as number;
}

export async function countSubTasksWithStatusNew(): Promise<number> {
  const res = await apiFetch(
    "/stats/count-subtasks-status-new",
    { method: "GET" }
  );
  return res as number;
}

export async function countSubTasksWithStatusInProgress(): Promise<number> {
  const res = await apiFetch(
    "/stats/count-subtasks-status-in-progress",
    { method: "GET" }
  );
  return res as number;
}

export async function countSubTasksWithStatusCompleted(): Promise<number> {
  const res = await apiFetch(
    "/stats/count-subtasks-status-completed",
    { method: "GET" }
  );
  return res as number;
}