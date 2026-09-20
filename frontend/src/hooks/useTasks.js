import { useCallback, useEffect, useRef, useState } from "react";
import taskApi from "@api/taskApi";
import { useToast } from "@contexts/toastContext";
import {
  DEFAULT_DUE_FILTER,
  getTaskSortRank,
  todayDateOnly,
} from "@utils/task.utils";

function sortTasks(tasks) {
  return tasks.slice().sort((a, b) => getTaskSortRank(a) - getTaskSortRank(b));
}

function isDueTodayOrUndated(task) {
  return !task.dueDate || task.dueDate <= todayDateOnly();
}

export function useTasks() {
  // tasks is what the list shows (search + due-date filter applied); allTasks
  // is every task and is what progress / the celebration are computed from, so
  // filtering can never change today's progress or unlock the reward.
  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dueFilter, setDueFilter] = useState(DEFAULT_DUE_FILTER);
  const latestRequestRef = useRef(0);
  const previousSearchTermRef = useRef("");
  const showToast = useToast();

  const loadTasks = useCallback(async () => {
    const requestId = ++latestRequestRef.current;
    const dueFilterActive = dueFilter !== DEFAULT_DUE_FILTER;
    try {
      // The full list is always fetched; the filtered one is only a second
      // (parallel) request while a filter is active, so no filter = 1 request.
      // "today" is sent because "overdue" / "due today" depend on the user's
      // local date, which can differ from the server's timezone.
      const [all, visible] = await Promise.all([
        taskApi.getTasks(),
        searchTerm || dueFilterActive
          ? taskApi.getTasks({
              ...(searchTerm && { search: searchTerm }),
              ...(dueFilterActive && { dueFilter, today: todayDateOnly() }),
            })
          : null,
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
  }, [searchTerm, dueFilter, showToast]);

  // Debounce refetching only while the user is typing in the search box. Fetch
  // right away when there is nothing to wait for: first load, the search was
  // cleared, or only the due-date filter changed - otherwise every surface
  // using this hook, e.g. the Home dashboard, would show its tasks 300ms late.
  useEffect(() => {
    const searchTermChanged = previousSearchTermRef.current !== searchTerm;
    previousSearchTermRef.current = searchTerm;
    if (!searchTerm || !searchTermChanged) {
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
    dueFilter,
    setDueFilter,
  };
}
