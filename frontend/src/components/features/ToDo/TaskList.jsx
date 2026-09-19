import TaskItem from "./TaskItem";

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
      <div className="flex flex-col items-center px-5 py-12 text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary-tint text-[26px] font-semibold text-primary-deep">
          ✓
        </div>
        <p className="max-w-80 text-[15px] text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
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
