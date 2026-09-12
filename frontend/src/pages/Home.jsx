import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { toPng } from "html-to-image";
import Button from "../components/Button";
import MoodCard from "../components/MoodCard";
import Card from "../components/Card";
import dailyLogService from "../api/dailyLogService";
import Loading from "../components/Loading";

const MOOD_ICONS = { 1: "😢", 2: "🙁", 3: "😐", 4: "🙂", 5: "😄" };
const MOOD_LABELS = {
  1: "Very Bad",
  2: "Sad",
  3: "Neutral",
  4: "Happy",
  5: "Very Happy",
};
const MOOD_LEVELS_ORDER = [1, 2, 3, 4, 5];

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
      const data = await dailyLogService.getMoodTrendData({
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

  //////////////// VIẾT TIẾP CÁC CHỨC NĂNG KHÁC Ở ĐÂY NHA!!! //////////////////

















  ////////////////// RENDER ///////////////////
  return (
    <div className="flex-col space-y-10">
      <div className="my-6" data-od-id="home-header">
        <p className="mb-1 text-[13px] text-[var(--muted)]">Good morning,</p>
        <h1>What's happening today? ✨</h1>
      </div>
      <MoodCard dashBoard />

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

function MoodTrend({
  moodRange,
  points,
  hasData,
  isLoading,
  error,
  moodChartView,
  handleNextMoodTrend,
  handlePrevMoodTrend,
  onRetry,
}) {
  const atPresent = moodChartView.type === "last30";
  const wrapRef = useRef(null);
  const svgRef = useRef(null);
  const [hover, setHover] = useState(null);

  const handleDownload = useCallback(async () => {
    if (!wrapRef.current || points.every((p) => p.value === null)) {
      console.warn("downloadMoodChart: no data to export");
      return;
    }

    try {
      const dataUrl = await toPng(wrapRef.current, {
        backgroundColor: "#FFFFFF",
        pixelRatio: 2,
        filter: (node) => node.getAttribute?.("data-export-ignore") !== "true",
      });

      const nameSuffix =
        moodChartView.type === "last30"
          ? "last-30-days"
          : `${moodChartView.year}-${String(moodChartView.month + 1).padStart(2, "0")}`;

      const link = document.createElement("a");
      link.download = `mood-chart-${nameSuffix}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("downloadMoodChart: export failed", err);
    }
  }, [points, moodChartView]);

  // ---- Chart geometry & derived data (chỉ tính khi có data để vẽ) ----
  const width = Math.max(720, points.length * 22);
  const height = 240;
  const padLeft = 44, padRight = 16, padTop = 16, padBottom = 28;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const yFor = (value) => padTop + plotH - ((value - 1) / 4) * plotH;
  const xFor = (i) => padLeft + (points.length === 1 ? plotW / 2 : (i / (points.length - 1)) * plotW);
  const labelStep = Math.max(1, Math.ceil(points.length / 6));

  const segments = useMemo(() => {
    const segs = [];
    let current = [];
    points.forEach((p, i) => {
      if (p.value === null) {
        if (current.length) segs.push(current);
        current = [];
      } else {
        current.push({ ...p, i });
      }
    });
    if (current.length) segs.push(current);
    return segs;
  }, [points]);

  const handlePointerMove = (e) => {
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * width;
    let nearest = 0;
    let nearestDist = Infinity;
    points.forEach((p, i) => {
      const dist = Math.abs(xFor(i) - svgX);
      if (dist < nearestDist) { nearestDist = dist; nearest = i; }
    });
    setHover(nearest);
  };

  const hoverPoint = hover !== null ? points[hover] : null;
  const tooltipLeftPct = hover !== null ? (xFor(hover) / width) * 100 : 0;

  return (
    <section data-od-id="mood-chart-section">
      <div className="section-header-row">
        <h2>Mood Trend</h2>
        <Button
          disabled={!hasData || isLoading}
          className="disabled:opacity-[0.5] disabled:cursor-not-allowed"
          id="mood-chart-download-btn"
          data-od-id="mood-chart-download-btn"
          onClick={handleDownload}
        >
          Download chart
        </Button>
      </div>

      <Card data-od-id="mood-chart-card">
        <div className="flex items-center justify-center gap-4 mb-4">
          <Button variant="miniNav" id="mood-chart-prev" aria-label="Previous month" onClick={handlePrevMoodTrend} disabled={isLoading}>
            ‹
          </Button>
          <h4 id="mood-chart-month-label" className="text-base font-semibold min-w-[160px] text-center">
            {moodRange}
          </h4>
          <Button
            variant="miniNav"
            id="mood-chart-next"
            aria-label="Next month"
            onClick={handleNextMoodTrend}
            disabled={atPresent || isLoading}
            className="disabled:opacity-[0.5] disabled:cursor-not-allowed"
          >
            ›
          </Button>
        </div>

        {isLoading ? (
          <Loading />
        ) : error ? (
          <div className="text-center px-8 py-5">
            <p className="text-caption">Không tải được dữ liệu mood.</p>
            <Button className="mt-3" onClick={onRetry}>Thử lại</Button>
          </div>
        ) : !hasData ? (
          <div id="mood-chart-empty" className="text-center px-8 py-5">
            <div className="text-[32px] opacity-[0.35] mb-3">📈</div>
            <p className="text-caption">No mood data yet. Log your mood every day to see trends!</p>
          </div>
        ) : (
          <div id="mood-chart-wrap" className="relative" ref={wrapRef}>
            <svg
              id="mood-chart-svg"
              ref={svgRef}
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-auto block overflow-visible"
            >
              {MOOD_LEVELS_ORDER.map((level) => {
                const y = yFor(level);
                return (
                  <g key={level}>
                    <line x1={padLeft} x2={width - padRight} y1={y} y2={y} stroke="var(--color-border)" strokeWidth={1} />
                    <text x={padLeft - 12} y={y + 5} textAnchor="end" fontSize={13}>{MOOD_ICONS[level]}</text>
                  </g>
                );
              })}

              {points.map((p, i) => {
                if (i % labelStep !== 0 && i !== points.length - 1) return null;
                const d = new Date(p.date + "T00:00:00");
                return (
                  <text key={p.date} x={xFor(i)} y={height - 8} textAnchor="middle" fontSize={11} fill="var(--muted)">
                    {d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </text>
                );
              })}

              {segments.map((seg, segIdx) => {
                if (seg.length <= 1) return null;
                const linePath = seg.map((p, idx) => `${idx === 0 ? "M" : "L"} ${xFor(p.i)} ${yFor(p.value)}`).join(" ");
                const areaPath = `${linePath} L ${xFor(seg[seg.length - 1].i)} ${padTop + plotH} L ${xFor(seg[0].i)} ${padTop + plotH} Z`;
                return (
                  <g key={segIdx}>
                    <path d={areaPath} fill="var(--color-primary-deep)" opacity={0.1} />
                    <path d={linePath} fill="none" stroke="var(--color-primary-deep)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                );
              })}

              {points.map((p, i) =>
                p.value === null ? null : (
                  <circle key={p.date} cx={xFor(i)} cy={yFor(p.value)} r={6} fill="var(--color-primary-deep)" stroke="var(--color-surface-alt)" strokeWidth={2} />
                )
              )}

              {hover !== null && (
                <line
                  data-export-ignore="true"
                  x1={xFor(hover)} x2={xFor(hover)} y1={padTop} y2={padTop + plotH}
                  stroke="var(--color-primary-deep)" strokeWidth={1} strokeDasharray="3,3"
                />
              )}

              <rect
                data-export-ignore="true"
                x={padLeft}
                y={padTop}
                width={plotW}
                height={plotH}
                fill="transparent"
                style={{ cursor: "pointer" }}
                onPointerMove={handlePointerMove}
                onPointerLeave={() => setHover(null)}
                onClick={handlePointerMove}
              />
            </svg>

            {hoverPoint && hoverPoint.value !== null && (
              <div
                id="mood-chart-tooltip"
                className="absolute bg-[var(--color-ink)] text-white px-3 py-2 rounded-[var(--radius-input)] text-xs max-w-[200px] z-[300] pointer-events-none shadow-[var(--shadow-3)]"
                style={{ left: `clamp(0px, calc(${tooltipLeftPct}% - 60px), calc(100% - 160px))`, top: 0 }}
              >
                <div className="font-semibold">
                  {new Date(hoverPoint.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                </div>
                <div>{MOOD_ICONS[hoverPoint.mood]} {MOOD_LABELS[hoverPoint.mood]}</div>
                {hoverPoint.note && <div className="mt-1 opacity-85">{hoverPoint.note}</div>}
              </div>
            )}
          </div>
        )}
      </Card>
    </section>
  );
}

export default Home;
