import React, { useCallback, useMemo, useState, useEffect } from "react";
import { CalendarGrid } from "./CalendarGrid";
import { CycleButton } from "./CycleButton";
import {
  formatMonthYear,
  generateCalendarDays,
} from "../../utils/calendar.utils";
import { DayDetail } from "./DayDetail";
import { CalendarLegend } from "./CalendarLegend";
import { CalendarHeader } from "./CalendarHeader";
import { extractPeriodDays } from "../../utils/cycle.utils";
import { getCycles, startCycle, endCycle } from "../../api/cycleApi";

export const DashboardCalendar = React.memo(({ onRefreshData }) => {
  const [cycleLogs, setCycleLogs] = useState([]);
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

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

  // 2. Hàm xử lý Action (Phân luồng gọi startCycle / endCycle)
  const handleConfirmAction = useCallback(
    async (date, actionType) => {
      try {
        console.log(date);
        console.log(actionType);
        let result;

        if (actionType === "START") {
          result = await startCycle(date);
          console.log(result);
        } else if (actionType === "END") {
          result = await endCycle(date);
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
    [fetchCycles, onRefreshData],
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

  const activeStartDate = useMemo(() => {
    const activeCycle = cycleLogs.find((log) => !log.endDate);
    return activeCycle ? activeCycle.startDate : null;
  }, [cycleLogs]);
  const actionType = activeStartDate ? "END" : "START";

  const days = useMemo(() => {
    return generateCalendarDays(year, month);
  }, [year, month]);

  const monthYearLabel = formatMonthYear(year, month);

  return (
    <div className="card card-today" data-od-id="home-cycle-card">
      <p className="text-caption" style={{ margin: "0 0 12px 0" }}>
        Cycle Tracking
      </p>
      <div
        id="mini-calendar"
        style={{
          marginBottom: "16px",
          maxWidth: "560px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <CalendarHeader monthYearLabel={monthYearLabel} />
        <CalendarGrid
          days={days}
          periodDaysSet={periodDaysSet}
          todayString={todayString}
        />
        <CalendarLegend />
        <DayDetail />
      </div>
      <CycleButton
        actionType={actionType}
        onConfirmCycleAction={handleConfirmAction}
        date={todayString}
      />
    </div>
  );
});
