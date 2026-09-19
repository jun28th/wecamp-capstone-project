import { useCallback, useEffect, useState } from "react";
import taskApi from "@api/taskApi";
import { useToast } from "@contexts/toastContext";
import { getTaskSortRank, todayDateOnly } from "@utils/task.utils";

function sortTasks(tasks) {
  return tasks.slice().sort((a, b) => getTaskSortRank(a) - getTaskSortRank(b));
}

function isDueTodayOrUndated(task) {
  return !task.dueDate || task.dueDate <= todayDateOnly();
}

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const showToast = useToast();

  const loadTasks = useCallback(async () => {
    try {
      const data = await taskApi.getTasks({ search: searchTerm });
      setTasks(data);
    } catch (error) {
      showToast("Failed to load tasks", "error");
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

  const tasksForProgress = tasks.filter(isDueTodayOrUndated);
  const total = tasksForProgress.length;
  const done = tasksForProgress.filter((task) => task.isCompleted).length;

  return {
    tasks: sortTasks(tasks),
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
