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
  }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    if (dayData.isEmpty || !dayData.dateString) {
      return <div className="calendar-day empty"></div>;
    }

    let className = ["calendar-day"];
    if (isFuture) className.push("future");
    else className.push("interactive");
    if (isToday) className.push("today");
    if (isPeriod) className.push("period");
    if (isPredicted) className.push("predicted");
    if (showConfirm) className.push("active-hover");

    const actionType = activeStartDate ? "END" : "START";

    return (
      <div
        className="day-cell-wrapper"
        onMouseEnter={() => !isFuture && setShowConfirm(true)}
        onMouseLeave={() => !isFuture && setShowConfirm(false)}
      >
        <div className={className.join(" ")} data-date={dayData.dateString}>
          {dayData.dayNumber}
        </div>

        <Confirmation
          actionType={actionType}
          isHover={showConfirm}
          onCancel={() => setShowConfirm(false)}
          onConfirmCycleAction={onConfirmCycleAction}
          date={dayData.dateString}
        />
      </div>
    );
  },
);
