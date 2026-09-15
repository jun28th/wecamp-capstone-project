import { useCallback, useEffect, useMemo, useState } from "react";
import { CycleCalendar } from "../components/cycle-calendar/CycleCalendar";
import MoodCard from "../components/MoodCard";
import {
  formatDateWithYear,
  formatStringDateToMonthDay,
  getDayCount,
} from "../utils/calendar.utils";
import { getCycles } from "../api/cycleApi";
// import { DashboardCalendar } from "../components/dashboard-calendar/DashboardCalendar";

export default function Cycle() {
  const [refreshSignal, setRefreshSignal] = useState(0);
  const bumpRefresh = useCallback(() => setRefreshSignal((s) => s + 1), []);

  const [cycleLogs, setCycleLogs] = useState([]);
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
  useEffect(() => {
    fetchCycles();
  }, [fetchCycles]);
  const currentCycle = useMemo(
    () => cycleLogs.find((cycle) => cycle.startDate && !cycle.endDate),
    [cycleLogs],
  );
  return (
    <>
      <div className="my-6" data-od-id="home-header">
        <p className="mb-1 text-[13px] text-[var(--muted)]">
          {currentCycle
            ? `Your current cycle has lasted ${getDayCount(currentCycle.startDate, new Date().toISOString().split("T")[0])} days`
            : "No active cycle"}
        </p>
        <h1>Cycle Calendar</h1>
      </div>
      <MoodCard />
      <CycleCalendar
        refreshSignal={refreshSignal}
        onRefreshData={bumpRefresh}
      />

      <CycleHistory cycleLogs={cycleLogs} />
    </>
  );
}

const CycleHistory = ({ cycleLogs }) => {
  const validCycles = cycleLogs.filter((c) => c.startDate && c.endDate);

  return (
    <section data-od-id="cycle-history-section">
      <h2 className="my-6">Cycle History</h2>
      <div
        className="bg-[var(--surface)] rounded-[var(--radius-card)] shadow-[var(--shadow-1)] p-5"
        id="cycle-history"
      >
        {validCycles.length > 0 ? (
          validCycles.map((cycle, index) => (
            <div
              key={cycle.id ?? `${cycle.startDate}-${cycle.endDate}`}
              className={`flex items-center justify-between py-3 border-[var(--border)] ${
                index === validCycles.length - 1 ? "" : "border-b-[1px]"
              }`}
            >
              <div className="text-[15px] text-[var(--color-ink)]">
                {formatDateWithYear(cycle.startDate)} —{" "}
                {formatDateWithYear(cycle.endDate)}
              </div>
              <div className="text-[13px] font-semibold text-[var(--muted)]">
                {getDayCount(cycle.startDate, cycle.endDate)} days
              </div>
            </div>
          ))
        ) : (
          <div className="text-center px-8 py-5">
            <div className="text-[32px] opacity-[0.35] mb-3">📈</div>
            <p className="text-caption">
              There is no cycle data yet. Please update your cycle regularly to
              track it.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
