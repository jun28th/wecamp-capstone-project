import { useEffect, useState } from "react";
import taskApi from "../api/taskApi";
import { useToast } from "../components/Toast";
import Button from "../components/Button";
import Modal from "../components/Modal";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";

function ToDo() {
  const [tasks, setTasks] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskPendingDelete, setTaskPendingDelete] = useState(null);
  const showToast = useToast();

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      const data = await taskApi.getTasks();
      setTasks(data);
    } catch (error) {
      showToast("Failed to load tasks", "error");
    }
  }

  function openCreateForm() {
    setEditingTask(null);
    setFormOpen(true);
  }

  function openEditForm(task) {
    setEditingTask(task);
    setFormOpen(true);
  }

  async function handleSave(data) {
    try {
      if (editingTask) {
        await taskApi.updateTask(editingTask.id, data);
        showToast("Task updated successfully");
      } else {
        await taskApi.createTask(data);
        showToast("Task added successfully");
      }
      setFormOpen(false);
      setEditingTask(null);
      await loadTasks();
    } catch (error) {
      showToast("Something went wrong, please try again", "error");
    }
  }

  async function handleToggleComplete(task) {
    try {
      await taskApi.toggleComplete(task.id, !task.isCompleted);
      await loadTasks();
    } catch (error) {
      showToast("Failed to update task", "error");
    }
  }

  async function handleConfirmDelete() {
    try {
      await taskApi.deleteTask(taskPendingDelete.id);
      showToast("Task deleted successfully");
      setTaskPendingDelete(null);
      await loadTasks();
    } catch (error) {
      showToast("Failed to delete task", "error");
    }
  }

  return (
    <div className="app-shell">
      <div className="section-header-row">
        <h2>To-do list</h2>
        <Button variant="fab" onClick={openCreateForm}>
          +
        </Button>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <p>No tasks yet. Click "Add task" to get started!</p>
        </div>
      ) : (
        <div>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onEdit={openEditForm}
              onDelete={setTaskPendingDelete}
            />
          ))}
        </div>
      )}

      {formOpen ? (
        <Modal open title={editingTask ? "Edit task" : "Add task"} onCancel={() => setFormOpen(false)} onConfirm={undefined}>
          <TaskForm
            initialTask={editingTask ?? undefined}
            onSave={handleSave}
            onCancel={() => setFormOpen(false)}
          />
        </Modal>
      ) : null}

      <Modal
        open={Boolean(taskPendingDelete)}
        title={`Delete task "${taskPendingDelete?.title}"?`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setTaskPendingDelete(null)}
      >
        Are you sure you want to delete this task?
      </Modal>
    </div>
  );
}

export default ToDo;
