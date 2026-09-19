// Pure helpers that turn the to-do "due date" filter (KAN-88) into a neutral
// criteria object. Kept separate from task.service.js so the date logic is
// testable without touching the DB layer; the repository maps the criteria
// to SQL. Due dates are DATEONLY ("YYYY-MM-DD" strings).
import AppError from "../utils/AppError.js";
import { addDays } from "./cyclePrediction.util.js";

const DUE_FILTERS = ["all", "overdue", "today", "week", "none"];
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

// "YYYY-MM-DD" that is also a real calendar date (rejects e.g. 2026-02-31).
function isValidDateOnly(value) {
  if (typeof value !== "string" || !DATE_ONLY.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return (
    date.getUTCFullYear() === y &&
    date.getUTCMonth() === m - 1 &&
    date.getUTCDate() === d
  );
}

function serverToday() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

// today is the caller's calendar date: "today" / "overdue" depend on the
// user's timezone, which can differ from the server's, so the client sends its
// own date and the server date is only the fallback when it is omitted.
//
//   all     -> null (no condition)
//   none    -> no due date
//   overdue -> due before today and not completed (same as the frontend isOverdue)
//   today   -> due today (completed tasks included)
//   week    -> due from today up to and including today + 7 days
function resolveDueCriteria(dueFilter, today) {
  const filter = dueFilter || "all";
  if (!DUE_FILTERS.includes(filter)) {
    throw new AppError("Invalid due date filter", 400);
  }
  if (filter === "all") return null;
  if (filter === "none") return { none: true };

  if (today !== undefined && !isValidDateOnly(today)) {
    throw new AppError("Invalid today date", 400);
  }
  const base = today ?? serverToday();

  if (filter === "overdue") return { before: base, incompleteOnly: true };
  if (filter === "today") return { on: base };
  return { from: base, to: addDays(base, 7) };
}

export { DUE_FILTERS, isValidDateOnly, resolveDueCriteria };
