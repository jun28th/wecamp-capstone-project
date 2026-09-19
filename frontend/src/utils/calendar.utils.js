export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const formatMonthYear = (year, month) => {
  const date = new Date(year, month - 1, 1);

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
};

export const formatStringDateToMonthDay = (str) => {
  if (!str) return "";
  const [y, m, d] = str.split("-").map(Number);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(y, m - 1, d));
};

export const generateCalendarDays = (year, month) => {
  const days = [];

  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  const totalDays = new Date(year, month, 0).getDate();

  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push({ dateString: null, dayNumber: null, isEmpty: true });
  }

  for (let day = 1; day <= totalDays; day++) {
    const formattedMonth = String(month).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const dateString = `${year}-${formattedMonth}-${formattedDay}`;

    days.push({
      dateString: dateString,
      dayNumber: day,
      isEmpty: false,
    });
  }

  return days;
};

export const formatDateWithYear = (isoStr) => {
  const dateOnly = isoStr.split("T")[0];
  const [y, m, d] = dateOnly.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(y, m - 1, d));
};

export const getDayCount = (startStr, endStr) => {
  const start = new Date(startStr.split("T")[0]);
  const end = new Date(endStr.split("T")[0]);
  const diffMs = end.getTime() - start.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1; // +1 để tính cả ngày bắt đầu
  return diffDays;
};

export const todayEyebrow = () => {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}