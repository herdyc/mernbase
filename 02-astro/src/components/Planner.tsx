// Study Planner — Rung 2 (Astro island, written in Preact)
//
// Compare with 01-vanilla/app.js:
//   - No render() function and no createElement: we DESCRIBE the UI in JSX,
//     and Preact updates the page when state changes.
//   - State lives in useState instead of top-level variables.
//   - Saving to localStorage moves into useEffect, because this component is
//     ALSO rendered once at build time, where there is no browser storage.
import { useEffect, useState } from "preact/hooks";
import TaskItem, { type Task } from "./TaskItem";

const STORAGE_KEY = "stack-ladder:tasks";
type Filter = "all" | "active" | "done";

export default function Planner() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loaded, setLoaded] = useState(false);

  // Runs only in the browser, after the first render.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setTasks(JSON.parse(raw));
    } catch {
      /* corrupt or blocked storage: start empty */
    }
    setLoaded(true);
  }, []);

  // Save whenever tasks change (but not before we've loaded, or we'd overwrite).
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      /* storage full or blocked */
    }
  }, [tasks, loaded]);

  function addTask(event: SubmitEvent) {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const title = String(data.get("title") ?? "").trim();
    if (!title) return;
    const due = String(data.get("due") ?? "") || null;
    setTasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title, due, done: false, createdAt: new Date().toISOString() },
    ]);
    form.reset();
  }

  const toggle = (id: string) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));
  const rename = (id: string, title: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, title } : t)));

  const shown = tasks.filter((t) => (filter === "active" ? !t.done : filter === "done" ? t.done : true));
  const left = tasks.filter((t) => !t.done).length;

  return (
    <section aria-label="Planner">
      <form class="add-form" onSubmit={addTask}>
        <label class="visually-hidden" for="new-title">Task</label>
        <input id="new-title" type="text" name="title" placeholder="What do you need to study?" required maxLength={120} />
        <label class="visually-hidden" for="new-due">Due date</label>
        <input id="new-due" type="date" name="due" />
        <button class="primary" type="submit">Add</button>
      </form>

      <div class="filters" role="group" aria-label="Filter tasks">
        {(["all", "active", "done"] as const).map((f) => (
          <button key={f} class="ghost" type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <ul class="task-list" aria-live="polite">
        {shown.length === 0 && (
          <li class="empty">{tasks.length === 0 ? "No tasks yet. Add your first one above." : "Nothing in this filter."}</li>
        )}
        {shown.map((task) => (
          <TaskItem key={task.id} task={task} onToggle={toggle} onDelete={remove} onRename={rename} />
        ))}
      </ul>
      <p class="summary">
        {left} of {tasks.length} task{tasks.length === 1 ? "" : "s"} left
      </p>
    </section>
  );
}
