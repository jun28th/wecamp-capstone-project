export default function SearchInput({ className = "", ...rest }) {
  return (
    <div className={`relative min-w-50 flex-1 basis-55 ${className}`}>
      <span
        className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[15px] text-muted"
        aria-hidden="true"
      >
        🔍
      </span>
      <input
        type="text"
        className="w-full rounded-input border-[1.5px] border-border bg-surface-2 py-2.5 pr-3.5 pl-10 font-body text-[15px] text-fg outline-none transition-shadow placeholder:text-muted focus:border-primary-deep focus:ring-3 focus:ring-primary/35"
        {...rest}
      />
    </div>
  );
}
