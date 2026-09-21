import React, { useState } from "react";
import { CycleConfirmation } from "@common/CycleConfimation";

export const DayCell = React.memo(
  ({
    dayData,
    isToday,
    isFuture,
    isPeriod,
    isPredicted,
    activeStartDate,
    onConfirmCycleAction,
    previewEndDate,
    maxPossibleEndDate,
    onSelectEndDate,
    showEndPopupForDate,
    setShowEndPopupForDate,
    tempPastStart,
    setTempPastStart,
  }) => {
    const [showConfirm, setShowConfirm] = useState(false);

    if (dayData.isEmpty || !dayData.dateString) {
      return <div className="calendar-day empty"></div>;
    }

    const dateStr = dayData.dateString;

    // 1. Tính toán ClassName cho ngày
    let className = ["calendar-day"];
    if (isFuture) className.push("future");
    else className.push("interactive");
    if (isToday) className.push("today");
    if (isPeriod) className.push("period");
    if (isPredicted) className.push("predicted");
    if (showConfirm) className.push("active-hover");

    // 2. Tính toán phạm vi preview chu kỳ quá khứ
    let isInPreviewRange = false;
    if (tempPastStart && (previewEndDate || dateStr)) {
      const current = new Date(dateStr);
      const start = new Date(tempPastStart);
      const end = new Date(previewEndDate || tempPastStart);
      if (current >= start && current <= end) {
        isInPreviewRange = true;
      }
    }

    // 3. Kiểm tra ràng buộc hover không hợp lệ
    let isInvalidHover = false;
    if (tempPastStart && maxPossibleEndDate) {
      const current = new Date(dateStr);
      const start = new Date(tempPastStart);
      const possibleEnd = new Date(maxPossibleEndDate);
      if (current < start || current > possibleEnd) {
        isInvalidHover = true;
      }
    }

    if (isInPreviewRange && !isPeriod) className.push("period-preview");
    if (isInvalidHover && tempPastStart) className.push("invalid-hover");

    // 4. Xác định ActionType
    const isBeforeActiveStart = activeStartDate
      ? dateStr > activeStartDate
      : true;

    const actionType =
      !isPeriod && isBeforeActiveStart
        ? "START"
        : activeStartDate && !isPeriod && dateStr < activeStartDate
          ? "START_PAST"
          : "END";

    const showThisEndPopup = showEndPopupForDate === dateStr;

    return (
      <div
        className="day-cell-wrapper"
        onClick={() => {
          if (isFuture) return;
          if (isPeriod && dateStr < activeStartDate) return;
          if (tempPastStart) {
            onSelectEndDate(dateStr);
          }
        }}
        onMouseEnter={() => {
          if (isFuture) return;
          if (isPeriod && dateStr < activeStartDate) return;
          if (!tempPastStart) setShowConfirm(true);
        }}
        onMouseLeave={() => {
          if (isFuture) return;
          if (isPeriod && dateStr < activeStartDate) return;
          setShowConfirm(false);
        }}
      >
        <div className={className.join(" ")} data-date={dateStr}>
          {dayData.dayNumber}
        </div>

        {/* Popup confirm cho Start hoặc End thông thường */}
        {showConfirm && !showEndPopupForDate && !tempPastStart && (
          <CycleConfirmation
            actionType={actionType}
            isOpen={showConfirm}
            onCancel={() => setShowConfirm(false)}
            onConfirmCycleAction={(date, type) => {
              if (
                type === "START_PAST" ||
                (activeStartDate && date < activeStartDate)
              ) {
                onConfirmCycleAction(date, "INIT_PAST_START");
              } else {
                onConfirmCycleAction(date, type);
              }
            }}
            date={dateStr}
          />
        )}

        {/* Popup tự động bật xác nhận End Date cho chu kỳ quá khứ tại ngày start + 4 */}
        {showThisEndPopup && (
          <CycleConfirmation
            actionType="CONFIRM_PAST_END"
            isOpen={true}
            onCancel={() => {
              setShowEndPopupForDate(null);
              setTempPastStart(null);
            }}
            onConfirmCycleAction={() => {
              onConfirmCycleAction(
                previewEndDate || dateStr,
                "FINISH_PAST_CYCLE",
              );
              setShowEndPopupForDate(null);
            }}
            date={dateStr}
          />
        )}
      </div>
    );
  },
);
