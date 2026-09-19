import { useCallback, useEffect, useMemo, useState } from "react";
import dailyLogApi from "@api/dailyLogApi";

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

function isSameMonth(view) {
  const now = new Date();
  return view.year === now.getFullYear() && view.month === now.getMonth();
}

export function getMoodChartRange(view) {
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

export function useMoodTrend() {
  const [view, setView] = useState({ type: "last30" });
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryTick, setRetryTick] = useState(0);

  const range = useMemo(() => getMoodChartRange(view), [view]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setIsLoading(true);
      setError(null);
      try {
        const logs = await dailyLogApi.getMoodTrendData({
          startDate: range.startDate,
          endDate: range.endDate,
        });
        if (!cancelled) setLogs(logs ?? []);
      } catch (err) {
        if (!cancelled) {
          console.error(err.response?.data?.message || err.message);
          setError(err);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [range.startDate, range.endDate, retryTick]);

  const points = useMemo(() => {
    const logsByDate = new Map(logs.map((log) => [log.date, log]));
    return range.dates.map((date) => {
      const log = logsByDate.get(date);
      return {
        date,
        value: log?.mood ?? null,
        mood: log?.mood ?? null,
        note: log?.note ?? null,
      };
    });
  }, [range.dates, logs]);

  const hasData = useMemo(() => points.some((p) => p.value !== null), [points]);

  const handlePrev = useCallback(() => {
    setView((prev) => {
      if (prev.type === "last30") {
        const now = new Date();
        return normalizeView({
          type: "month",
          year: now.getFullYear(),
          month: now.getMonth() - 1,
        });
      }
      return normalizeView({
        type: "month",
        year: prev.year,
        month: prev.month - 1,
      });
    });
  }, []);

  const handleNext = useCallback(() => {
    setView((prev) => {
      if (prev.type !== "month") return prev;
      const next = normalizeView({
        type: "month",
        year: prev.year,
        month: prev.month + 1,
      });
      return isSameMonth(next) ? { type: "last30" } : next;
    });
  }, []);

  const retry = useCallback(() => setRetryTick((t) => t + 1), []);

  return {
    view,
    points,
    hasData,
    isLoading,
    error,
    moodRange: range.label,
    handleNext,
    handlePrev,
    retry,
  };
}
