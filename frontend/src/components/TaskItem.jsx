function formatDueDate(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function isDueSoon(task) {
  if (task.priority !== "urgent" || !task.dueDate || task.isCompleted) return false;
  const due = new Date(`${task.dueDate}T23:59:59`);
  const diffMs = due - new Date();
  return diffMs <= 24 * 60 * 60 * 1000;
}

// compact=true renders the trimmed-down row used by preview surfaces (e.g. a
// dashboard card): checkbox + title + urgent tag only, no due-date meta or
// edit/delete actions. The full /to-do page uses the default (compact=false).
export default function TaskItem({ task, onToggleComplete, onEdit, onDelete, compact = false }) {
  const checkbox = (
    <div
      className={task.isCompleted ? "checkbox checked" : "checkbox"}
      onClick={() => onToggleComplete(task)}
    >
      {task.isCompleted ? "♥" : ""}
    </div>
  );

  if (compact) {
    return (
      <div className="todo-item">
        {checkbox}
        <span className={task.isCompleted ? "todo-text done" : "todo-text"}>{task.title}</span>
        {task.priority === "urgent" ? (
          <span
            className="tag"
            style={{ background: "var(--color-primary-deep)", color: "white", fontSize: "11px", padding: "2px 8px" }}
          >
            Urgent
          </span>
        ) : null}
      </div>
    );
  }

  const dueSoon = isDueSoon(task);

  return (
    <div className="todo-item">
      {checkbox}

      <div className="todo-content">
        <span className={task.isCompleted ? "todo-text done" : "todo-text"}>{task.title}</span>
        {task.priority === "urgent" || task.dueDate ? (
          <div className="todo-meta">
            {task.priority === "urgent" ? (
              <span className="tag" style={{ background: "var(--color-primary-deep)", color: "white" }}>
                Urgent
              </span>
            ) : null}
            {task.dueDate ? (
              <span className="tag" style={{ background: "var(--color-border)" }}>
                {formatDueDate(task.dueDate)}
              </span>
            ) : null}
            {dueSoon ? <span className="due-warning">⚠ Due soon</span> : null}
          </div>
        ) : null}
      </div>

      <div className="todo-actions">
        <button className="todo-action-btn edit" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button className="todo-action-btn delete" onClick={() => onDelete(task)}>
          Delete
        </button>
      </div>
    </div>
  );
}
