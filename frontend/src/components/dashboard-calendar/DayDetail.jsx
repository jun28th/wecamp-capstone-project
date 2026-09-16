export const DayDetail = ({ isShow, selectedDate, isPeriodDay, tasksForDate }) => {
  if (!isShow) return null;

  // Format ngày hiển thị (VD: Wednesday, September 16)
  const formattedDate = selectedDate 
    ? new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { 
        weekday: "long", 
        month: "long", 
        day: "numeric" 
      }) 
    : "";

  return (
    <div id="day-detail-panel" className="day-detail-panel" style={{ display: "block", marginTop: "16px" }} data-od-id="day-detail-panel">
      <p id="day-detail-date" style={{ margin: "0 0 10px 0", fontSize: "14px", fontWeight: 600, color: "var(--color-ink)" }}>
        {formattedDate}
      </p>
      
      {/* Hiển thị nhãn chu kỳ nếu là ngày có period */}
      <div id="day-detail-cycle">
        {isPeriodDay && (
          <div style={{ marginBottom: "10px" }}>
            <span className="tag" style={{ background: "#C0447A", color: "white" }}>Period day</span>
          </div>
        )}
      </div>

      {/* Danh sách Task của ngày */}
      <div id="day-detail-tasks">
        {(!tasksForDate || tasksForDate.length === 0) ? (
          <p className="text-caption" style={{ margin: 0 }}>No tasks for this day</p>
        ) : (
          tasksForDate.map((t) => (
            <div 
              key={t.id} 
              className={`day-detail-task-item ${t.isCompleted ? "done" : ""}`}
              style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}
            >
              <span>{t.isCompleted ? "✓" : "○"}</span>
              <span style={{ flex: 1, textDecoration: t.isCompleted ? "line-through" : "none" }}>
                {t.title}
              </span>
              {t.isUrgent && (
                <span className="tag" style={{ background: "var(--color-primary-deep)", color: "white", fontSize: "11px", padding: "2px 8px" }}>
                  Urgent
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};