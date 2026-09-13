export default function Modal({ open, title, children, onConfirm, onCancel, confirmLabel = "Delete" }) {
  if (!open) return null;

  return (
    <div className="modal-overlay open" onClick={onCancel}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        {title ? <h3>{title}</h3> : null}
        {children}
        {onConfirm ? (
          <div className="modal-actions">
            <button className="btn-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button className="btn-confirm-delete" onClick={onConfirm}>
              {confirmLabel}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
