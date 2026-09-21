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

  // Sử dụng Tailwind utility classes tương ứng thay thế cho các class CSS thuần
  const containerClasses = isDashboard 
    ? "flex flex-wrap gap-3 mt-3" 
    : "flex flex-wrap gap-3 mt-5";
    
  const itemClasses = isDashboard 
    ? "flex items-center gap-1.5 text-[12px] text-[var(--muted)]" 
    : "flex items-center gap-1.5 text-[13px] text-[var(--muted)]";
    
  const dotClasses = isDashboard 
    ? "rounded-full shrink-0 w-[10px] h-[10px]" 
    : "rounded-full shrink-0 w-[12px] h-[12px]";

  return (
    <div className={containerClasses}>
      {items.map((item, index) => (
        <div className={itemClasses} key={index}>
          <span className={dotClasses} style={item.style}></span>
          {item.label}
        </div>
      ))}
    </div>
  );
});