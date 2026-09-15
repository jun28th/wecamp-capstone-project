export default function PhaseMessage({ phaseMessage }) {
  if (!phaseMessage) return null;
  return (
    <div
      className="card"
      id="phase-message-card"
      data-od-id="phase-message-card"
      style={{ borderLeft: `4px solid ${phaseMessage.accent}` }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
        <div
          id="phase-icon"
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            flexShrink: "0",
            background: phaseMessage.tint,
          }}
        >
          {phaseMessage.icon}
        </div>
        <div>
          <h3
            id="phase-title"
            style={{
              margin: "0 0 4px 0",
              fontSize: "16px",
              color: "var(--color-ink)",
            }}
          >
            {phaseMessage.title}
          </h3>
          <p
            id="phase-description"
            className="text-caption"
            style={{ margin: "0", fontSize: "14px" }}
          >
            {phaseMessage.description}
          </p>
        </div>
      </div>
    </div>
  );
}
