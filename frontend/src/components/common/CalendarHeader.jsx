import React from "react";

export const CalendarHeader = React.memo(({
  monthYearLabel,
  onPrevMonth,
  onNextMonth,
}) => {
  // Kiểm tra xem header này có cần nút điều hướng tháng hay không
  const hasNav = Boolean(onPrevMonth && onNextMonth);

  return (
    <div 
      className={hasNav ? "calendar-header" : "mini-calendar-header"}
      style={!hasNav ? {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "16px",
      } : undefined}
    >
      {/* Nút lùi tháng (Chỉ hiện nếu có truyền hàm onPrevMonth) */}
      {hasNav && (
        <button
          className="calendar-nav"
          onClick={onPrevMonth}
          aria-label="Previous month"
        >
          ‹
        </button>
      )}

      {/* Tiêu đề tháng/năm */}
      {hasNav ? (
        <h3 id="calendar-month-year">{monthYearLabel}</h3>
      ) : (
        <h4 id="mini-month-year" style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>
          {monthYearLabel}
        </h4>
      )}

      {/* Nút tới tháng (Chỉ hiện nếu có truyền hàm onNextMonth) */}
      {hasNav && (
        <button
          className="calendar-nav"
          onClick={onNextMonth}
          aria-label="Next month"
        >
          ›
        </button>
      )}
    </div>
  );
});