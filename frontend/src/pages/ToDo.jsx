import { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import Modal from "../components/Modal";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

function todayEyebrow() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function ToDo() {
  const { tasks, addTask, editTask, removeTask, toggleComplete } = useTasks();
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskPendingDelete, setTaskPendingDelete] = useState(null);

  function openCreateForm() {
    setEditingTask(null);
    setFormOpen(true);
  }

  function openEditForm(task) {
    setEditingTask(task);
    setFormOpen(true);
  }

  async function handleSave(data) {
    const success = editingTask ? await editTask(editingTask.id, data) : await addTask(data);
    if (success) {
      setFormOpen(false);
      setEditingTask(null);
    }
  }

  async function handleConfirmDelete() {
    const success = await removeTask(taskPendingDelete.id);
    if (success) {
      setTaskPendingDelete(null);
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <p className="eyebrow">{todayEyebrow()}</p>
        <h1>Today's Tasks</h1>
      </header>

      <section>
        <div className="section-header-row">
          <h2>Task List</h2>
          <button className="btn-add-task" onClick={openCreateForm}>
            + Add Task
          </button>
        </div>

        <div className="card">
          <TaskList
            tasks={tasks}
            onToggleComplete={toggleComplete}
            onEdit={openEditForm}
            onDelete={setTaskPendingDelete}
          />
        </div>
      </section>

      <Modal open={formOpen} title={editingTask ? "Edit Task" : "Add New Task"} onCancel={() => setFormOpen(false)}>
        <TaskForm initialTask={editingTask} onSave={handleSave} onCancel={() => setFormOpen(false)} />
      </Modal>

      <Modal
        open={Boolean(taskPendingDelete)}
        title="Delete task?"
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setTaskPendingDelete(null)}
      >
        <p style={{ margin: 0, color: "var(--color-ink)", fontSize: "15px" }}>
          Are you sure you want to delete "{taskPendingDelete?.title}"?
        </p>
      </Modal>
    </div>
  );
}

export default ToDo;
