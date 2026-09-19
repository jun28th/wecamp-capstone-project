import { useState, useCallback } from "react";
import { startCycle, endCycle, logPastCycle } from "@api/cycleApi";
import { useCycleData } from "./useCycleData";

const validateCycleAction = (date, actionType, activeStartDate) => {
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

export const useCycleManagement = ({ refreshSignal, onRefreshData, showToast }) => {
  // Sử dụng common hook để lấy và quản lý chu kỳ/dự đoán cơ bản
  const { cycleLogs, prediction, fetchCycles, fetchPrediction } = useCycleData(refreshSignal);

  // State chuyên biệt riêng cho log chu kỳ quá khứ (Chỉ CycleCalendar dùng)
  const [tempPastStart, setTempPastStart] = useState(null);
  const [previewEndDate, setPreviewEndDate] = useState(null);
  const [maxPossibleEndDate, setmaxPossibleEndDate] = useState(null);
  const [showEndPopupForDate, setShowEndPopupForDate] = useState(null);

  const handleInitPastStart = useCallback((startDateStr) => {
    setTempPastStart(startDateStr);
    const start = new Date(startDateStr);
    let suggestedEnd = new Date(start);
    suggestedEnd.setDate(start.getDate() + 4);
    let maxPossibleEnd = new Date();
    
    const nextCycle = cycleLogs
      .slice()
      .reverse()
      .find((log) => log.startDate > startDateStr);
      
    if (nextCycle) {
      const nextCycleStart = new Date(nextCycle.startDate);
      maxPossibleEnd = new Date(nextCycleStart);
      maxPossibleEnd.setDate(maxPossibleEnd.getDate() - 1);
      suggestedEnd = suggestedEnd > maxPossibleEnd ? maxPossibleEnd : suggestedEnd;
    }

    const formatDateStr = (dateObj) => {
      const y = dateObj.getFullYear();
      const m = String(dateObj.getMonth() + 1).padStart(2, "0");
      const d = String(dateObj.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    };

    setmaxPossibleEndDate(formatDateStr(maxPossibleEnd));
    setPreviewEndDate(formatDateStr(suggestedEnd));
    setShowEndPopupForDate(formatDateStr(suggestedEnd));
  }, [cycleLogs]);

  const handleSelectEndDate = useCallback(
    (dateStr) => {
      if (!tempPastStart) return;
      const current = new Date(dateStr);
      const start = new Date(tempPastStart);
      const maxPossibleEnd = new Date(maxPossibleEndDate);

      if (current >= start && current <= maxPossibleEnd) {
        setPreviewEndDate(dateStr);
        setShowEndPopupForDate(dateStr);
      } else {
        showToast(
          "End date must be on or after start date and before the next cycle.",
          "error",
        );
      }
    },
    [tempPastStart, maxPossibleEndDate, showToast],
  );

  const handleConfirmAction = useCallback(
    async (date, actionType) => {
      if (actionType === "INIT_PAST_START") {
        handleInitPastStart(date);
        return;
      }

      if (actionType === "FINISH_PAST_CYCLE") {
        try {
          const result = await logPastCycle(tempPastStart, date);

          if (result.success) {
            showToast("Past cycle logged successfully");
            setTempPastStart(null);
            setmaxPossibleEndDate(null);
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

      const activeCycle = cycleLogs[0];
      const currentActiveStartDate = activeCycle ? activeCycle.startDate : null;

      const { isValid, message } = validateCycleAction(
        date,
        actionType,
        currentActiveStartDate,
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
      showToast,
      tempPastStart,
      handleInitPastStart,
      cycleLogs,
    ],
  );

  return {
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
  };
};