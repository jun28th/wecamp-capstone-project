import { WEEKDAYS } from "../../utils/calendar.utils.js";
import { DayCell } from "./DayCell";
import React from "react";
export const CalendarGrid = React.memo(
  ({
    days,
    periodDaysSet,
    todayString,
    activeStartDate,
    onConfirmCycleAction,
  }) => {
    return (
      <>
        <div className="calendar-grid">
          {WEEKDAYS.map((weekday) => (
            <div key={weekday} className="calendar-weekday">
              {weekday}
            </div>
          ))}
        </div>
        <div
          id="calendar-days"
          className="calendar-grid "
          style={{ marginTop: "4px" }}
        >
          {days.map((day, index) => {
            const dateString = day.dateString;
            const isToday = dateString === todayString;
            const isPeriod = dateString ? periodDaysSet.has(dateString) : false;
            // const isPredicted = dateString
            //   ? predictedDaysSet.has(dateString)
            //   : false;
            const isFuture = dateString ? dateString > todayString : false;
            return (
              <DayCell
                key={dateString || `empty-${index}`}
                activeStartDate={activeStartDate}
                dayData={day}
                isToday={isToday}
                isFuture={isFuture}
                isPeriod={isPeriod}
                onConfirmCycleAction={onConfirmCycleAction}
                // isPredicted={isPredicted}
              />
            );
          })}
        </div>
      </>
    );
  },
);
