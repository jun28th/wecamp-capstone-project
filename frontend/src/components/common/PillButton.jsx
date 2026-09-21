// Pill-shaped action button for modal / form footers. "cancel" is the outlined
// neutral button, "danger" is the filled red confirm button (e.g. Delete).
const VARIANT_CLASS = {
  cancel:
    "border-[1.5px] border-border text-muted hover:border-primary-deep hover:text-ink",
  danger: "bg-error-text text-white hover:opacity-88",
};

export default function PillButton({ variant = "cancel", children, ...rest }) {
  return (
    <button
      className={`cursor-pointer rounded-pill px-5 py-2.5 font-body text-[14px] font-semibold transition-all duration-150 ease-[ease-out] ${VARIANT_CLASS[variant]}`}
      {...rest}
    >
      {children}
    </button>
  );
}
