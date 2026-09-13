export default function CalendarLegend() {
  return (
    <div className="legend" style={{ marginTop: "20px" }}>
      <div className="legend-item">
        <span className="legend-dot" style={{ background: "#C0447A" }}></span>Period
        day
      </div>
      <div className="legend-item">
        <span
          className="legend-dot"
          style={{
            background: "transparent",
            border: "1.5px dashed var(--color-primary-deep)",
          }}
        ></span>
        Predicted day
      </div>
      <div className="legend-item">
        <span
          className="legend-dot"
          style={{ border: "2px solid var(--color-ink)" }}
        ></span>
        Today
      </div>
    </div>
  );
}
