import { useTasks } from "../hooks/useTasks";
import { useGoal } from "../hooks/useGoal";
import ProgressCard from "./feature/ToDo/ProgressCard";
import GoalCard from "./feature/ToDo/GoalCard";
import Modal from "./Modal";
import TaskForm from "./feature/ToDo/TaskForm";
import Button from "./Button";
import ToDoCheckbox from "./ToDoCheckbox";
import Card from "./Card";
import CelebrationModal from "./feature/ToDo/CelebrationModal";
import { useCelebration } from "../hooks/useCelebration";
import { useTaskModals } from "../hooks/useTaskModals";
import { useNavigate } from "react-router-dom";

function DashboardTask() {
  const navigate = useNavigate();
  const { tasks, progress, addTask, editTask, removeTask, toggleComplete } =
    useTasks();

  const { goal, saveGoal, removeGoal } = useGoal();
  const [celebrationOpen, setCelebrationOpen] = useCelebration(
    progress.pct,
    Boolean(goal),
  );

  const unlocked = progress.pct === 100;

  const { formOpen, editingTask, openCreateForm, closeForm, handleSave } =
    useTaskModals({ addTask, editTask, removeTask });

  const visibleTasks = tasks.slice(0, 5);
  return (
    <div className="flex-col space-y-2">
      <GoalCard
        goal={goal}
        unlocked={unlocked}
        onSave={saveGoal}
        onRemove={removeGoal}
      />
      <ProgressCard progress={progress} />
      <section>
        <div className="section-header-row">
          <h2>Today's Tasks</h2>
          <button className="btn-add-task" onClick={openCreateForm}>
            + Add Task
          </button>
        </div>
        <Card>
          <div className="flex flex-col space-y-2 max-h-[300px]">
            {visibleTasks.map((task, index) => {
              return (
                <div
                  key={task.id}
                  className={`flex items-center justify-between border-[var(--border)] ${index === visibleTasks.length - 1 ? "" : "border-b-1"}`}
                >
                  <>
                    <ToDoCheckbox
                      checked={task.isCompleted}
                      onClick={() => toggleComplete(task)}
                    />
                    <div className="todo-content">
                      <span
                        className={
                          task.isCompleted ? "todo-text done" : "todo-text"
                        }
                      >
                        {task.title}
                      </span>
                    </div>
                  </>
                  {task.priority === "urgent" ? (
                    <span
                      className="tag"
                      style={{
                        background: "var(--color-primary-deep)",
                        color: "white",
                        fontSize: "11px",
                        padding: "2px 8px",
                      }}
                    >
                      Urgent
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
          <Button variant="text" onClick={() => navigate("/to-do")}>
            View all →
          </Button>
        </Card>
      </section>
      <Modal open={formOpen} title="Add New Task" onCancel={closeForm}>
        <TaskForm
          initialTask={editingTask}
          onSave={handleSave}
          onCancel={closeForm}
        />
      </Modal>
      <CelebrationModal
        open={celebrationOpen}
        rewardText={goal?.rewardText}
        onClose={() => setCelebrationOpen(false)}
      />
    </div>
  );
}

export default DashboardTask;
