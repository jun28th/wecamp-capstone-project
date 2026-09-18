import React, { useState } from "react";
import Confirmation from "./Confirmation";
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

    let className = ["calendar-day"];
    if (isFuture) className.push("future");
    else className.push("interactive");
    if (isToday) className.push("today");
    if (isPeriod) className.push("period");
    if (isPredicted) className.push("predicted");
    if (showConfirm) className.push("active-hover");

    // const actionType = activeStartDate ? "END" : "START";

    // NEW
    let isInPreviewRange = false;
    if (tempPastStart && (previewEndDate || dateStr)) {
      const current = new Date(dateStr);
      const start = new Date(tempPastStart);
      const end = new Date(previewEndDate || tempPastStart);
      if (current >= start && current <= end) {
        isInPreviewRange = true;
      }
    }

    // [NEW] Kiểm tra ràng buộc hover: Nếu đang chọn end cho chu kỳ quá khứ mà hover trước ngày start hoặc >= chu kỳ hiện tại (13)
    let isInvalidHover = false;
    if (tempPastStart && maxPossibleEndDate) {
      const current = new Date(dateStr);
      const start = new Date(tempPastStart);
      const possibleEnd = new Date(maxPossibleEndDate);
      if (current < start || current > possibleEnd) {
        isInvalidHover = true;
      }
    }

    // [NEW] Thêm class tô màu hồng nhạt và con trỏ not-allowed nếu không hợp lệ
    if (isInPreviewRange && !isPeriod) className.push("period-preview");
    if (isInvalidHover && tempPastStart) className.push("invalid-hover");

    // Xác định actionType:
    // Nếu chưa có activeStartDate -> START bình thường.
    // Nếu đã có activeStartDate (ví dụ ngày 13) -> Các ngày đứng trước ngày 13 mà chưa có chu kỳ sẽ là hành động START cho chu kỳ quá khứ.
    const isBeforeActiveStart = activeStartDate
      ? dateStr < activeStartDate
      : true;
    const actionType =
      !isPeriod && isBeforeActiveStart && !activeStartDate
        ? "START"
        : activeStartDate && !isPeriod && dateStr < activeStartDate
          ? "START_PAST"
          : "END";

    // [NEW] Kiểm tra xem có đang mở popup confirm end date tự động tại ngày start + 4 không
    const showThisEndPopup = showEndPopupForDate === dateStr;
    return (
      <div
        className="day-cell-wrapper"
        onClick={() => {
          if (isFuture) return;
          // [NEW] Nếu đang trong tiến trình chọn chu kỳ quá khứ, click vào ngày nào sẽ chọn ngày đó làm EndDate mới
          if (tempPastStart) {
            onSelectEndDate(dateStr);
          }
        }}
        onMouseEnter={() => {
          if (isFuture) return;
          if (!tempPastStart) setShowConfirm(true); // Chỉ hiện popup thường khi chưa chọn past start
        }}
        onMouseLeave={() => {
          if (isFuture) return;
          setShowConfirm(false);
        }}
      >
        <div className={className.join(" ")} data-date={dateStr}>
          {dayData.dayNumber}
        </div>

        {/* Popup confirm cho Start hoặc End thông thường */}
        {showConfirm && !showEndPopupForDate && !tempPastStart && (
          <Confirmation
            actionType={actionType}
            isHover={showConfirm}
            onCancel={() => setShowConfirm(false)}
            onConfirmCycleAction={(date, type) => {
              if (
                type === "START_PAST" ||
                (activeStartDate && date < activeStartDate)
              ) {
                // Trigger quá trình chọn chu kỳ quá khứ
                onConfirmCycleAction(date, "INIT_PAST_START");
              } else {
                onConfirmCycleAction(date, type);
              }
            }}
            date={dateStr}
          />
        )}

        {/* [NEW] Popup tự động bật xác nhận End Date cho chu kỳ quá khứ tại ngày start + 4 */}
        {showThisEndPopup && (
          <Confirmation
            actionType="CONFIRM_PAST_END"
            isHover={true}
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
