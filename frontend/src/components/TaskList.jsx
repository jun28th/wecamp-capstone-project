import TaskItem from "./TaskItem";

// limit lets a dashboard preview show just the first N tasks (design shows 5)
// while the full /to-do page renders everything by leaving it unset.
export default function TaskList({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
  compact = false,
  limit,
  emptyMessage = 'No tasks yet. Click "Add Task" to get started!',
}) {
  const visibleTasks = limit ? tasks.slice(0, limit) : tasks;

  if (visibleTasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">✓</div>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {visibleTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
          compact={compact}
        />
      ))}
    </div>
  );
}
