import { useCallback, useEffect, useState } from "react";
import taskApi from "../api/taskApi";
import { useToast } from "../components/Toast";

function sortTasks(tasks) {
  return tasks
    .slice()
    .sort((a, b) => (b.priority === "urgent" ? 1 : 0) - (a.priority === "urgent" ? 1 : 0));
}

function todayDateOnly() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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
  const [tasks, setTasks] = useState([]);
  const showToast = useToast();

  const loadTasks = useCallback(async () => {
    try {
      const data = await taskApi.getTasks();
      setTasks(data);
    } catch (error) {
      showToast("Failed to load tasks", "error");
    }
  }, [showToast]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

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
  };
}
