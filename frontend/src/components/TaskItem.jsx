import ToDoCheckbox from "./ToDoCheckbox";
import Button from "./Button";

export default function TaskItem({ task, onToggleComplete, onEdit, onDelete }) {
  return (
    <div className="task-item">
      <div className="task-item-main">
        <ToDoCheckbox
          text={task.title}
          checked={task.isCompleted}
          onClick={() => onToggleComplete(task)}
        />
      </div>
      <div className="task-item-actions">
        <Button variant="text" onClick={() => onEdit(task)}>
          Edit
        </Button>
        <Button variant="text" onClick={() => onDelete(task)}>
          Delete
        </Button>
      </div>
    </div>
  );
}
