import { useState } from "react";
import Button from "./Button";

export default function TaskForm({ initialTask, onSave, onCancel }) {
  const isEditing = Boolean(initialTask);
  const [title, setTitle] = useState(initialTask?.title ?? "");
  const [dueDate, setDueDate] = useState(initialTask?.dueDate ?? "");
  const [urgent, setUrgent] = useState((initialTask?.priority ?? "normal") === "urgent");
  const [nameError, setNameError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setNameError(true);
      return;
    }

    setNameError(false);
    onSave({
      title: title.trim(),
      dueDate: dueDate || null,
      priority: urgent ? "urgent" : "normal",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="task-name-input">Task name</label>
        <input
          id="task-name-input"
          type="text"
          className={nameError ? "invalid" : undefined}
          placeholder="Enter task name..."
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <p className={nameError ? "field-error show" : "field-error"}>Task name cannot be empty</p>
      </div>

      <div className="form-field">
        <label htmlFor="task-due-input">Due date (optional)</label>
        <input
          id="task-due-input"
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
        />
      </div>

      <div className="modal-actions" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <label className="switch-field">
          <span className="switch">
            <input
              type="checkbox"
              checked={urgent}
              onChange={(event) => setUrgent(event.target.checked)}
            />
            <span className="switch-track"></span>
          </span>
          <span className="switch-label-text">Urgent</span>
        </label>
        <div style={{ display: "flex", gap: "10px" }}>
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <Button type="submit" variant="default">
            {isEditing ? "Update" : "Save"}
          </Button>
        </div>
      </div>
    </form>
  );
}
