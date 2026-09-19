import React from "react";

export const CycleButton = React.memo(
  ({ actionType, statusText, onOpenConfirm }) => {
    const msg = actionType === "START" ? "Start cycle" : "End cycle";

    return (
      <div className="max-w-[560px] mx-auto">
        {statusText && (
          <div
            id="cycle-status-display"
            className="text-caption mb-3 text-center"
          >
            {statusText}
          </div>
        )}
        <button
          id="cycle-quick-action"
          className="btn btn-primary w-full"
          onClick={onOpenConfirm}
        >
          {msg}
        </button>
      </div>
    );
  },
);