// Every call to the server goes through this file.
// In rungs 1 and 2, "saving" was one localStorage line. Now data lives on a
// server, so every change is a network request that can fail.

export type Task = { id: string; title: string; due: string | null; done: boolean; createdAt: string };
export type User = { id: string; email: string };

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...options,
    credentials: "include", // send the login cookie
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  if (res.status === 204) return undefined as T;
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, body.error ?? `Request failed (${res.status})`);
  return body as T;
}

export const api = {
  me: () => request<{ user: User }>("/auth/me"),
  signup: (email: string, password: string) =>
    request<{ user: User }>("/auth/signup", { method: "POST", body: JSON.stringify({ email, password }) }),
  login: (email: string, password: string) =>
    request<{ user: User }>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  logout: () => request<void>("/auth/logout", { method: "POST" }),

  listTasks: () => request<{ tasks: Task[] }>("/tasks"),
  createTask: (title: string, due: string | null) =>
    request<{ task: Task }>("/tasks", { method: "POST", body: JSON.stringify({ title, due }) }),
  updateTask: (id: string, changes: Partial<Pick<Task, "title" | "due" | "done">>) =>
    request<{ task: Task }>(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(changes) }),
  deleteTask: (id: string) => request<void>(`/tasks/${id}`, { method: "DELETE" }),
};
