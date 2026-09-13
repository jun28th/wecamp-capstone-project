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

export const getActionTypeForDate = (dateString, cycleLogs = []) => {
  // Tìm chu kỳ đang mở (chưa có endDate)
  const activeCycle = cycleLogs.find((log) => !log.endDate);

  if (activeCycle) {
    if (dateString === activeCycle.startDate) return "DELETE_START";
    if (dateString > activeCycle.startDate) return "END";
  }

  return "START";
};