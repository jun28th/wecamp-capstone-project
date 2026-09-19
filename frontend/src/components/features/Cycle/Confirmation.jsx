import { formatStringDateToMonthDay } from "@utils/calendar.utils";

export default function Confirmation({
  isHover,
  date,
  actionType,
  onCancel,
  onConfirmCycleAction,
}) {
  if (!isHover) return null;

  // Sử dụng .includes() hoặc === với strict equality, tránh dùng ==
  const isStartAction = ["START", "START_PAST"].includes(actionType);

  const msg = isStartAction
    ? `Mark ${formatStringDateToMonthDay(date)} as cycle start?`
    : `Mark ${formatStringDateToMonthDay(date)} as cycle end?`;

  return (
    <div
      id="confirm-popover"
      className="popover"
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
}
