// Study Planner — Rung 1 (vanilla JavaScript)
//
// The whole app is three ideas:
//   1. STATE   — an array of task objects, the single source of truth
//   2. RENDER  — a function that rebuilds the list from the state
//   3. EVENTS  — handlers that change the state, save it, then call render()
//
// Every later rung (Astro, MERN, TanStack) keeps these three ideas.
// What changes is WHERE the state lives and WHO does the rendering.

const STORAGE_KEY = "stack-ladder:tasks";

// ---------- 1. STATE ----------

/** @typedef {{ id: string, title: string, due: string | null, done: boolean, createdAt: string }} Task */

/** @type {Task[]} */
let tasks = load();
/** @type {"all" | "active" | "done"} */
let filter = "all";
/** id of the task being edited, or null */
let editingId = null;

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    // Corrupt data or storage blocked (private mode): start empty instead of crashing.
    return [];
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Storage full or blocked. The app still works for this visit.
  }
}

// ---------- 2. RENDER ----------

const list = document.getElementById("task-list");
const summary = document.getElementById("summary");

function visibleTasks() {
  if (filter === "active") return tasks.filter((t) => !t.done);
  if (filter === "done") return tasks.filter((t) => t.done);
  return tasks;
}

function render() {
  const shown = visibleTasks();
  list.replaceChildren(); // clear the old list

  if (shown.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = tasks.length === 0 ? "No tasks yet. Add your first one above." : "Nothing in this filter.";
    list.append(empty);
  }

  for (const task of shown) {
    list.append(renderTask(task));
  }

  const left = tasks.filter((t) => !t.done).length;
  summary.textContent = `${left} of ${tasks.length} task${tasks.length === 1 ? "" : "s"} left`;
}

/** Builds one <li>. We use textContent (never innerHTML) so user input can't inject HTML. */
function renderTask(task) {
  const li = document.createElement("li");
  li.className = task.done ? "task done" : "task";
  li.dataset.id = task.id;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.done;
  checkbox.setAttribute("aria-label", `Mark "${task.title}" as done`);
  checkbox.dataset.action = "toggle";

  let titleEl;
  if (editingId === task.id) {
    titleEl = document.createElement("input");
    titleEl.className = "edit-input";
    titleEl.value = task.title;
    titleEl.setAttribute("aria-label", "Edit task title");
    titleEl.dataset.action = "edit-input";
    // Focus after the element is in the page.
    queueMicrotask(() => titleEl.focus());
  } else {
    titleEl = document.createElement("span");
    titleEl.className = "title";
    titleEl.textContent = task.title;
    if (task.due) {
      const due = document.createElement("span");
      due.className = "due";
      due.textContent = ` · due ${task.due}`;
      titleEl.append(due);
    }
  }

  const editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.className = "ghost";
  editBtn.textContent = editingId === task.id ? "Save" : "Edit";
  editBtn.dataset.action = editingId === task.id ? "save" : "edit";

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "danger";
  deleteBtn.textContent = "Delete";
  deleteBtn.setAttribute("aria-label", `Delete "${task.title}"`);
  deleteBtn.dataset.action = "delete";

  li.append(checkbox, titleEl, editBtn, deleteBtn);
  return li;
}

// ---------- 3. EVENTS ----------

function update(next) {
  tasks = next;
  save();
  render();
}

document.getElementById("add-form").addEventListener("submit", (event) => {
  event.preventDefault(); // stop the browser from reloading the page
  const form = event.currentTarget;
  const title = form.title.value.trim();
  if (!title) return;

  const task = {
    id: crypto.randomUUID(),
    title,
    due: form.due.value || null,
    done: false,
    createdAt: new Date().toISOString(),
  };
  update([...tasks, task]);
  form.reset();
  form.title.focus();
});

// Event delegation: ONE listener on the list handles clicks for every task,
// including tasks added later. We read data-action to know what was clicked.
list.addEventListener("click", (event) => {
  const target = event.target;
  const li = target.closest("li[data-id]");
  if (!li) return;
  const id = li.dataset.id;

  switch (target.dataset.action) {
    case "toggle":
      update(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
      break;
    case "delete":
      update(tasks.filter((t) => t.id !== id));
      break;
    case "edit":
      editingId = id;
      render();
      break;
    case "save":
      saveEdit(li);
      break;
  }
});

list.addEventListener("keydown", (event) => {
  if (event.target.dataset.action !== "edit-input") return;
  if (event.key === "Enter") saveEdit(event.target.closest("li"));
  if (event.key === "Escape") {
    editingId = null;
    render();
  }
});

function saveEdit(li) {
  const input = li.querySelector(".edit-input");
  const title = input.value.trim();
  editingId = null;
  if (!title) return render(); // empty title: cancel the edit
  update(tasks.map((t) => (t.id === li.dataset.id ? { ...t, title } : t)));
}

document.querySelector(".filters").addEventListener("click", (event) => {
  const value = event.target.dataset.filter;
  if (!value) return;
  filter = value;
  for (const btn of document.querySelectorAll(".filters button")) {
    btn.setAttribute("aria-pressed", String(btn.dataset.filter === filter));
  }
  render();
});

render();
