import { CycleCalendar } from "../components/cycle-calendar/CycleCalendar";
import { DashboardCalendar } from "../components/dashboard-calendar/DashboardCalendar";
const periodDays = [
  // Tháng 7
  "2026-07-01",
  "2026-07-02",
  "2026-07-03",
  "2026-07-04",
  "2026-07-05",
  "2026-07-06",
  "2026-07-07",
  "2026-07-08",
  "2026-07-09",
  "2026-07-10",

  // Tháng 8
  "2026-08-01",
  "2026-08-02",
  "2026-08-03",
  "2026-08-04",
  "2026-08-05",
  "2026-08-06",
  "2026-08-07",
  "2026-08-08",
  "2026-08-09",
  "2026-08-10",
];

const predictedDays = [
  // Tháng 9
  "2026-09-01",
  "2026-09-02",
  "2026-09-03",
  "2026-09-04",
  "2026-09-05",
  "2026-09-06",
  "2026-09-07",
  "2026-09-08",
  "2026-09-09",
  "2026-09-10",
];
export default function Cycle() {
  return (
    <>
      <CycleCalendar periodDays={periodDays} predictedDays={predictedDays} />
      <DashboardCalendar/>
    </>
  );
}
