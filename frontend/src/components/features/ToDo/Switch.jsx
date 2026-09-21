export default function Switch({ label, ...inputProps }) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <span className="relative inline-block h-6.5 w-11 shrink-0">
        <input
          type="checkbox"
          className="peer absolute h-0 w-0 opacity-0"
          {...inputProps}
        />
        <span className="absolute inset-0 rounded-pill bg-border transition-[background] duration-150 ease-[ease-out] before:absolute before:top-0.75 before:left-0.75 before:size-5 before:rounded-full before:bg-white before:shadow-1 before:transition-transform before:duration-150 before:ease-[ease-out] peer-checked:bg-primary-deep peer-checked:before:translate-x-[18px] peer-focus-visible:ring-3 peer-focus-visible:ring-primary/50" />
      </span>
      <span className="text-[15px] font-medium text-ink">{label}</span>
    </label>
  );
}
