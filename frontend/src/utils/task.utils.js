export function todayDateOnly() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDueDate(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function isOverdue(task) {
  if (!task.dueDate || task.isCompleted) return false;
  return task.dueDate < todayDateOnly();
}

export function isDueTodayDate(task) {
  return !!task.dueDate && task.dueDate === todayDateOnly();
}

// Due today or within the next 24 hours (and not yet completed) - applies to any
// task, urgent or not. An overdue task is never "due soon" - mutually exclusive states.
export function isDueSoon(task) {
  if (!task.dueDate || task.isCompleted || isOverdue(task)) return false;
  const due = new Date(`${task.dueDate}T23:59:59`);
  const diffMs = due - new Date();
  return diffMs >= 0 && diffMs <= 24 * 60 * 60 * 1000;
}

// Sort priority per KAN-64: urgent first (in full), then normal (in full);
// within each, overdue > due today > has a future due date > no due date.
export function getTaskSortRank(task) {
  const overdue = isOverdue(task);
  const dueToday = isDueTodayDate(task);
  const hasFutureDue = !!task.dueDate && !overdue && !dueToday;

  let dateRank;
  if (overdue) dateRank = 0;
  else if (dueToday) dateRank = 1;
  else if (hasFutureDue) dateRank = 2;
  else dateRank = 3;

  return (task.priority === "urgent" ? 0 : 4) + dateRank;
}
