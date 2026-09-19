const LEGEND_ITEMS = [
  {
    label: "Period day",
    style: { background: "#C0447A" },
  },
  {
    label: "Predicted day",
    style: {
      background: "transparent",
      border: "1.5px dashed var(--color-primary-deep)",
    },
  },
  {
    label: "Today",
    style: { border: "2px solid var(--color-ink)" },
  },
];

export default function CalendarLegend() {
  return (
    <div className="legend" style={{ marginTop: "20px" }}>
      {LEGEND_ITEMS.map((item, index) => (
        <div className="legend-item" key={index}>
          <span className="legend-dot" style={item.style}></span>
          {item.label}
        </div>
      ))}
    </div>
  );
}