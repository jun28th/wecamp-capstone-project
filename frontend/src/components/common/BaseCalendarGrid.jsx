import React from "react";
import { WEEKDAYS } from "@utils/calendar.utils"; // Điều chỉnh lại đường dẫn import cho đúng thư mục chung của bạn

export const BaseCalendarGrid = React.memo(
  ({ 
    days, 
    todayString, 
    periodDaysSet, 
    predictedDaysSet, 
    taskDaysSet, 
    urgentDaysSet,
    onDayClick,
    // Các props khác tùy bạn cấu hình thêm
    isMini = false, // Biến cờ để phân biệt style mini (dashboard) hay full (cycle page)
    renderDayCell   // Hàm truyền vào để render ô ngày linh hoạt tùy trang
  }) => {
    const gridClassName = isMini ? "mini-calendar-grid" : "calendar-grid";
    const daysId = isMini ? "mini-calendar-days" : "calendar-days";

    return (
      <>
        {/* Header hiển thị các ngày trong tuần */}
        <div className={gridClassName}>
          {WEEKDAYS.map((weekday) => (
            <div key={weekday} className={isMini ? "mini-weekday" : "calendar-weekday"}>
              {weekday}
            </div>
          ))}
        </div>

        {/* Lưới hiển thị các ngày trong tháng */}
        <div
          id={daysId}
          className={gridClassName}
          style={{ marginTop: "4px" }}
        >
          {days.map((day, index) => {
            const { dateString } = day;
            const isToday = dateString === todayString;
            const isPeriod = dateString ? periodDaysSet?.has(dateString) : false;
            const isFuture = dateString ? dateString > todayString : false;
            
            // Các giá trị bổ sung nếu có
            const isPredicted = dateString && !isPeriod ? (predictedDaysSet?.has(dateString) ?? false) : false;
            const hasTask = dateString ? taskDaysSet?.has(dateString) : false;
            const isUrgent = dateString ? urgentDaysSet?.has(dateString) : false;

            // Gọi hàm render truyền từ ngoài vào để linh động hiển thị DayCell tương ứng
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