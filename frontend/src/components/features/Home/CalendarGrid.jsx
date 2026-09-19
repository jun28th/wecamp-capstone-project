import React from "react";
import { BaseCalendarGrid } from "../../common/BaseCalendarGrid"; // Đường dẫn đến BaseCalendarGrid chung
import { DayCell } from "./DayCell";

export const CalendarGrid = React.memo(
  ({
    days,
    periodDaysSet,
    todayString,
    taskDaysSet,
    urgentDaysSet,
    onDayClick,
  }) => {
    return (
      <BaseCalendarGrid
        days={days}
        todayString={todayString}
        periodDaysSet={periodDaysSet}
        taskDaysSet={taskDaysSet}
        urgentDaysSet={urgentDaysSet}
        isMini={true} // Lịch mini dashboard
        renderDayCell={({
          day,
          index,
          dateString,
          isToday,
          isPeriod,
          isFuture,
          hasTask,
          isUrgent,
        }) => (
          <DayCell
            key={dateString || `empty-${index}`}
            dayData={day}
            isToday={isToday}
            isFuture={isFuture}
            isPeriod={isPeriod}
            hasTask={hasTask}
            isUrgent={isUrgent}
            onDayClick={() =>
              dateString && onDayClick && onDayClick(dateString)
            }
          />
        )}
      />
    );
  },
);
