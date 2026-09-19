import { formatDueDate, isDueSoon, isOverdue } from "@utils/task.utils";
import ToDoCheckbox from "@common/ToDoCheckbox";
import RowActionButton from "./RowActionButton";

const ROW_CLASS =
  "flex items-start gap-3 border-b border-border py-3 last:border-b-0";
const URGENT_TAG = "tag bg-primary-deep text-white";

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
      <div className={ROW_CLASS}>
        <ToDoCheckbox
          checked={task.isCompleted}
          onClick={() => onToggleComplete(task)}
        />
        <span className={task.isCompleted ? "todo-text done" : "todo-text"}>
          {task.title}
        </span>
        {task.priority === "urgent" ? (
          <span className={`${URGENT_TAG} px-2 py-0.5 text-[11px]`}>
            Urgent
          </span>
        ) : null}
      </div>
    );
  }

  const dueSoon = isDueSoon(task);
  const overdue = isOverdue(task);

  return (
    <div className={ROW_CLASS}>
      <ToDoCheckbox
        checked={task.isCompleted}
        onClick={() => onToggleComplete(task)}
      />

      <div className="todo-content">
        <span className={task.isCompleted ? "todo-text done" : "todo-text"}>
          {task.title}
        </span>
        {task.priority === "urgent" || task.dueDate ? (
          <div className="flex flex-wrap items-center gap-1.5">
            {task.priority === "urgent" ? (
              <span className={URGENT_TAG}>Urgent</span>
            ) : null}
            {task.dueDate ? (
              <span className="tag bg-border">
                {formatDueDate(task.dueDate)}
              </span>
            ) : null}
            {overdue ? (
              <span className="tag bg-error-text text-white">Overdue</span>
            ) : null}
            {dueSoon ? (
              <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-error-text">
                ⚠ Due soon
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="flex shrink-0 gap-0.5">
        <RowActionButton tone="edit" onClick={() => onEdit(task)}>
          Edit
        </RowActionButton>
        <RowActionButton tone="delete" onClick={() => onDelete(task)}>
          Delete
        </RowActionButton>
      </div>
    </div>
  );
}
