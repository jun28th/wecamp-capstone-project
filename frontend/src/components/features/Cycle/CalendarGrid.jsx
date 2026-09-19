import React from "react";
import { WEEKDAYS } from "../../../utils/calendar.utils.js";
import { DayCell } from "./DayCell.jsx";

export const CalendarGrid = React.memo(
  ({
    days,
    periodDaysSet,
    predictedDaysSet,
    todayString,
    activeStartDate,
    onConfirmCycleAction,
    previewEndDate,
    maxPossibleEndDate,
    onSelectEndDate,
    showEndPopupForDate,
    setShowEndPopupForDate,
    tempPastStart,
    setTempPastStart,
  }) => {
    return (
      <>
        {/* Header hiển thị các ngày trong tuần */}
        <div className="calendar-grid">
          {WEEKDAYS.map((weekday) => (
            <div key={weekday} className="calendar-weekday">
              {weekday}
            </div>
          ))}
        </div>

        {/* Lưới hiển thị các ngày trong tháng */}
        <div
          id="calendar-days"
          className="calendar-grid"
          style={{ marginTop: "4px" }}
        >
          {days.map((day, index) => {
            const { dateString } = day;
            const isToday = dateString === todayString;
            const isPeriod = dateString ? periodDaysSet.has(dateString) : false;

            // Logged period days always win over a predicted overlay
            // (AC3 distinguishes the two visually — a day can't be both).
            const isPredicted =
              dateString && !isPeriod
                ? (predictedDaysSet?.has(dateString) ?? false)
                : false;

            const isFuture = dateString ? dateString > todayString : false;

            return (
              <DayCell
                key={dateString || `empty-${index}`}
                activeStartDate={activeStartDate}
                dayData={day}
                isToday={isToday}
                isFuture={isFuture}
                isPeriod={isPeriod}
                isPredicted={isPredicted}
                onConfirmCycleAction={onConfirmCycleAction}
                maxPossibleEndDate={maxPossibleEndDate}
                previewEndDate={previewEndDate}
                onSelectEndDate={onSelectEndDate}
                showEndPopupForDate={showEndPopupForDate}
                setShowEndPopupForDate={setShowEndPopupForDate}
                tempPastStart={tempPastStart}
                setTempPastStart={setTempPastStart}
              />
            );
          })}
        </div>
      </>
    );
  },
);
