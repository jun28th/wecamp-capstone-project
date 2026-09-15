import React from "react";
export const CycleButton = React.memo(
  ({ actionType, statusText, onOpenConfirm }) => {
    const msg = actionType == "START" ? "Start cycle" : "End cycle";
    return (
      <div style={{ maxWidth: "560px", margin: "0 auto" }}>
        {statusText && (
          <div
            id="cycle-status-display"
            className="text-caption"
            style={{ marginBottom: "12px", textAlign: "center" }}
          >
            {statusText}
          </div>
        )}
        <button
          id="cycle-quick-action"
          className="btn btn-primary"
          style={{ width: "100%" }}
          onClick={onOpenConfirm}
        >
          {msg}
        </button>
      </div>
    );
  },
);
