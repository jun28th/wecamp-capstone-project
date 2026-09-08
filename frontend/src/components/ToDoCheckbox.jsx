export default function ToDoCheckbox({ text, checked = false, onClick }) {
  return (
    <div className="todo" onClick={onClick}>
      <div className={checked ? "checkbox checked" : "checkbox"}>
        {checked ? "♥" : null}
      </div>
      <span className={checked ? "todo-text done" : "todo-text"}>
        {text}
      </span>
    </div>
  );
}
