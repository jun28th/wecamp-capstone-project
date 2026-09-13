import React from "react";
export const CalendarHeader = React.memo(({
  monthYearLabel,
  onPrevMonth,
  onNextMonth,
}) => {
  return (
    <div className="calendar-header">
      <button
        className="calendar-nav"
        onClick={onPrevMonth}
        aria-label="Previous month"
      >
        ‹
      </button>
      <h3 id="calendar-month-year">{monthYearLabel}</h3>
      <button
        className="calendar-nav"
        onClick={onNextMonth}
        aria-label="Next month"
      >
        ›
      </button>
    </div>
  );
});
