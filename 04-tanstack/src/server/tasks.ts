// Server functions: plain async functions that ALWAYS run on the server,
// but that you call from React like any other function.
//
// Compare with rung 3: there you wrote an Express route (server) AND a fetch
// wrapper in api.ts (client), and kept their shapes in sync by hand.
// Here there is one function. TanStack Start creates the HTTP endpoint and
// the client-side fetch for you, and TypeScript checks both ends.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { randomUUID } from "node:crypto";

export type Task = { id: string; title: string; due: string | null; done: boolean; createdAt: string };

// Storage: a JSON file on the server. Small and dependency-free, so the new
// ideas in this rung stay in focus. Exercise 4 swaps it for a real database.
const DATA_FILE = "data/tasks.json";

async function readTasks(): Promise<Task[]> {
  try {
    return JSON.parse(await readFile(DATA_FILE, "utf8"));
  } catch {
    return [];
  }
}

async function writeTasks(tasks: Task[]) {
  await mkdir("data", { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(tasks, null, 2));
}

const title = z.string().trim().min(1, "Title is required").max(120);
const due = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable();

export const listTasks = createServerFn({ method: "GET" }).handler(() => readTasks());

export const createTask = createServerFn({ method: "POST" })
  .validator(z.object({ title, due }))
  .handler(async ({ data }) => {
    const task: Task = { id: randomUUID(), title: data.title, due: data.due, done: false, createdAt: new Date().toISOString() };
    await writeTasks([...(await readTasks()), task]);
    return task;
  });

export const updateTask = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string(), changes: z.object({ title, due, done: z.boolean() }).partial() }))
  .handler(async ({ data }) => {
    const tasks = await readTasks();
    const task = tasks.find((t) => t.id === data.id);
    if (!task) throw new Error("Task not found");
    Object.assign(task, data.changes);
    await writeTasks(tasks);
    return task;
  });

export const deleteTask = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    await writeTasks((await readTasks()).filter((t) => t.id !== data.id));
  });
