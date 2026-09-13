import { formatStringDateToMonthDay } from "../../utils/calendar.utils";

export default function Confirmation({
  isHover,
  date,
  actionType,
  onCancel,
  onConfirmCycleAction,
}) {
  if (!isHover) return null;
  const msg =
    actionType == "START"
      ? `Mark ${formatStringDateToMonthDay(date)} as cycle start?`
      : `Mark ${formatStringDateToMonthDay(date)} as cycle end?`;
  console.log(actionType);
  return (
    <div id="confirm-popover" className="popover">
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
