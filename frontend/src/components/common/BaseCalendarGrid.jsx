import React from "react";
import { WEEKDAYS } from "@utils/calendar.utils"; // Điều chỉnh lại đường dẫn import cho đúng dự án của bạn

export const BaseCalendarGrid = React.memo(
  ({ 
    days, 
    todayString, 
    periodDaysSet, 
    predictedDaysSet, 
    taskDaysSet, 
    urgentDaysSet,
    onDayClick,
    isMini = false, // Vẫn giữ cờ nếu cần phân biệt id
    renderDayCell   
  }) => {
    // Tận dụng Tailwind utility classes chung cho lưới lịch
    const gridClassName = "grid grid-cols-7 gap-3 max-w-[560px] mx-auto";
    const daysId = isMini ? "mini-calendar-days" : "calendar-days";

    return (
      <>
        {/* Header hiển thị các ngày trong tuần */}
        <div className={gridClassName}>
          {WEEKDAYS.map((weekday) => (
            <div 
              key={weekday} 
              className="text-center text-[13px] font-semibold text-[var(--muted)] py-[6px] px-[2px]"
            >
              {weekday}
            </div>
          ))}
        </div>

        {/* Lưới hiển thị các ngày trong tháng */}
        <div
          id={daysId}
          className={`${gridClassName} mt-1`}
        >
          {days.map((day, index) => {
            const { dateString } = day;
            const isToday = dateString === todayString;
            const isPeriod = dateString ? periodDaysSet?.has(dateString) : false;
            const isFuture = dateString ? dateString > todayString : false;
            
            const isPredicted = dateString && !isPeriod ? (predictedDaysSet?.has(dateString) ?? false) : false;
            const hasTask = dateString ? taskDaysSet?.has(dateString) : false;
            const isUrgent = dateString ? urgentDaysSet?.has(dateString) : false;

            return renderDayCell({
              day,
              index,
              dateString,
              isToday,
              isPeriod,
              isFuture,
              isPredicted,
              hasTask,
              isUrgent,
              onDayClick
            });
          })}
        </div>
      </>
    );
  },
);