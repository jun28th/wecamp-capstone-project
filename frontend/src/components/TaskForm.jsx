import { useState } from "react";
import Input from "./Input";
import Button from "./Button";

const EMPTY_TASK = { title: "", dueDate: "", priority: "" };

export default function TaskForm({ initialTask = EMPTY_TASK, onSave, onCancel }) {
  const [title, setTitle] = useState(initialTask.title ?? "");
  const [dueDate, setDueDate] = useState(initialTask.dueDate ?? "");
  const [priority, setPriority] = useState(initialTask.priority ?? "");
  const [errors, setErrors] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};
    if (!title.trim()) nextErrors.title = "Task name is required";
    if (!dueDate) nextErrors.dueDate = "Due date is required";
    if (!priority) nextErrors.priority = "Priority is required";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    onSave({ title: title.trim(), dueDate, priority });
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <Input
        placeholder="Task name"
        value={title}
        error={errors.title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <div className="input-wrap">
        <input
          type="date"
          className={errors.dueDate ? "error" : undefined}
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
        />
        {errors.dueDate ? <span className="err-msg">{errors.dueDate}</span> : null}
      </div>

      <div className="input-wrap">
        <select value={priority} onChange={(event) => setPriority(event.target.value)}>
          <option value="">Select priority</option>
          <option value="normal">Normal</option>
          <option value="urgent">Urgent</option>
        </select>
        {errors.priority ? <span className="err-msg">{errors.priority}</span> : null}
      </div>

      <div className="row" style={{ justifyContent: "flex-end" }}>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="default">
          Save
        </Button>
      </div>
    </form>
  );
}
