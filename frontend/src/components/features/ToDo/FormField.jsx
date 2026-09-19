const INPUT_CLASS =
  "w-full rounded-input border-[1.5px] bg-surface-alt px-3.5 py-2.5 font-body text-[15px] text-ink outline-none focus:ring-3 focus:ring-primary/35";

// An invalid field keeps its red border even while focused, so the two
// border states are whole class strings rather than a focus override.
const VALID_BORDER = "border-border focus:border-primary-deep";
const INVALID_BORDER = "border-error-text focus:border-error-text";

// Label + input + optional error message. error is the message to show (falsy
// = valid). className styles the wrapper (default is the standard bottom gap);
// every other prop goes straight to the <input>.
export default function FormField({
  id,
  label,
  error,
  className = "mb-4",
  ...inputProps
}) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[14px] font-medium text-ink"
      >
        {label}
      </label>
      <input
        id={id}
        className={`${INPUT_CLASS} ${error ? INVALID_BORDER : VALID_BORDER}`}
        {...inputProps}
      />
      {error ? (
        <p className="mt-1.5 text-[13px] text-error-text">{error}</p>
      ) : null}
    </div>
  );
}
