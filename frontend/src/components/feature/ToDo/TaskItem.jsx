import { formatDueDate, isDueSoon, isOverdue } from "../../../utils/task.utils";
import ToDoCheckbox from "../../common/ToDoCheckbox";

// compact=true renders the trimmed-down row used by preview surfaces (e.g. a
// dashboard card): checkbox + title + urgent tag only, no due-date meta or
// edit/delete actions. The full /to-do page uses the default (compact=false).
export default function TaskItem({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  compact = false,
}) {
  if (compact) {
    return (
      <div className="todo-item">
        <ToDoCheckbox
          checked={task.isCompleted}
          onClick={() => onToggleComplete(task)}
        />
        <span className={task.isCompleted ? "todo-text done" : "todo-text"}>
          {task.title}
        </span>
        {task.priority === "urgent" ? (
          <span
            className="tag"
            style={{
              background: "var(--color-primary-deep)",
              color: "white",
              fontSize: "11px",
              padding: "2px 8px",
            }}
          >
            Urgent
          </span>
        ) : null}
      </div>
    );
  }

  const dueSoon = isDueSoon(task);
  const overdue = isOverdue(task);

  return (
    <div className="todo-item">
      <ToDoCheckbox
        checked={task.isCompleted}
        onClick={() => onToggleComplete(task)}
      />

      <div className="todo-content">
        <span className={task.isCompleted ? "todo-text done" : "todo-text"}>
          {task.title}
        </span>
        {task.priority === "urgent" || task.dueDate ? (
          <div className="todo-meta">
            {task.priority === "urgent" ? (
              <span
                className="tag"
                style={{
                  background: "var(--color-primary-deep)",
                  color: "white",
                }}
              >
                Urgent
              </span>
            ) : null}
            {task.dueDate ? (
              <span
                className="tag"
                style={{ background: "var(--color-border)" }}
              >
                {formatDueDate(task.dueDate)}
              </span>
            ) : null}
            {overdue ? (
              <span
                className="tag"
                style={{
                  background: "var(--color-error-text)",
                  color: "white",
                }}
              >
                Overdue
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
        <button
          className="todo-action-btn delete"
          onClick={() => onDelete(task)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
