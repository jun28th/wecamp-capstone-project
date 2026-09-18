import React, { useCallback, useMemo, useState, useEffect } from "react";
import {
  formatMonthYear,
  generateCalendarDays,
} from "../../utils/calendar.utils.js";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarGrid } from "./CalendarGrid";
import CalendarLegend from "./CalendarLegend";
import {
  extractPeriodDays,
  extractPredictedDays,
  computeCycleStats,
} from "../../utils/cycle.utils";
import { CycleStats } from "./CycleStats";
import {
  getCycles,
  getPrediction,
  startCycle,
  endCycle,
  logPastCycle,
} from "../../api/cycleApi";
import { useToast } from "../Toast.jsx";

const validateCycleAction = (date, actionType, activeStartDate) => {
  // Chỉ validate khi người dùng thực hiện kết thúc chu kỳ (END) và đã có activeStartDate
  if (actionType === "END" && activeStartDate) {
    const selectedEndDate = new Date(date).setHours(0, 0, 0, 0);
    const cycleStartDate = new Date(activeStartDate).setHours(0, 0, 0, 0);

    if (selectedEndDate < cycleStartDate) {
      return {
        isValid: false,
        message: "End date must be on or after start date.",
      };
    }
  }

  return { isValid: true, message: "" };
};

export const CycleCalendar = React.memo(({ onRefreshData, refreshSignal }) => {
  const [cycleLogs, setCycleLogs] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [currentDate, setCurrentDate] = useState(() => new Date());

  // State cho log chu kỳ quá khứ
  const [tempPastStart, setTempPastStart] = useState(null);
  const [previewEndDate, setPreviewEndDate] = useState(null);
  const [showEndPopupForDate, setShowEndPopupForDate] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const showToast = useToast();

  // 1. Hàm lấy dữ liệu chu kỳ từ Backend
  const fetchCycles = useCallback(async () => {
    try {
      const result = await getCycles();
      if (result.success) {
        setCycleLogs(result.data);
      }
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  }, []);

  const fetchPrediction = useCallback(async () => {
    try {
      const result = await getPrediction();
      if (result.success) {
        setPrediction(result.data);
      }
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  }, []);

  // Gọi API lấy dữ liệu lần đầu khi Mount
  useEffect(() => {
    fetchCycles();
    fetchPrediction();
  }, [fetchCycles, fetchPrediction, refreshSignal]);

  const activeStartDate = useMemo(() => {
    // const activeCycle = cycleLogs.find((log) => !log.endDate);
    const activeCycle = cycleLogs[0];
    return activeCycle ? activeCycle.startDate : null;
  }, [cycleLogs]);

  // Các hàm hỗ trợ chu kỳ quá khứ
  const handleInitPastStart = useCallback((startDateStr) => {
    setTempPastStart(startDateStr);

    const start = new Date(startDateStr);
    const suggestedEnd = new Date(start);
    suggestedEnd.setDate(start.getDate() + 4);

    const y = suggestedEnd.getFullYear();
    const m = String(suggestedEnd.getMonth() + 1).padStart(2, "0");
    const d = String(suggestedEnd.getDate()).padStart(2, "0");
    const suggestedStr = `${y}-${m}-${d}`;

    setPreviewEndDate(suggestedStr);
    setShowEndPopupForDate(suggestedStr);
  }, []);

  // [NEW] Xử lý khi user click chọn một ngày kết thúc mới (thay vì dùng hover)
  const handleSelectEndDate = useCallback(
    (dateStr) => {
      if (!tempPastStart) return;
      const current = new Date(dateStr);
      const start = new Date(tempPastStart);
      const activeStart = new Date(activeStartDate);

      // Ràng buộc: EndDate phải >= StartDate và < activeStartDate (chu kỳ hiện tại)
      if (current >= start && current < activeStart) {
        setPreviewEndDate(dateStr);
        setShowEndPopupForDate(dateStr); // Dời popup ra đúng ngày vừa click
      } else {
        showToast(
          "End date must be on or after start date and before the next cycle.",
          "error",
        );
      }
    },
    [tempPastStart, activeStartDate, showToast],
  );

  // 2. Hàm xử lý Action (Đã hợp nhất START, END, INIT_PAST_START, FINISH_PAST_CYCLE)
  const handleConfirmAction = useCallback(
    async (date, actionType) => {
      if (actionType === "INIT_PAST_START") {
        handleInitPastStart(date);
        return;
      }
      console.log(date);

      if (actionType === "FINISH_PAST_CYCLE") {
        try {
          const result = await logPastCycle(tempPastStart, date);

          if (result.success) {
            showToast("Past cycle logged successfully");
            setTempPastStart(null);
            setPreviewEndDate(null);
            setShowEndPopupForDate(null);
            await fetchCycles();
            await fetchPrediction();
            if (onRefreshData) onRefreshData();
          }
        } catch (error) {
          alert(error.response?.data?.message || error.message);
        }
        return;
      }

      // Validate cho START / END thông thường
      const { isValid, message } = validateCycleAction(
        date,
        actionType,
        activeStartDate,
      );

      if (!isValid) {
        showToast(message, "error");
        return;
      }

      try {
        let result;
        if (actionType === "START") {
          result = await startCycle(date);
          showToast("Cycle logged successfully");
        } else if (actionType === "END") {
          result = await endCycle(date);
          showToast("Cycle ended successfully");
        }

        if (result && result.success) {
          await fetchCycles();
          await fetchPrediction();
          if (onRefreshData) onRefreshData();
        }
      } catch (error) {
        console.error(error);
        const errorMessage = error.response?.data?.message || error.message;
        alert(errorMessage);
      }
    },
    [
      fetchCycles,
      fetchPrediction,
      onRefreshData,
      activeStartDate,
      showToast,
      tempPastStart,
      handleInitPastStart,
    ],
  );

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
