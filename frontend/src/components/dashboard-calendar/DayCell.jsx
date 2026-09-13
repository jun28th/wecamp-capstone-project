import React from "react";
export const DayCell = React.memo(
  ({ dayData, isToday, isFuture, isPeriod }) => {
    if (dayData.isEmpty || !dayData.dateString) {
      return <div className="mini-day empty"></div>;
    }

    let className = ["mini-day"];
    if (isFuture) className.push("future");
    if (isToday) className.push("today");
    if (isPeriod) className.push("period");
    return (
      <div className="mini-day-cell">
        <div className={className.join(" ")} data-date={dayData.dateString}>
          {dayData.dayNumber}
        </div>
        <div className="mini-day-dots"></div>
      </div>
    );
  },
);
