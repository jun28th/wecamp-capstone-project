export default function PhaseMessage({ phaseMessage }) {
  if (!phaseMessage) return null;

  const { accent, tint, icon, title, description } = phaseMessage;

  return (
    <div
      className="card"
      id="phase-message-card"
      data-od-id="phase-message-card"
      style={{ borderLeft: `4px solid ${accent}` }}
    >
      <div className="flex items-start gap-[14px]">
        <div
          id="phase-icon"
          className="w-[44px] h-[44px] rounded-full flex items-center justify-center text-[20px] shrink-0"
          style={{ background: tint }}
        >
          {icon}
        </div>
        <div>
          <h3
            id="phase-title"
            className="m-0 mb-1 text-[16px] font-semibold text-[var(--color-ink)]"
          >
            {title}
          </h3>
          <p
            id="phase-description"
            className="text-caption m-0 !text-[14px]"
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}