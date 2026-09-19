import { useEffect, useState, useMemo, useCallback } from "react";
import MoodCard from "@components/MoodCard";
import { DashboardCalendar } from "@features/Home/DashboardCalendar";
import PhaseMessage from "@common/PhaseMessage";
import { CycleStats } from "@common/CycleStats";
import { computeCycleStats } from "@utils/cycle.utils";
import { getCycles } from "@api/cycleApi";
import DashboardTask from "@features/Home/DashboardTask";
import MoodTrend from "@features/Home/MoodTrend";
import { usePhaseMessage } from "@hooks/usePhaseMessage";

function Home() {
  // Dashboard Calendar
  const [refreshSignal, setRefreshSignal] = useState(0);
  const bumpRefresh = useCallback(() => setRefreshSignal((s) => s + 1), []);
  // Phase Message
  const phaseMessage = usePhaseMessage(refreshSignal);
  const [cycleLogsForStats, setCycleLogsForStats] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await getCycles();
        if (!cancelled && result.success) {
          setCycleLogsForStats(result.data);
        }
      } catch (error) {
        console.error(error.response?.data?.message || error.message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshSignal]);

  const cycleStats = useMemo(
    () => computeCycleStats(cycleLogsForStats),
    [cycleLogsForStats],
  );

  return (
    <div className="flex-col space-y-10">
      <div className="my-6" data-od-id="home-header">
        <p className="mb-1 text-[13px] text-[var(--muted)]">Good morning,</p>
        <h1>What's happening today? ✨</h1>
      </div>
      <PhaseMessage phaseMessage={phaseMessage} />
      <MoodCard dashboard />

      <CycleStats stats={cycleStats} fullWidth />

      <div className="card-grid cols-2">
        <div className="col-grid-1 h-full" data-od-id="home-cycle-card">
          <DashboardCalendar
            refreshSignal={refreshSignal}
            onRefreshData={bumpRefresh}
          />
        </div>
        <div className="col-grid-1" data-od-id="home-progress-and-tasks-column">
          <DashboardTask />
        </div>
      </div>

      <MoodTrend />
    </div>
  );
}

export default Home;
