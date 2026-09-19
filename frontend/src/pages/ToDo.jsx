import { useTasks } from "@hooks/useTasks";
import { useGoal } from "@hooks/useGoal";
import Modal from "@components/Modal";
import TaskForm from "@features/ToDo/TaskForm";
import TaskList from "@features/ToDo/TaskList";
import PhaseMessage from "@common/PhaseMessage";
import GoalCard from "@features/ToDo/GoalCard";
import ProgressCard from "@features/ToDo/ProgressCard";
import CelebrationModal from "@features/ToDo/CelebrationModal";
import PageHeader from "@features/ToDo/PageHeader";
import { useCelebration } from "@hooks/useCelebration";
import { usePhaseMessage } from "@hooks/usePhaseMessage";
import { useTaskModals } from "@hooks/useTaskModals";

function ToDo() {
  const { tasks, progress, addTask, editTask, removeTask, toggleComplete } =
    useTasks();
  const { goal, saveGoal, removeGoal } = useGoal();
  const phaseMessage = usePhaseMessage();
  const [celebrationOpen, setCelebrationOpen] = useCelebration(
    progress.pct,
    Boolean(goal),
  );
  const unlocked = progress.pct === 100;

  const {
    formOpen,
    editingTask,
    taskPendingDelete,
    openCreateForm,
    openEditForm,
    closeForm,
    handleSave,
    handleConfirmDelete,
    setTaskPendingDelete,
  } = useTaskModals({ addTask, editTask, removeTask });

  return (
    <div className="app-shell">
      <PageHeader />
      <PhaseMessage phaseMessage={phaseMessage} />
      <GoalCard
        goal={goal}
        unlocked={unlocked}
        onSave={saveGoal}
        onRemove={removeGoal}
      />
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

      <Modal
        open={formOpen}
        title={editingTask ? "Edit Task" : "Add New Task"}
        onCancel={closeForm}
      >
        <TaskForm
          initialTask={editingTask}
          onSave={handleSave}
          onCancel={closeForm}
        />
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
