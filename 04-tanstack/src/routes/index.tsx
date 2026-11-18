// Study Planner — Rung 4 (TanStack Start)
//
// Compare with 03-mern/client/src/components/Planner.tsx:
//   - No useEffect + fetch on mount: the route LOADER fetches tasks on the
//     server before the page is sent, so there's no "Loading…" flash.
//   - No api.ts: we import server functions directly and TypeScript knows
//     exactly what they accept and return.
//   - After a change we call router.invalidate(), which re-runs the loader,
//     so the loader stays the single source of truth.
//   - React 19's useOptimistic shows the change instantly while it saves.
import { useOptimistic, useState, useTransition, type FormEvent } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createTask, deleteTask, listTasks, updateTask, type Task } from "../server/tasks";
import TaskItem from "../components/TaskItem";

export const Route = createFileRoute("/")({
  loader: () => listTasks(),
  component: Planner,
});

type Filter = "all" | "active" | "done";
type Change = { type: "add"; task: Task } | { type: "update"; task: Task } | { type: "delete"; id: string };

function applyChange(tasks: Task[], change: Change): Task[] {
  if (change.type === "add") return [...tasks, change.task];
  if (change.type === "update") return tasks.map((t) => (t.id === change.task.id ? change.task : t));
  return tasks.filter((t) => t.id !== change.id);
}

function Planner() {
  const tasks = Route.useLoaderData();
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const [optimisticTasks, applyOptimistic] = useOptimistic(tasks, applyChange);

  /** Show the change now, run the server function, then reload real data. */
  function mutate(change: Change, action: () => Promise<unknown>) {
    setError(null);
    startTransition(async () => {
      applyOptimistic(change);
      try {
        await action();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
      // If the action failed, the optimistic change simply disappears here,
      // because the loader returns the server's real data.
      await router.invalidate();
    });
  }

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const title = String(data.get("title") ?? "").trim();
    if (!title) return;
    const due = String(data.get("due") ?? "") || null;
    form.reset();
    const draft: Task = { id: `temp-${Date.now()}`, title, due, done: false, createdAt: new Date().toISOString() };
    mutate({ type: "add", task: draft }, () => createTask({ data: { title, due } }));
  }

  const toggle = (task: Task) =>
    mutate({ type: "update", task: { ...task, done: !task.done } }, () =>
      updateTask({ data: { id: task.id, changes: { done: !task.done } } }),
    );
  const rename = (task: Task, title: string) =>
    mutate({ type: "update", task: { ...task, title } }, () => updateTask({ data: { id: task.id, changes: { title } } }));
  const remove = (task: Task) => mutate({ type: "delete", id: task.id }, () => deleteTask({ data: { id: task.id } }));

  const shown = optimisticTasks.filter((t) => (filter === "active" ? !t.done : filter === "done" ? t.done : true));
  const left = optimisticTasks.filter((t) => !t.done).length;

  return (
    <section aria-label="Planner">
      <form className="add-form" onSubmit={addTask}>
        <label className="visually-hidden" htmlFor="new-title">Task</label>
        <input id="new-title" type="text" name="title" placeholder="What do you need to study?" required maxLength={120} />
        <label className="visually-hidden" htmlFor="new-due">Due date</label>
        <input id="new-due" type="date" name="due" />
        <button className="primary" type="submit">Add</button>
      </form>

      <div className="filters" role="group" aria-label="Filter tasks">
        {(["all", "active", "done"] as const).map((f) => (
          <button key={f} className="ghost" type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      <ul className="task-list" aria-live="polite">
        {shown.length === 0 && (
          <li className="empty">{optimisticTasks.length === 0 ? "No tasks yet. Add your first one above." : "Nothing in this filter."}</li>
        )}
        {shown.map((task) => (
          <TaskItem key={task.id} task={task} onToggle={toggle} onDelete={remove} onRename={rename} />
        ))}
      </ul>
      <p className="summary">
        {left} of {optimisticTasks.length} task{optimisticTasks.length === 1 ? "" : "s"} left
      </p>
    </section>
  );
}
