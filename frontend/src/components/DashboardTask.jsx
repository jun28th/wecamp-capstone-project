import { useEffect, useState, useRef } from "react";
import { useTasks } from "../hooks/useTasks";
import { useGoal } from "../hooks/useGoal";
import ProgressCard from "./ProgressCard";
import GoalCard from "./GoalCard";
import Modal from "./Modal";
import TaskForm from "./TaskForm";
import Button from "./Button";
import ToDoCheckbox from "./ToDoCheckbox";
import Card from "./Card";
import CelebrationModal from "./CelebrationModal";

function DashboardTask() {
  const { tasks, progress, addTask, toggleComplete } = useTasks();
  const [editingTask, setEditingTask] = useState(null);
  const [celebrationOpen, setCelebrationOpen] = useState(false);
  const { goal, saveGoal, removeGoal } = useGoal();
  const [formOpen, setFormOpen] = useState(false);
  const unlocked = progress.pct === 100;
  const previousPctRef = useRef(null);

  function openCreateForm() {
    setEditingTask(null);
    setFormOpen(true);
  }

  async function handleSave(data) {
    const success = await addTask(data);
    if (success) {
      setFormOpen(false);
      setEditingTask(null);
    }
  }
  const viewAll = () => {
    window.location.href = "/to-do";
  };
  const visibleTasks = tasks.slice(0, 5);
  useEffect(() => {
    if (
      goal &&
      unlocked &&
      previousPctRef.current !== null &&
      previousPctRef.current < 100
    ) {
      setCelebrationOpen(true);
    }
    previousPctRef.current = progress.pct;
  }, [progress.pct, unlocked, goal]);
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
          <Button variant="text" onClick={viewAll}>
            View all →
          </Button>
        </Card>
      </section>
      <Modal
        open={formOpen}
        title="Add New Task"
        onCancel={() => setFormOpen(false)}
      >
        <TaskForm
          initialTask={editingTask}
          onSave={handleSave}
          onCancel={() => setFormOpen(false)}
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
