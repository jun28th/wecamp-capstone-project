import React from "react";
import { BaseCalendarGrid } from "@common/BaseCalendarGrid"; // Đường dẫn đến BaseCalendarGrid
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
      <BaseCalendarGrid
        days={days}
        todayString={todayString}
        periodDaysSet={periodDaysSet}
        predictedDaysSet={predictedDaysSet}
        isMini={false} // Lịch lớn
        renderDayCell={({ day, index, dateString, isToday, isPeriod, isFuture, isPredicted }) => (
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
        )}
      />
    );
  },
);