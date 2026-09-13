import React from "react";
import { WEEKDAYS } from "../../utils/calendar.utils";
import { DayCell } from "./DayCell";
export const CalendarGrid = React.memo(
  ({ days, periodDaysSet, todayString }) => {
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
            return (
              <DayCell
                key={dateString || `empty-${index}`}
                dayData={day}
                isToday={isToday}
                isFuture={isFuture}
                isPeriod={isPeriod}
              />
            );
          })}
        </div>
      </>
    );
  },
);
