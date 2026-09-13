import React from "react";
export const DayDetail = React.memo(({ isShow }) => {
  if (!isShow) return null;
  return (
    <div
      id="day-detail-panel"
      className="day-detail-panel"
      data-od-id="day-detail-panel"
    >
      <p
        id="day-detail-date"
        style={{
          margin: "0 0 10px 0",
          fontSize: "14px",
          fontWeight: 600,
          color: "var(--color-ink)",
        }}
      ></p>
      <div id="day-detail-cycle"></div>
      <div id="day-detail-tasks"></div>
    </div>
  );
});
