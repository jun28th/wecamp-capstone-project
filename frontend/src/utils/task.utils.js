export function todayDateOnly() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Due-date filter choices for the to-do list. The values are the dueFilter
// query param the backend understands (see backend taskDueFilter.util.js).
export const DEFAULT_DUE_FILTER = "all";
export const DUE_FILTER_OPTIONS = [
  { value: "all", label: "All due dates" },
  { value: "overdue", label: "Overdue" },
  { value: "today", label: "Due today" },
  { value: "week", label: "Due in 7 days" },
  { value: "none", label: "No due date" },
];

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

export function isDueSoon(task) {
  if (!task.dueDate || task.isCompleted || isOverdue(task)) return false;
  const due = new Date(`${task.dueDate}T23:59:59`);
  const diffMs = due - new Date();
  return diffMs >= 0 && diffMs <= 24 * 60 * 60 * 1000;
}

// Puts completed tasks below open ones. Completed tasks are ordered by when they
// were completed, so the one just ticked lands at the very bottom. Returns 0 when
// both are open (or both lack a completedAt) so the normal sort rank decides.
export function compareByCompletion(a, b) {
  const aDone = Boolean(a.isCompleted);
  const bDone = Boolean(b.isCompleted);
  if (aDone !== bDone) return aDone ? 1 : -1;
  if (!aDone) return 0;
  const aAt = a.completedAt ?? "";
  const bAt = b.completedAt ?? "";
  if (aAt === bAt) return 0;
  return aAt < bAt ? -1 : 1;
}

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
