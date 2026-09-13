import React from "react";
export const CalendarLegend = React.memo(() => {
  return (
    <div className="mini-legend">
      <div className="mini-legend-item">
        <span
          className="mini-legend-dot"
          style={{ background: "#C0447A" }}
        ></span>
        Period day
      </div>
      <div className="mini-legend-item">
        <span
          className="mini-legend-dot"
          style={{ border: "1.5px solid var(--color-primary-deep)" }}
        ></span>
        Today
      </div>
      <div className="mini-legend-item">
        <span
          className="mini-legend-dot"
          style={{ background: "var(--color-cool)" }}
        ></span>
        Has tasks
      </div>
      <div className="mini-legend-item">
        <span
          className="mini-legend-dot"
          style={{ background: "var(--color-error-text)" }}
        ></span>
        Urgent task
      </div>
    </div>
  );
});
