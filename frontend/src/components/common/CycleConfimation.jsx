import React from "react";
import { formatStringDateToMonthDay } from "@utils/calendar.utils";

export const CycleConfirmation = React.memo(({
  isOpen,
  date,
  actionType,
  onCancel,
  onConfirmCycleAction,
  className = "", // Nhận class riêng biệt tùy theo ngữ cảnh gọi
}) => {
  if (!isOpen) return null;

  const isStartAction = ["START", "START_PAST", "INIT_PAST_START"].includes(actionType);
  const msg = isStartAction
    ? `Mark ${formatStringDateToMonthDay(date)} as cycle start?`
    : `Mark ${formatStringDateToMonthDay(date)} as cycle end?`;

  return (
    <div
      id="confirm-popover"
      className={`popover ${className}`} // Gắn class linh hoạt vào đây
      onClick={(e) => e.stopPropagation()}
    >
      <div className="popover-content">
        <p id="popover-message">{msg}</p>
        <div className="popover-actions">
          <button
            className="btn-secondary"
            id="popover-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="btn-primary"
            id="popover-confirm"
            onClick={() => onConfirmCycleAction(date, actionType)}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
});