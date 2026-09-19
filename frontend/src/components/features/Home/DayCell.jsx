import React from "react";
export const DayCell = React.memo(
  ({ dayData, isToday, isFuture, isPeriod, hasTask, isUrgent, onDayClick }) => {
    if (dayData.isEmpty || !dayData.dateString) {
      return <div className="mini-day empty"></div>;
    }

    let className = ["mini-day"];
    if (isFuture) className.push("future");
    if (isToday) className.push("today");
    if (isPeriod) className.push("period");
    return (
      <div
        className="mini-day-cell"
        onClick={() => onDayClick && onDayClick(dayData.dateString)}
      >
        <div className={className.join(" ")} data-date={dayData.dateString}>
          {dayData.dayNumber}
        </div>
        {/* Hiển thị các chấm chỉ báo màu xanh dương (task) và đỏ (urgent) */}
        <div className="mini-day-dots">
          {isUrgent ? (
            <span className="mini-day-dot urgent" title="Urgent task"></span>
          ) : hasTask ? (
            <span className="mini-day-dot" title="Has tasks"></span>
          ) : null}
        </div>
      </div>
    );
  },
);
