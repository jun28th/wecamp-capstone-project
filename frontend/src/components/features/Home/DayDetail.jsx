import React from "react";

export const DayDetail = React.memo(({ isShow, selectedDate, isPeriodDay, tasksForDate }) => {
  if (!isShow) return null;

  // Format ngày hiển thị (VD: Wednesday, September 16)
  const formattedDate = selectedDate 
    ? new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { 
        weekday: "long", 
        month: "long", 
        day: "numeric" 
      }) 
    : "";

  return (
    <div 
      id="day-detail-panel" 
      className="mt-4 pt-4 border-t border-[var(--border)] block" 
      data-od-id="day-detail-panel"
    >
      <p 
        id="day-detail-date" 
        className="m-0 mb-2.5 text-[14px] font-semibold text-[var(--color-ink)]"
      >
        {formattedDate}
      </p>
      
      {/* Hiển thị nhãn chu kỳ nếu là ngày có period */}
      <div id="day-detail-cycle">
        {isPeriodDay && (
          <div className="mb-2.5">
            <span className="tag !bg-[#C0447A] !text-white">Period day</span>
          </div>
        )}
      </div>

      {/* Danh sách Task của ngày */}
      <div id="day-detail-tasks">
        {(!tasksForDate || tasksForDate.length === 0) ? (
          <p className="text-caption m-0">No tasks for this day</p>
        ) : (
          tasksForDate.map((t) => (
            <div 
              key={t.id} 
              className={`flex items-center gap-2 py-1.5 text-[14px] ${t.isCompleted ? "text-[var(--muted)] line-through" : ""}`}
            >
              <span>{t.isCompleted ? "✓" : "○"}</span>
              <span className={`flex-1 ${t.isCompleted ? "line-through" : "no-underline"}`}>
                {t.title}
              </span>
              {t.isUrgent && (
                <span className="tag !bg-[var(--color-primary-deep)] !text-white !text-[11px] !py-0.5 !px-2">
                  Urgent
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
});