import { useState } from "react";
import Button from "@common/Button";
import PillButton from "@common/PillButton";
import FormField from "./FormField";
import Switch from "./Switch";

const TASK_TITLE_MAX_LENGTH = 255;

function validateTitle(title) {
  const trimmed = title.trim();

  if (!trimmed) {
    return "Task name cannot be empty";
  }
  if (trimmed.length > TASK_TITLE_MAX_LENGTH) {
    return `Task name must be at most ${TASK_TITLE_MAX_LENGTH} characters`;
  }
  return null;
}

export default function TaskForm({ initialTask, onSave, onCancel }) {
  const isEditing = Boolean(initialTask);
  const [title, setTitle] = useState(initialTask?.title ?? "");
  const [dueDate, setDueDate] = useState(initialTask?.dueDate ?? "");
  const [urgent, setUrgent] = useState((initialTask?.priority ?? "normal") === "urgent");
  const [nameError, setNameError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    const error = validateTitle(title);
    if (error) {
      setNameError(error);
      return;
    }

    setNameError(null);
    onSave({
      title: title.trim(),
      dueDate: dueDate || null,
      priority: urgent ? "urgent" : "normal",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormField
        id="task-name-input"
        label="Task name"
        type="text"
        placeholder="Enter task name..."
        value={title}
        maxLength={TASK_TITLE_MAX_LENGTH}
        onChange={(event) => setTitle(event.target.value)}
        error={nameError}
      />

      <FormField
        id="task-due-input"
        label="Due date (optional)"
        type="date"
        value={dueDate}
        onChange={(event) => setDueDate(event.target.value)}
      />

      <div className="mt-5 flex items-center justify-between gap-2.5">
        <Switch
          label="Urgent"
          checked={urgent}
          onChange={(event) => setUrgent(event.target.checked)}
        />
        <div className="flex gap-2.5">
          <PillButton type="button" onClick={onCancel}>
            Cancel
          </PillButton>
          <Button type="submit" variant="default">
            {isEditing ? "Update" : "Save"}
          </Button>
        </div>
      </div>
    </form>
  );
}