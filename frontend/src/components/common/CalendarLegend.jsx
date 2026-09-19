import React from "react";

const CYCLE_LEGEND = [
  { label: "Period day", style: { background: "#C0447A" } },
  { label: "Predicted day", style: { background: "transparent", border: "1.5px dashed var(--color-primary-deep)" } },
  { label: "Today", style: { border: "2px solid var(--color-ink)" } },
];

const DASHBOARD_LEGEND = [
  { label: "Period day", style: { background: "#C0447A" } },
  { label: "Today", style: { border: "1.5px solid var(--color-primary-deep)" } },
  { label: "Has tasks", style: { background: "var(--color-cool)" } },
  { label: "Urgent task", style: { background: "var(--color-error-text)" } },
];

export const CalendarLegend = React.memo(({ variant = "cycle" }) => {
  const isDashboard = variant === "dashboard";
  const items = isDashboard ? DASHBOARD_LEGEND : CYCLE_LEGEND;
  const containerClass = isDashboard ? "mini-legend" : "legend";
  const itemClass = isDashboard ? "mini-legend-item" : "legend-item";
  const dotClass = isDashboard ? "mini-legend-dot" : "legend-dot";

  return (
    <div className={containerClass} style={!isDashboard ? { marginTop: "20px" } : undefined}>
      {items.map((item, index) => (
        <div className={itemClass} key={index}>
          <span className={dotClass} style={item.style}></span>
          {item.label}
        </div>
      ))}
    </div>
  );
});