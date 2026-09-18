const VARIANT_MAP = {
  happy: { text: "Very Happy", bg: "var(--color-primary)" },
  calm: { text: "Calm", bg: "var(--color-cool-light)" },
  neutral: { text: "Neutral", bg: "var(--color-secondary)" },
  stressed: { text: "Stressed", bg: "var(--color-error)" },
  streak: { text: "🔥 7-Day Streak", bg: "var(--color-gold)" },
};

export default function Tag({ variant = "happy" }) {
  const config = VARIANT_MAP[variant] ?? VARIANT_MAP.happy;

  return (
    <span className="tag" style={{ background: config.bg }}>
      {config.text}
    </span>
  );
}
