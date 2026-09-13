import React from "react";
export const CalendarHeader = React.memo(({monthYearLabel}) => {
  return (
    <div
      className="mini-calendar-header"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "16px",
      }}
    >
      <h4
        id="mini-month-year"
        style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}
      >
        {monthYearLabel}
      </h4>
    </div>
  );
});
