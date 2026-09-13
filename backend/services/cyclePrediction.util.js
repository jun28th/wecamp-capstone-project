// Pure helper functions for period-prediction math (AC1, AC2, AC7).
// Kept separate from cycleLog.service.js so the stats logic is unit-testable
// without touching the DB layer.

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Cycles are stored as DATEONLY ("YYYY-MM-DD" strings). Parse as UTC so we
// never get an off-by-one from local timezone shifting the calendar date.
function toUTCDate(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function daysBetween(dateStrA, dateStrB) {
  return Math.round((toUTCDate(dateStrB) - toUTCDate(dateStrA)) / MS_PER_DAY);
}

function addDays(dateStr, days) {
  const date = toUTCDate(dateStr);
  date.setUTCDate(date.getUTCDate() + Math.round(days));
  return date.toISOString().slice(0, 10);
}

function mean(values) {
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

// Population stddev — we're describing the spread of the user's own logged
// history, not estimating a wider population's variance.
function stddev(values) {
  if (values.length < 2) return 0;
  const avg = mean(values);
  const variance = mean(values.map((v) => (v - avg) ** 2));
  return Math.sqrt(variance);
}

const MIN_COMPLETE_CYCLES = 2;
// AC7: flag as irregular once the spread between cycle lengths is large
// relative to the average — 15% (with a 4-day floor so short averages
// don't get flagged on trivial 1-2 day noise).
const IRREGULAR_RATIO_THRESHOLD = 0.15;
const IRREGULAR_MIN_STDDEV_DAYS = 4;

/**
 * @param {Array<{startDate: string, endDate: string|null}>} cycles - all of a
 *   user's cycles, any order.
 * @returns {{
 *   hasEnoughData: boolean,
 *   message: string|null,
 *   predictedNextStart: string|null,
 *   daysUntilNext: number|null,
 *   avgCycleLengthDays: number|null,
 *   avgPeriodLengthDays: number|null,
 *   cycleLengthStddev: number|null,
 *   isIrregular: boolean,
 *   irregularNote: string|null
 * }}
 */
function computeCyclePrediction(cycles, today = new Date()) {
  const sorted = [...cycles].sort((a, b) =>
    a.startDate < b.startDate ? -1 : a.startDate > b.startDate ? 1 : 0,
  );
  const completed = sorted.filter((c) => c.endDate);

  if (completed.length < MIN_COMPLETE_CYCLES) {
    return {
      hasEnoughData: false,
      message: "Not enough data yet to predict your next cycle",
      predictedNextStart: null,
      daysUntilNext: null,
      avgCycleLengthDays: null,
      avgPeriodLengthDays: null,
      cycleLengthStddev: null,
      isIrregular: false,
      irregularNote: null,
    };
  }

  const gaps = [];
  for (let i = 1; i < completed.length; i++) {
    gaps.push(daysBetween(completed[i - 1].startDate, completed[i].startDate));
  }

  const avgCycleLengthDays = Math.round(mean(gaps) * 100) / 100;
  const periodLengths = completed.map(
    (c) => daysBetween(c.startDate, c.endDate) + 1,
  );
  const avgPeriodLengthDays = Math.round(mean(periodLengths) * 100) / 100;
  const cycleLengthStddev = Math.round(stddev(gaps) * 100) / 100;

  const isIrregular =
    cycleLengthStddev >= IRREGULAR_MIN_STDDEV_DAYS &&
    cycleLengthStddev / avgCycleLengthDays >= IRREGULAR_RATIO_THRESHOLD;

  // Anchor from the most recent cycle overall (may still be open) so a
  // freshly-logged start immediately reshapes the next prediction (AC5/AC6).
  const latestCycle = sorted[sorted.length - 1];
  const predictedNextStart = addDays(latestCycle.startDate, avgCycleLengthDays);
  const todayStr = today.toISOString().slice(0, 10);
  const daysUntilNext = daysBetween(todayStr, predictedNextStart);

  return {
    hasEnoughData: true,
    message: null,
    predictedNextStart,
    daysUntilNext,
    avgCycleLengthDays,
    avgPeriodLengthDays,
    cycleLengthStddev,
    isIrregular,
    irregularNote: isIrregular
      ? "Your cycles vary a lot — treat this prediction as a rough guide only!"
      : null,
  };
}

export { computeCyclePrediction, daysBetween, addDays };
