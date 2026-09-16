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
import { formatStringDateToMonthDay } from "../../utils/calendar.utils";
import {
  getCycles,
  getPrediction,
  startCycle,
  endCycle,
} from "../../api/cycleApi";
import taskApi from "../../api/taskApi";
export const DashboardCalendar = React.memo(
  ({ onRefreshData, refreshSignal }) => {
    const [cycleLogs, setCycleLogs] = useState([]);
    const [prediction, setPrediction] = useState(null);
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

    // AC4: dashboard countdown/date text; AC5: refetched on every cycle change.
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
            await fetchPrediction();
            if (onRefreshData) onRefreshData();
          }
        } catch (error) {
          console.error(error);
          const errorMessage = error.response?.data?.message || error.message;
          alert(errorMessage);
        }
      },
      [fetchCycles, fetchPrediction, onRefreshData],
    );

    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth() + 1;
    const d = today.getDate();
    const todayString = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

    const periodDaysSet = useMemo(() => {
      const daysArray = extractPeriodDays(cycleLogs);
      return new Set(daysArray);
    }, [cycleLogs]);

    const activeStartDate = useMemo(() => {
      const activeCycle = cycleLogs.find((log) => !log.endDate);
      return activeCycle ? activeCycle.startDate : null;
    }, [cycleLogs]);
    const actionType = activeStartDate ? "END" : "START";

    // AC4: only surface next-cycle copy when the current cycle hasn't started
    // yet; while on-period, the "End cycle" flow already covers status.
    const statusText = useMemo(() => {
      if (activeStartDate || !prediction) return null;
      if (!prediction.hasEnoughData) return prediction.message;

      const dateLabel = formatStringDateToMonthDay(
        prediction.predictedNextStart,
      );
      if (prediction.daysUntilNext === 0) {
        return `Your next cycle is expected today (${dateLabel})`;
      }
      if (prediction.daysUntilNext > 0) {
        return `${prediction.daysUntilNext} days to go until your expected next cycle (${dateLabel})`;
      }
      return `Your predicted next cycle is ${dateLabel}`;
    }, [activeStartDate, prediction]);

    const days = useMemo(() => {
      return generateCalendarDays(year, month);
    }, [year, month]);

    const monthYearLabel = formatMonthYear(year, month);

    // task
    const [tasks, setTasks] = useState([]); // State lưu danh sách task trong tháng
    const [selectedDate, setSelectedDate] = useState(null); // Ngày được click chọn xem chi tiết
    const fetchTasks = useCallback(async () => {
      try {
        const result = await taskApi.getTasksByMonth(year, month);
        setTasks(result);
      } catch (error) {
        console.error(error.response?.data?.message || error.message);
      }
    }, [year, month]);

    // Gom nhóm task theo từng ngày (dueDate) để đánh dấu chấm trên lịch
    const { taskDaysSet, urgentDaysSet, tasksMap } = useMemo(() => {
      const taskSet = new Set();
      const urgentSet = new Set();
      const map = {};

      tasks.forEach((task) => {
        const dateStr = task.dueDate; // Định dạng YYYY-MM-DD từ cột due_date
        if (!map[dateStr]) map[dateStr] = [];
        map[dateStr].push(task);

        taskSet.add(dateStr);
        if (task.isUrgent) {
          urgentSet.add(dateStr);
        }
      });
      return { taskDaysSet: taskSet, urgentDaysSet: urgentSet, tasksMap: map };
    }, [tasks]);

    // Xử lý khi click vào một ngày trên lịch
    const handleDayClick = useCallback((dateString) => {
      setSelectedDate(dateString);
    }, []);

    // Kiểm tra xem ngày đang chọn có thuộc chu kỳ kinh nguyệt hay không
    const isSelectedPeriodDay = useMemo(() => {
      return selectedDate ? periodDaysSet.has(selectedDate) : false;
    }, [selectedDate, periodDaysSet]);

    // Lấy danh sách task của đúng ngày đang chọn
    const tasksForSelectedDate = useMemo(() => {
      return selectedDate && tasksMap[selectedDate]
        ? tasksMap[selectedDate]
        : [];
    }, [selectedDate, tasksMap]);

    // Gọi API lấy dữ liệu lần đầu khi Mount
    useEffect(() => {
      fetchCycles();
      fetchPrediction();
      fetchTasks();
    }, [fetchCycles, fetchPrediction, fetchTasks, refreshSignal]);
    return (
      <div className="card card-today h-full" data-od-id="home-cycle-card">
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
          {/* Truyền dữ liệu task và sự kiện click vào CalendarGrid */}
          <CalendarGrid
            days={days}
            periodDaysSet={periodDaysSet}
            todayString={todayString}
            taskDaysSet={taskDaysSet}
            urgentDaysSet={urgentDaysSet}
            onDayClick={handleDayClick}
          />
          <CalendarLegend />
          {console.log(Boolean(selectedDate))}
          <DayDetail
            isShow={Boolean(selectedDate)}
            selectedDate={selectedDate}
            isPeriodDay={isSelectedPeriodDay}
            tasksForDate={tasksForSelectedDate}
          />
        </div>
        <CycleButton
          actionType={actionType}
          statusText={statusText}
          onConfirmCycleAction={handleConfirmAction}
          date={todayString}
        />
      </div>
    );
  },
);
