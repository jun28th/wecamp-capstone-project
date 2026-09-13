import React, { useCallback, useMemo, useState, useEffect } from "react";
import {
  formatMonthYear,
  generateCalendarDays,
} from "../../utils/calendar.utils.js";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarGrid } from "./CalendarGrid";
import CalendarLegend from "./CalendarLegend";
import { extractPeriodDays } from "../../utils/cycle.utils";
import { getCycles, startCycle, endCycle } from "../../api/cycleApi";
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

export const CycleCalendar = React.memo(({ onRefreshData }) => {
  const [cycleLogs, setCycleLogs] = useState([]);
  const [currentDate, setCurrentDate] = useState(() => new Date());

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

  // Gọi API lấy dữ liệu lần đầu khi Mount
  useEffect(() => {
    fetchCycles();
  }, [fetchCycles]);

  const activeStartDate = useMemo(() => {
    const activeCycle = cycleLogs.find((log) => !log.endDate);
    return activeCycle ? activeCycle.startDate : null;
  }, [cycleLogs]);

  // 2. Hàm xử lý Action (Phân luồng gọi startCycle / endCycle)
  const handleConfirmAction = useCallback(
    async (date, actionType) => {
      const { isValid, message } = validateCycleAction(
        date,
        actionType,
        activeStartDate,
      );

      if (!isValid) {
        showToast(message, "error"); // Hoặc dùng alert(message) nếu chưa cài Toast
        return; // Dừng hàm, không gọi API nữa
      }
      try {
        let result;

        if (actionType === "START") {
          result = await startCycle(date);
          showToast("Cycle logged successfully");
          console.log(result);
        } else if (actionType === "END") {
          result = await endCycle(date);
          showToast("Cycle ended successfully");
        }

        if (result && result.success) {
          await fetchCycles();
          if (onRefreshData) onRefreshData();
        }
      } catch (error) {
        console.error(error);
        const errorMessage = error.response?.data?.message || error.message;
        alert(errorMessage);
      }
    },
    [fetchCycles, onRefreshData, activeStartDate, showToast],
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
        todayString={todayString}
        activeStartDate={activeStartDate}
        onConfirmCycleAction={handleConfirmAction}
      />
      <CalendarLegend />
    </div>
  );
});
