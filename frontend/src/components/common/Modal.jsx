import PillButton from "@common/PillButton";

// cardClassName adds classes to the modal card (e.g. CelebrationModal needs it
// to be a positioning context for the confetti).
export default function Modal({
  open,
  title,
  children,
  onConfirm,
  onCancel,
  confirmLabel = "Delete",
  cardClassName = "",
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-400 flex items-center justify-center bg-ink/32 p-5"
      onClick={onCancel}
    >
      <div
        className={`w-full max-w-105 rounded-card bg-surface-alt p-6 shadow-4 ${cardClassName}`}
        onClick={(event) => event.stopPropagation()}
      >
        {title ? <h3 className="mb-4 text-[18px] text-ink">{title}</h3> : null}
        {children}
        {onConfirm ? (
          <div className="mt-5 flex justify-end gap-2.5">
            <PillButton onClick={onCancel}>Cancel</PillButton>
            <PillButton variant="danger" onClick={onConfirm}>
              {confirmLabel}
            </PillButton>
          </div>
        ) : null}
      </div>
    </div>
  );
}
