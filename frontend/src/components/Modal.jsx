import Button from "./Button";

export default function Modal({ open, title, children, onConfirm, onCancel, confirmLabel = "Confirm", cancelLabel = "Cancel" }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        {title ? <h3>{title}</h3> : null}
        <div className="modal-body">{children}</div>
        {onConfirm ? (
          <div className="row" style={{ justifyContent: "flex-end" }}>
            <Button variant="outline" onClick={onCancel}>
              {cancelLabel}
            </Button>
            <Button variant="default" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
