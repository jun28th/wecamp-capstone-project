import React, { useCallback, useMemo, useState } from "react";
import {
  formatMonthYear,
  generateCalendarDays,
} from "../../../utils/calendar.utils.js";
import { CalendarHeader } from "./CalendarHeader.jsx";
import { CalendarGrid } from "./CalendarGrid.jsx";
import CalendarLegend from "./CalendarLegend.jsx";
import {
  extractPeriodDays,
  extractPredictedDays,
  computeCycleStats,
} from "../../../utils/cycle.utils.js";
import { CycleStats } from "./CycleStats.jsx";
import { useToast } from "../../../contexts/toastContext.jsx";
import { useCycleManagement } from "../../../hooks/useCycleManagement.js";

export const CycleCalendar = React.memo(({ onRefreshData, refreshSignal }) => {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const showToast = useToast();

  const {
    cycleLogs,
    prediction,
    tempPastStart,
    setTempPastStart,
    previewEndDate,
    maxPossibleEndDate,
    showEndPopupForDate,
    setShowEndPopupForDate,
    handleSelectEndDate,
    handleConfirmAction,
  } = useCycleManagement({ refreshSignal, onRefreshData, showToast });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const activeStartDate = useMemo(() => {
    const activeCycle = cycleLogs[0];
    return activeCycle ? activeCycle.startDate : null;
  }, [cycleLogs]);

  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  const todayString = `${y}-${m}-${d}`;

  const periodDaysSet = useMemo(() => {
    const daysArray = extractPeriodDays(cycleLogs);
    return new Set(daysArray);
  }, [cycleLogs]);

  const cycleStats = useMemo(() => computeCycleStats(cycleLogs), [cycleLogs]);

  const predictedDaysSet = useMemo(() => {
    if (!prediction?.hasEnoughData) return new Set();
    const daysArray = extractPredictedDays(
      prediction.predictedNextStart,
      prediction.avgPeriodLengthDays,
    );
    return new Set(daysArray);
  }, [prediction]);

  const days = useMemo(() => {
    return generateCalendarDays(year, month);
  }, [year, month]);

  const monthYearLabel = formatMonthYear(year, month);

  const handlePrevMonth = useCallback(() => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  }, []);

  return (
    <>
      <CycleStats stats={cycleStats} />
      <div
        className="card"
        data-od-id="cycle-calendar-card"
        style={{ maxWidth: "640px", marginLeft: "auto", marginRight: "auto" }}
      >
        <CalendarHeader
          monthYearLabel={monthYearLabel}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />
        <CalendarGrid
          days={days}
          periodDaysSet={periodDaysSet}
          predictedDaysSet={predictedDaysSet}
          todayString={todayString}
          activeStartDate={activeStartDate}
          onConfirmCycleAction={handleConfirmAction}
          tempPastStart={tempPastStart}
          setTempPastStart={setTempPastStart}
          maxPossibleEndDate={maxPossibleEndDate}
          previewEndDate={previewEndDate}
          onSelectEndDate={handleSelectEndDate}
          showEndPopupForDate={showEndPopupForDate}
          setShowEndPopupForDate={setShowEndPopupForDate}
        />
        <CalendarLegend />
        {prediction && !prediction.hasEnoughData && (
          <p
            id="prediction-status"
            className="text-caption"
            style={{ marginTop: "12px", textAlign: "center" }}
          >
            {prediction.message}
          </p>
        )}
        {prediction?.isIrregular && (
          <p
            id="prediction-irregular-note"
            className="text-caption"
            style={{ marginTop: "12px", textAlign: "center" }}
          >
            {prediction.irregularNote}
          </p>
        )}
      </div>
    </>
  );
});
