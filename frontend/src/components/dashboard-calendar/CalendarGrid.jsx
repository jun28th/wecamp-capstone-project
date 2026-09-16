import React from "react";
import { WEEKDAYS } from "../../utils/calendar.utils";
import { DayCell } from "./DayCell";

export const CalendarGrid = React.memo(
  ({ 
    days, 
    periodDaysSet, 
    todayString, 
    taskDaysSet,     // Thêm prop nhận danh sách ngày có task
    urgentDaysSet,   // Thêm prop nhận danh sách ngày có task khẩn cấp
    onDayClick       // Thêm prop hàm callback khi click vào ngày
  }) => {
    return (
      <>
        <div className="mini-calendar-grid">
          {WEEKDAYS.map((weekday) => (
            <div key={weekday} className="mini-weekday">
              {weekday}
            </div>
          ))}
        </div>
        <div
          id="mini-calendar-days"
          className="mini-calendar-grid"
          style={{ marginTop: "4px" }}
        >
          {days.map((day, index) => {
            const dateString = day.dateString;
            const isToday = dateString === todayString;
            const isPeriod = dateString ? periodDaysSet.has(dateString) : false;
            const isFuture = dateString ? dateString > todayString : false;
            
            // Kiểm tra xem ngày này có task hoặc task khẩn cấp không
            const hasTask = dateString ? taskDaysSet.has(dateString) : false;
            const isUrgent = dateString ? urgentDaysSet.has(dateString) : false;

            return (
              <DayCell
                key={dateString || `empty-${index}`}
                dayData={day}
                isToday={isToday}
                isFuture={isFuture}
                isPeriod={isPeriod}
                hasTask={hasTask}       // Truyền xuống DayCell
                isUrgent={isUrgent}     // Truyền xuống DayCell
                onDayClick={() => dateString && onDayClick && onDayClick(dateString)} // Bắt sự kiện click
              />
            );
          })}
        </div>
      </>
    );
  },
);