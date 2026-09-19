import { useMemo, useState, useCallback } from "react";
import { CycleCalendar } from "@features/Cycle/CycleCalendar";
import MoodCard from "@common/MoodCard";
import { CycleHistory } from "@features/Cycle/CycleHistory";
import { useCycleData } from "@hooks/useCycleData"; // Thay thế useCycleLogs bằng useCycleData chuẩn đồng bộ
import { getDayCount } from "@utils/calendar.utils";

export default function Cycle() {
  // Quản lý refreshSignal tại cấp cha để đồng bộ hóa cho tất cả các component con
  const [refreshSignal, setRefreshSignal] = useState(0);
  
  // Hàm callback để các con gọi báo lên khi dữ liệu thay đổi
  const handleRefreshData = useCallback(() => {
    setRefreshSignal((prev) => prev + 1);
  }, []);

  // Lấy dữ liệu chu kỳ thông qua hook dùng chung có lắng nghe refreshSignal từ cha
  const { cycleLogs } = useCycleData(refreshSignal);

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
      
      {/* Truyền refreshSignal và onRefreshData xuống CycleCalendar */}
      <CycleCalendar
        refreshSignal={refreshSignal}
        onRefreshData={handleRefreshData}
      />

      <CycleHistory cycleLogs={cycleLogs} />
    </>
  );
}