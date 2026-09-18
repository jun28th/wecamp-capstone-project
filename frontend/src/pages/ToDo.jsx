import { useEffect, useRef, useState } from "react";
import { useTasks } from "../hooks/useTasks";
import { useGoal } from "../hooks/useGoal";
import Modal from "../components/Modal";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import PhaseMessage from "../components/PhaseMessage";
import { getPhaseMessage } from "../api/cycleApi";
import GoalCard from "../components/GoalCard";
import ProgressCard from "../components/ProgressCard";
import CelebrationModal from "../components/CelebrationModal";
import PageHeader from "../components/feature/ToDo/PageHeader"

function ToDo() {
  const { tasks, progress, addTask, editTask, removeTask, toggleComplete } = useTasks();
  const { goal, saveGoal, removeGoal } = useGoal();
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskPendingDelete, setTaskPendingDelete] = useState(null);
  const [phaseMessage, setPhaseMessage] = useState(null);
  const [celebrationOpen, setCelebrationOpen] = useState(false);
  const previousPctRef = useRef(null);
  const unlocked = progress.pct === 100;

  useEffect(() => {
    if (goal && unlocked && previousPctRef.current !== null && previousPctRef.current < 100) {
      setCelebrationOpen(true);
    }
    previousPctRef.current = progress.pct;
  }, [progress.pct, unlocked, goal]);

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

  useEffect(() => {
    async function loadPhaseMessage() {
      try {
        const result = await getPhaseMessage();
        if (result.success) {
          setPhaseMessage(result.data);
        }
      } catch (error) {
        console.error(error.response?.data?.message || error.message);
      }
    }

    loadPhaseMessage();
  }, []); // Mảng rỗng [] nghĩa là chỉ gọi 1 lần duy nhất khi component mount
  return (
    <div className="app-shell">
      <PageHeader />
      <PhaseMessage phaseMessage={phaseMessage}/>

      <GoalCard goal={goal} unlocked={unlocked} onSave={saveGoal} onRemove={removeGoal} />
      <ProgressCard progress={progress} />

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

      <CelebrationModal
        open={celebrationOpen}
        rewardText={goal?.rewardText}
        onClose={() => setCelebrationOpen(false)}
      />
    </div>
  );
}

export default ToDo;
