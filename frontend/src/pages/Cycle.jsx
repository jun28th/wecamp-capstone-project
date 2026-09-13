import { useCallback, useState } from "react";
import { CycleCalendar } from "../components/cycle-calendar/CycleCalendar";
// import { DashboardCalendar } from "../components/dashboard-calendar/DashboardCalendar";

export default function Cycle() {
  const [refreshSignal, setRefreshSignal] = useState(0);
  const bumpRefresh = useCallback(() => setRefreshSignal((s) => s + 1), []);

  return (
    <>
      <CycleCalendar
        refreshSignal={refreshSignal}
        onRefreshData={bumpRefresh}
      />
      {/* <DashboardCalendar
        refreshSignal={refreshSignal}
        onRefreshData={bumpRefresh}
      /> */}
    </>
  );
}
