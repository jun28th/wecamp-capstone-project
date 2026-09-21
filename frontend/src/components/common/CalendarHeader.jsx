import React from "react";

export const CalendarHeader = React.memo(({
  monthYearLabel,
  onPrevMonth,
  onNextMonth,
}) => {
  const hasNav = Boolean(onPrevMonth && onNextMonth);

  return (
    <div 
      className={`flex items-center ${
        hasNav ? "justify-between max-w-[560px] mx-auto mb-4" : "justify-center mb-4"
      }`}
    >
      {/* Nút lùi tháng (Chỉ hiện nếu có truyền hàm onPrevMonth) */}
      {hasNav && (
        <button
          className="bg-transparent border-[1.5px] border-[var(--border)] text-[var(--color-ink)] text-[18px] w-9 h-9 rounded-full cursor-pointer flex items-center justify-center transition-all duration-[150ms] ease-[var(--ease-out)] shrink-0 hover:border-[var(--color-primary-deep)] hover:bg-[var(--color-primary-tint)]"
          onClick={onPrevMonth}
          aria-label="Previous month"
        >
          ‹
        </button>
      )}

      {/* Tiêu đề tháng/năm */}
      {hasNav ? (
        <h3 className="m-0 text-[18px] font-semibold text-[var(--color-ink)]">
          {monthYearLabel}
        </h3>
      ) : (
        <h4 className="m-0 text-[18px] font-semibold text-[var(--color-ink)]">
          {monthYearLabel}
        </h4>
      )}

      {/* Nút tới tháng (Chỉ hiện nếu có truyền hàm onNextMonth) */}
      {hasNav && (
        <button
          className="bg-transparent border-[1.5px] border-[var(--border)] text-[var(--color-ink)] text-[18px] w-9 h-9 rounded-full cursor-pointer flex items-center justify-center transition-all duration-[150ms] ease-[var(--ease-out)] shrink-0 hover:border-[var(--color-primary-deep)] hover:bg-[var(--color-primary-tint)]"
          onClick={onNextMonth}
          aria-label="Next month"
        >
          ›
        </button>
      )}
    </div>
  );
});