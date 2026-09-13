import React from "react";
import { useToast } from "../Toast";
export const CycleButton = React.memo(
  ({ date, actionType, onConfirmCycleAction }) => {
    const showToast = useToast();
    const handleConfirm = () => {
      onConfirmCycleAction(date, actionType);
      const msg =
        actionType == "START"
          ? "Cycle logged successfully"
          : "Cycle ended successfully";
      showToast(msg);
    };
    const msg = actionType == "START" ? "Start cycle" : "End cycle";
    return (
      <div style={{ maxWidth: "560px", margin: "0 auto" }}>
        <div id="cycle-status-display" style={{ marginBottom: "12px" }}></div>
        <button
          id="cycle-quick-action"
          className="btn btn-primary"
          style={{ width: "100%" }}
          onClick={handleConfirm}
        >
          {msg}
        </button>
      </div>
    );
  },
);
