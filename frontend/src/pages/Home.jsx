import { useEffect, useState, useMemo, useCallback } from "react";
import MoodCard from "../components/MoodCard";
import dailyLogApi from "../api/dailyLogApi";
import { DashboardCalendar } from "../components/dashboard-calendar/DashboardCalendar";
import { getPhaseMessage } from "../api/cycleApi";
import PhaseMessage from "../components/PhaseMessage";
import { CycleStats } from "../components/cycle-calendar/CycleStats";
import { computeCycleStats } from "../utils/cycle.utils";
import { getCycles } from "../api/cycleApi";
import DashboardTask from "../components/DashboardTask";
import MoodTrend from "../components/MoodTrend";

function normalizeView(view) {
  if (view.type !== "month") return view;
  let { year, month } = view;
  while (month < 0) {
    month += 12;
    year -= 1;
  }
  while (month > 11) {
    month -= 12;
    year += 1;
  }
  return { type: "month", year, month };
}

function toISODate(d) {
  return d.toISOString().split("T")[0];
}

function getMoodChartRange(view) {
  if (view.type === "last30") {
    const dates = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      dates.push(toISODate(d));
    }
    return {
      dates,
      label: "Last 30 days",
      startDate: dates[0],
      endDate: dates[dates.length - 1],
    };
  }
  const { year, month } = view;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dates = [];
  for (let day = 1; day <= daysInMonth; day++) {
    dates.push(
      `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    );
  }
  const label = new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  return {
    dates,
    label,
    startDate: dates[0],
    endDate: dates[dates.length - 1],
  };
}

function isAtPresent(view) {
  if (view.type === "last30") return true;
  const now = new Date();
  return (
    view.year > now.getFullYear() ||
    (view.year === now.getFullYear() && view.month >= now.getMonth())
  );
}

function Home() {
  //////////////////// MOOD ///////////////////////
  const [moodChartView, setMoodChartView] = useState({ type: "last30" });
  const [moodEntries, setMoodEntries] = useState(null);
  const [isLoadingMood, setIsLoadingMood] = useState(true);
  const [moodError, setMoodError] = useState(null);

  const { dates, label, startDate, endDate } = useMemo(
    () => getMoodChartRange(moodChartView),
    [moodChartView],
  );

  const fetchMoodTrend = useCallback(async () => {
    setIsLoadingMood(true);
    setMoodError(null);
    try {
      const data = await dailyLogApi.getMoodTrendData({
        startDate,
        endDate,
      });
      setMoodEntries(data || []);
    } catch (err) {
      console.error("Failed to load mood trend:", err);
      setMoodError(err);
      setMoodEntries([]);
    } finally {
      setIsLoadingMood(false);
    }
  }, [startDate, endDate, moodChartView.type]);

  useEffect(() => {
    fetchMoodTrend();
  }, [fetchMoodTrend]);

  const handlePrevMoodTrend = () => {
    setMoodChartView((prev) => {
      if (prev.type === "last30") {
        const now = new Date();
        return normalizeView({
          type: "month",
          year: now.getFullYear(),
          month: now.getMonth() - 1,
        });
      }
      return normalizeView({ ...prev, month: prev.month - 1 });
    });
  };

  const handleNextMoodTrend = () => {
    setMoodChartView((prev) => {
      if (prev.type !== "month") return prev;
      const next = normalizeView({ ...prev, month: prev.month + 1 });
      return isAtPresent(next) ? { type: "last30" } : next;
    });
  };

  // Map dữ liệu BE: [{date, mood, note}] -> ghép theo từng ngày trong range
  const points = useMemo(() => {
    if (!moodEntries) return [];
    const moodMap = {};
    moodEntries.forEach((e) => {
      moodMap[e.date] = e;
    });

    return dates.map((d) => {
      const entry = moodMap[d];
      const hasMood = entry && entry.mood != null;
      return hasMood
        ? {
            date: d,
            mood: entry.mood,
            note: entry.note || "",
            value: entry.mood,
          }
        : { date: d, mood: null, note: "", value: null };
    });
  }, [dates, moodEntries]);

  const hasMoodData = points.some((p) => p.value !== null);

  // Dashboard Calendar
  const [refreshSignal, setRefreshSignal] = useState(0);
  const bumpRefresh = useCallback(() => setRefreshSignal((s) => s + 1), []);
  // Phase Message
  const [phaseMessage, setPhaseMessage] = useState(null);
  useEffect(() => {
    async function loadPhaseMessage() {
      try {
        const result = await getPhaseMessage();
        if (result.success) {
          setPhaseMessage(result.data);
        }
      } catch (error) {
        console.error(error.response?.data?.message || error.message);
      }
    }

    loadPhaseMessage();
  }, []); // Mảng rỗng [] nghĩa là chỉ gọi 1 lần duy nhất khi component mount
  // Cycle stats cards — fetched here (not inside DashboardCalendar) so they
  // stay full-width on Home regardless of the 2-column grid below.
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

  ////////////////// RENDER ///////////////////
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

      <MoodTrend
        moodRange={label}
        points={points}
        hasData={hasMoodData}
        isLoading={isLoadingMood}
        error={moodError}
        moodChartView={moodChartView}
        handleNextMoodTrend={handleNextMoodTrend}
        handlePrevMoodTrend={handlePrevMoodTrend}
        onRetry={fetchMoodTrend}
      />
    </div>
  );
}

export default Home;
