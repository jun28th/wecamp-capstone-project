import { DUE_FILTER_OPTIONS } from "@utils/task.utils";

// Native <select> for the to-do due-date filter (matches the design). onChange
// receives the selected value, not the event. className styles the select
// itself; every other prop goes straight to the <select>.
export default function DueDateFilter({
  value,
  onChange,
  className = "",
  ...rest
}) {
  return (
    <select
      aria-label="Filter tasks by due date"
      className={`min-w-42 flex-none cursor-pointer rounded-input border-[1.5px] border-border bg-surface-2 px-3.5 py-2.5 font-body text-[15px] text-fg outline-none focus:border-primary-deep focus:ring-3 focus:ring-primary/35 max-[479px]:flex-[1_1_100%] ${className}`}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      {...rest}
    >
      {DUE_FILTER_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
