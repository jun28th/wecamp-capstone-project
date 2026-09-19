import { useCallback, useEffect, useRef, useState } from "react";
import taskApi from "@api/taskApi";
import { useToast } from "@contexts/toastContext";
import { getTaskSortRank, todayDateOnly } from "@utils/task.utils";

// Urgent overdue > Normal overdue > Urgent due today > Normal due today >
// Urgent future due date > Normal future due date > Urgent no due date > Normal no due date
function sortTasks(tasks) {
  return tasks.slice().sort((a, b) => getTaskSortRank(a) - getTaskSortRank(b));
}

// Today's progress/reward should only depend on tasks due today or with no
// due date - a task due later shouldn't block unlocking today's reward.
function isDueTodayOrUndated(task) {
  return !task.dueDate || task.dueDate <= todayDateOnly();
}

// Shared task data + actions, reusable by both the full /to-do page and a
// dashboard preview card (both need the same fetch/add/edit/delete/toggle
// behavior and toast feedback, just rendered differently).
export function useTasks() {
  // tasks is what the list shows (search applied); allTasks is every task and
  // is what progress / the celebration are computed from, so searching can
  // never change today's progress or unlock the reward.
  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const latestRequestRef = useRef(0);
  const showToast = useToast();

  const loadTasks = useCallback(async () => {
    const requestId = ++latestRequestRef.current;
    try {
      // The full list is always fetched; the filtered one is only a second
      // (parallel) request while a search is active, so no search = 1 request.
      const [all, visible] = await Promise.all([
        taskApi.getTasks(),
        searchTerm ? taskApi.getTasks({ search: searchTerm }) : null,
      ]);
      // A newer load started meanwhile - don't let this older response win.
      if (requestId !== latestRequestRef.current) return;
      setAllTasks(all);
      setTasks(visible ?? all);
    } catch (error) {
      if (requestId === latestRequestRef.current) {
        showToast("Failed to load tasks", "error");
      }
    }
  }, [searchTerm, showToast]);

  // Debounce refetching while the user is still typing in the search box. With
  // an empty box (first load, or the search was just cleared) there is nothing
  // to wait for, so fetch right away - otherwise every surface using this hook,
  // e.g. the Home dashboard, would show its tasks 300ms late.
  useEffect(() => {
    if (!searchTerm) {
      loadTasks();
      return;
    }
    const timeoutId = setTimeout(() => {
      loadTasks();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [loadTasks, searchTerm]);

  const addTask = useCallback(
    async (data) => {
      try {
        await taskApi.createTask(data);
        showToast("Task added successfully");
        await loadTasks();
        return true;
      } catch (error) {
        showToast("Something went wrong, please try again", "error");
        return false;
      }
    },
    [loadTasks, showToast],
  );

  const editTask = useCallback(
    async (id, data) => {
      try {
        await taskApi.updateTask(id, data);
        showToast("Task updated successfully");
        await loadTasks();
        return true;
      } catch (error) {
        showToast("Something went wrong, please try again", "error");
        return false;
      }
    },
    [loadTasks, showToast],
  );

  const removeTask = useCallback(
    async (id) => {
      try {
        await taskApi.deleteTask(id);
        showToast("Task deleted successfully");
        await loadTasks();
        return true;
      } catch (error) {
        showToast("Failed to delete task", "error");
        return false;
      }
    },
    [loadTasks, showToast],
  );

  const toggleComplete = useCallback(
    async (task) => {
      try {
        await taskApi.toggleComplete(task.id, !task.isCompleted);
        await loadTasks();
      } catch (error) {
        showToast("Failed to update task", "error");
      }
    },
    [loadTasks, showToast],
  );

  const tasksForProgress = allTasks.filter(isDueTodayOrUndated);
  const total = tasksForProgress.length;
  const done = tasksForProgress.filter((task) => task.isCompleted).length;

  return {
    tasks: sortTasks(tasks),
    totalTasks: allTasks.length,
    progress: { total, done, pct: total === 0 ? 0 : Math.round((done / total) * 100) },
    loadTasks,
    addTask,
    editTask,
    removeTask,
    toggleComplete,
    searchTerm,
    setSearchTerm,
  };
}
