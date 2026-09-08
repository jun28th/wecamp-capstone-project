export default function Input({ error, className = "", ...rest }) {
  const inputClass = [error ? "error" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="input-wrap">
      <input type="text" className={inputClass || undefined} {...rest} />
      {error ? <span className="err-msg">{error}</span> : null}
    </div>
  );
}