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

  // Kiểm tra xem có phải dạng popover trên top Dashboard hay không dựa vào className truyền vào
  const isTopPopover = className.includes("top-confirmation-popover");

  return (
    <div
      id="confirm-popover"
      onClick={(e) => e.stopPropagation()}
      className={`absolute z-[200] bg-[var(--color-surface-alt)] border-[1.5px] border-[var(--border)] rounded-[var(--radius-card)] shadow-[var(--shadow-3)] p-4 max-w-[280px] ${
        isTopPopover
          ? "!fixed !top-4 !left-1/2 !-translate-x-1/2 !w-[90%] !max-w-[560px] !z-[9999] !p-[14px_20px] !flex !justify-between !items-center !gap-4 animate-[slideDownTop_0.25s_ease-out]"
          : "top-[99%] left-[40%]"
      } ${className}`}
    >
      <div className={isTopPopover ? "flex justify-between items-center w-full gap-4 m-0" : "flex flex-col"}>
        <p 
          id="popover-message" 
          className={`m-0 text-[14px] font-medium text-[var(--color-ink)] ${isTopPopover ? "whitespace-nowrap" : "mb-3"}`}
        >
          {msg}
        </p>
        <div className={`flex gap-2 shrink-0 m-0 ${isTopPopover ? "" : "justify-end"}`}>
          <button
            className="bg-transparent border-[1.5px] border-[var(--border)] text-[var(--muted)] font-body text-[14px] font-semibold px-4 py-2 rounded-[var(--radius-pill)] cursor-pointer transition-all duration-[150ms] ease-[var(--ease-out)] hover:border-[var(--color-primary-deep)] hover:text-[var(--color-ink)]"
            id="popover-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="bg-[var(--color-primary)] text-[var(--color-ink)] border-none font-body text-[14px] font-semibold px-4 py-2 rounded-[var(--radius-pill)] cursor-pointer shadow-[var(--shadow-2)] transition-all duration-[150ms] ease-[var(--ease-out)] hover:bg-[var(--color-primary-deep)] hover:text-white hover:scale-[1.02]"
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