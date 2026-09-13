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

export const getActionTypeForDate = (dateString, cycleLogs = []) => {
  // Tìm chu kỳ đang mở (chưa có endDate)
  const activeCycle = cycleLogs.find((log) => !log.endDate);

  if (activeCycle) {
    if (dateString === activeCycle.startDate) return "DELETE_START";
    if (dateString > activeCycle.startDate) return "END";
  }

  return "START";
};
