import { useMemo } from "react";
import { CycleCalendar } from "../components/features/Cycle/CycleCalendar";
import MoodCard from "../components/MoodCard";
import { CycleHistory } from "../components/features/Cycle/CycleHistory";
import { useCycleLogs } from "../hooks/useCycleLogs";
import { getDayCount } from "../utils/calendar.utils";

export default function Cycle() {
  const { cycleLogs, refreshSignal, bumpRefresh } = useCycleLogs();

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
