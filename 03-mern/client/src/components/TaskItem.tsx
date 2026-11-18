import { useState } from "react";
import type { Task } from "../api";

type Props = {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (task: Task) => void;
  onRename: (task: Task, title: string) => void;
};

export default function TaskItem({ task, onToggle, onDelete, onRename }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);

  function save() {
    const title = draft.trim();
    if (title && title !== task.title) onRename(task, title);
    else setDraft(task.title);
    setIsEditing(false);
  }

  return (
    <li className={task.done ? "task done" : "task"}>
      <input type="checkbox" checked={task.done} aria-label={`Mark "${task.title}" as done`} onChange={() => onToggle(task)} />
      {isEditing ? (
        <input
          className="edit-input"
          value={draft}
          aria-label="Edit task title"
          autoFocus
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") {
              setDraft(task.title);
              setIsEditing(false);
            }
          }}
        />
      ) : (
        <span className="title">
          {task.title}
          {task.due && <span className="due"> · due {task.due}</span>}
        </span>
      )}
      <button className="ghost" type="button" onClick={() => (isEditing ? save() : setIsEditing(true))}>
        {isEditing ? "Save" : "Edit"}
      </button>
      <button className="danger" type="button" aria-label={`Delete "${task.title}"`} onClick={() => onDelete(task)}>
        Delete
      </button>
    </li>
  );
}
