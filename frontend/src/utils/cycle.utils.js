export const extractPeriodDays = (cycleLogs = []) => {
  const periodDays = [];

  cycleLogs.forEach((log) => {
    if (!log.startDate) return;
    // Nếu chu kỳ chưa kết thúc (endDate = null), lấy tạm thời đến ngày hiện tại
    const start = new Date(log.startDate);
    const end = log.endDate ? new Date(log.endDate) : new Date();

    const current = new Date(start);
    while (current <= end) {
      // Format YYYY-MM-DD dạng local date
      const dateStr = current.toISOString().split("T")[0];
      periodDays.push(dateStr);

      // Tăng thêm 1 ngày
      current.setDate(current.getDate() + 1);
    }
  });

  return periodDays;
};

// AC3: predicted period is drawn as a range of dashed-border cells starting
// at predictedNextStart, spanning the user's average period length (rounded,
// minimum 1 day) so it visually matches how logged period days are drawn.
export const extractPredictedDays = (
  predictedNextStart,
  avgPeriodLengthDays,
) => {
  if (!predictedNextStart) return [];

  const lengthDays = Math.max(1, Math.round(avgPeriodLengthDays || 1));
  const [y, m, d] = predictedNextStart.split("-").map(Number);
  const start = new Date(y, m - 1, d);

  const predictedDays = [];
  for (let i = 0; i < lengthDays; i++) {
    const current = new Date(start);
    current.setDate(current.getDate() + i);
    const yyyy = current.getFullYear();
    const mm = String(current.getMonth() + 1).padStart(2, "0");
    const dd = String(current.getDate()).padStart(2, "0");
    predictedDays.push(`${yyyy}-${mm}-${dd}`);
  }

  return predictedDays;
};

// AC1-AC5: derives the 3 Dashboard summary cards from the raw cycle-log list
// (already sorted DESC by start_date by the backend, per cycleLog.repository).
const daysBetween = (a, b) => {
  const start = new Date(a);
  const end = new Date(b);
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((end.getTime() - start.getTime()) / msPerDay);
};

export const computeCycleStats = (cycleLogs = []) => {
  if (!cycleLogs || cycleLogs.length === 0) {
    return {
      hasData: false,
      previousCycleLength: null,
      previousPeriodLength: null,
      variation: null,
      hasEnoughVariationData: false,
    };
  }

  // Chronological order (oldest -> newest) makes gap/length math read naturally.
  const chronological = [...cycleLogs].sort(
    (a, b) => new Date(a.startDate) - new Date(b.startDate),
  );

  // AC2: previous cycle length = gap between the two most recent start dates.
  let previousCycleLength = null;
  if (chronological.length >= 2) {
    const last = chronological[chronological.length - 1];
    const prev = chronological[chronological.length - 2];
    previousCycleLength = daysBetween(prev.startDate, last.startDate);
  }

  // AC3: previous period length = most recent cycle with both start & end,
  // inclusive of both endpoints.
  let previousPeriodLength = null;
  for (let i = chronological.length - 1; i >= 0; i--) {
    const log = chronological[i];
    if (log.startDate && log.endDate) {
      previousPeriodLength = daysBetween(log.startDate, log.endDate) + 1;
      break;
    }
  }

  // AC4/AC5: cycle length variation needs >= 3 logged cycles (i.e. >= 2
  // gaps between consecutive start dates); uses at most the 6 most recent
  // gaps. With exactly 3 cycles logged (2 gaps), variation is still shown.
  const allGaps = [];
  for (let i = 1; i < chronological.length; i++) {
    allGaps.push(
      daysBetween(chronological[i - 1].startDate, chronological[i].startDate),
    );
  }
  const recentGaps = allGaps.slice(-6);
  const hasEnoughVariationData = chronological.length >= 3;
  const variation = hasEnoughVariationData
    ? Math.max(...recentGaps) - Math.min(...recentGaps)
    : null;

  return {
    hasData: true,
    previousCycleLength,
    previousPeriodLength,
    variation,
    hasEnoughVariationData,
  };
};

export const getActionTypeForDate = (dateString, cycleLogs = []) => {
  // Tìm chu kỳ đang mở (chưa có endDate)
  const activeCycle = cycleLogs.find((log) => !log.endDate);

  if (activeCycle) {
    if (dateString === activeCycle.startDate) return "DELETE_START";
    if (dateString > activeCycle.startDate) return "END";
  }

  return "START";
};
