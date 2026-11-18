// Study Planner — Rung 3 (React talking to an Express API)
//
// Compare with 02-astro/src/components/Planner.tsx: the JSX is nearly the same.
// What changed is that every update is now a REQUEST to the server:
//   - loading and error states appear, because the network can be slow or fail
//   - we update the screen only after the server confirms the change
import { useEffect, useState, type FormEvent } from "react";
import { api, type Task } from "../api";
import TaskItem from "./TaskItem";

type Filter = "all" | "active" | "done";

export default function Planner() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .listTasks()
      .then(({ tasks }) => setTasks(tasks))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  /** Runs a server call and shows its error message if it fails. */
  async function run(action: () => Promise<void>) {
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const title = String(data.get("title") ?? "").trim();
    if (!title) return;
    const due = String(data.get("due") ?? "") || null;
    // Clear the form straight away, so the user can type the next task while
    // this one is saving. (Resetting after the request finished would wipe
    // whatever they had typed in the meantime.) On failure, put the text back.
    form.reset();
    run(async () => {
      try {
        const { task } = await api.createTask(title, due);
        setTasks((prev) => [...prev, task]);
      } catch (err) {
        const input = form.elements.namedItem("title") as HTMLInputElement;
        if (!input.value) input.value = title;
        throw err;
      }
    });
  }

  const replace = (task: Task) => setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
  // Optimistic update: tick the box immediately, then ask the server.
  // If the server says no, put the task back the way it was.
  const toggle = (task: Task) => {
    replace({ ...task, done: !task.done });
    run(async () => {
      try {
        replace((await api.updateTask(task.id, { done: !task.done })).task);
      } catch (err) {
        replace(task);
        throw err;
      }
    });
  };
  const rename = (task: Task, title: string) => run(async () => replace((await api.updateTask(task.id, { title })).task));
  const remove = (task: Task) =>
    run(async () => {
      await api.deleteTask(task.id);
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
    });

  const shown = tasks.filter((t) => (filter === "active" ? !t.done : filter === "done" ? t.done : true));
  const left = tasks.filter((t) => !t.done).length;

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

      <ul className="task-list" aria-live="polite" aria-busy={loading}>
        {!loading && shown.length === 0 && (
          <li className="empty">{tasks.length === 0 ? "No tasks yet. Add your first one above." : "Nothing in this filter."}</li>
        )}
        {shown.map((task) => (
          <TaskItem key={task.id} task={task} onToggle={toggle} onDelete={remove} onRename={rename} />
        ))}
      </ul>
      <p className="summary">
        {loading ? "Loading tasks…" : `${left} of ${tasks.length} task${tasks.length === 1 ? "" : "s"} left`}
      </p>
    </section>
  );
}
