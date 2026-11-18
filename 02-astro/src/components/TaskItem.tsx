// One task row. In rung 1 this was the renderTask() function;
// here it is a component with its own small piece of state (isEditing).
import { useState } from "preact/hooks";

export type Task = { id: string; title: string; due: string | null; done: boolean; createdAt: string };

type Props = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
};

export default function TaskItem({ task, onToggle, onDelete, onRename }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);

  function save() {
    const title = draft.trim();
    if (title) onRename(task.id, title);
    else setDraft(task.title);
    setIsEditing(false);
  }

  return (
    <li class={task.done ? "task done" : "task"}>
      <input
        type="checkbox"
        checked={task.done}
        aria-label={`Mark "${task.title}" as done`}
        onChange={() => onToggle(task.id)}
      />
      {isEditing ? (
        <input
          class="edit-input"
          value={draft}
          aria-label="Edit task title"
          autoFocus
          onInput={(e) => setDraft(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") {
              setDraft(task.title);
              setIsEditing(false);
            }
          }}
        />
      ) : (
        // JSX escapes text for us, so user input can't inject HTML.
        <span class="title">
          {task.title}
          {task.due && <span class="due"> · due {task.due}</span>}
        </span>
      )}
      <button class="ghost" type="button" onClick={() => (isEditing ? save() : setIsEditing(true))}>
        {isEditing ? "Save" : "Edit"}
      </button>
      <button class="danger" type="button" aria-label={`Delete "${task.title}"`} onClick={() => onDelete(task.id)}>
        Delete
      </button>
    </li>
  );
}
