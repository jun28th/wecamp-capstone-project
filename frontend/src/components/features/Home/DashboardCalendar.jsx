import React, { useCallback, useMemo, useState, useEffect } from "react";
import { CalendarGrid } from "./CalendarGrid";
import { CycleButton } from "./CycleButton";
import { useToast } from "../../../contexts/toastContext";
import { CycleConfirmation } from "../../common/CycleConfimation";
import {
  formatMonthYear,
  generateCalendarDays,
  formatStringDateToMonthDay,
} from "../../../utils/calendar.utils";
import { DayDetail } from "./DayDetail";
import { CalendarLegend } from "../../common/CalendarLegend";
import { CalendarHeader } from "../../common/CalendarHeader";
import { extractPeriodDays } from "../../../utils/cycle.utils";
import { startCycle, endCycle } from "../../../api/cycleApi";
import taskApi from "../../../api/taskApi";
import { useCycleData } from "../../../hooks/useCycleData"; // Tận dụng common hook

export const DashboardCalendar = React.memo(
  ({ onRefreshData, refreshSignal }) => {
    // Tận dụng common hook để fetch cycleLogs và prediction, tự động đồng bộ theo refreshSignal
    const { cycleLogs, prediction } = useCycleData(refreshSignal);

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    const showToast = useToast();
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    // 1. Xử lý Action (START / END)
    const handleConfirmAction = useCallback(
      async (date, actionType) => {
        try {
          setIsConfirmOpen(false);
          let result;

          if (actionType === "START") {
            result = await startCycle(date);
          } else if (actionType === "END") {
            result = await endCycle(date);
          }

          if (result && result.success) {
            if (onRefreshData) onRefreshData();

            const msg =
              actionType === "START"
                ? "Cycle logged successfully"
                : "Cycle ended successfully";
            showToast(msg);
          }
        } catch (error) {
          console.error(error);
          const errorMessage = error.response?.data?.message || error.message;
          alert(errorMessage);
        }
      },
      [onRefreshData, showToast],
    );

    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const periodDaysSet = useMemo(() => {
      return new Set(extractPeriodDays(cycleLogs));
    }, [cycleLogs]);

    const activeStartDate = useMemo(() => {
      const activeCycle = cycleLogs.find((log) => !log.endDate);
      return activeCycle ? activeCycle.startDate : null;
    }, [cycleLogs]);

    const actionType = activeStartDate ? "END" : "START";

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

    const days = useMemo(
      () => generateCalendarDays(year, month),
      [year, month],
    );
    const monthYearLabel = formatMonthYear(year, month);

    // 2. Fetch Tasks theo tháng (Chuyên biệt của Dashboard Calendar)
    const fetchTasks = useCallback(async () => {
      try {
        const result = await taskApi.getTasksByMonth(year, month);
        setTasks(result);
      } catch (error) {
        console.error(error.response?.data?.message || error.message);
      }
    }, [year, month]);

    useEffect(() => {
      fetchTasks();
    }, [fetchTasks, refreshSignal]);

    // Gom nhóm task theo ngày
    const { taskDaysSet, urgentDaysSet, tasksMap } = useMemo(() => {
      const taskSet = new Set();
      const urgentSet = new Set();
      const map = {};

      tasks.forEach((task) => {
        const dateStr = task.dueDate;
        if (!map[dateStr]) map[dateStr] = [];
        map[dateStr].push(task);

        taskSet.add(dateStr);
        if (task.isUrgent) urgentSet.add(dateStr);
      });
      return { taskDaysSet: taskSet, urgentDaysSet: urgentSet, tasksMap: map };
    }, [tasks]);

    const handleDayClick = useCallback((dateString) => {
      setSelectedDate(dateString);
    }, []);

    const isSelectedPeriodDay = useMemo(() => {
      return selectedDate ? periodDaysSet.has(selectedDate) : false;
    }, [selectedDate, periodDaysSet]);

    const tasksForSelectedDate = useMemo(() => {
      return selectedDate && tasksMap[selectedDate]
        ? tasksMap[selectedDate]
        : [];
    }, [selectedDate, tasksMap]);

    return (
      <div className="card card-today" data-od-id="home-cycle-card">
        <CycleConfirmation
          isOpen={isConfirmOpen}
          date={todayString}
          actionType={actionType}
          onCancel={() => setIsConfirmOpen(false)}
          onConfirmCycleAction={handleConfirmAction}
          className="top-confirmation-popover" // <- Giúp popup bay lên trên giống Hình 1
        />
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
            taskDaysSet={taskDaysSet}
            urgentDaysSet={urgentDaysSet}
            onDayClick={handleDayClick}
          />
          <CalendarLegend variant="dashboard" />
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
          onOpenConfirm={() => setIsConfirmOpen(true)}
          date={todayString}
        />
      </div>
    );
  },
);
