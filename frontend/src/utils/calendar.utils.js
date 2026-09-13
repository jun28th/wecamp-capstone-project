export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// export const WEEKDAYSDASHBOARD = ["S", "M", "T", "W", "T", "F", "S"];

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

  // Empty cell days at the begining of a month
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
