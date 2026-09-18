import { useEffect, useState } from "react";

const DOT_COLORS = [
  "var(--color-primary)",
  "var(--color-secondary)",
  "var(--color-cool)",
];

const MESSAGES = [
  "Getting things ready",
  "Just a moment",
  "Almost there",
];

export default function Loading({ label, fullscreen = false }) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (label) return; // don't cycle if a fixed label was provided
    const id = setInterval(() => {
      setMessageIndex((i) => (i + 1) % MESSAGES.length);
    }, 2200);
    return () => clearInterval(id);
  }, [label]);

  const caption = label ?? MESSAGES[messageIndex];

  return (
    <div
      className={
        fullscreen
          ? "flex min-h-screen w-full items-center justify-center bg-bg"
          : "flex w-full items-center justify-center py-12"
      }
      role="status"
      aria-live="polite"
    >
      <style>{`
        @keyframes winx-bounce {
          0%, 80%, 100% { transform: translateY(0) scale(0.85); opacity: 0.6; }
          40% { transform: translateY(-10px) scale(1); opacity: 1; }
        }
        .winx-dot {
          animation: winx-bounce 1.1s var(--ease-out) infinite;
        }
      `}</style>

      <div className="flex flex-col items-center gap-4 rounded-card bg-surface-2 px-8 py-6 shadow-2">
        <div className="flex items-end gap-3">
          {DOT_COLORS.map((color, i) => (
            <span
              key={color}
              className="winx-dot inline-block h-3.5 w-3.5 rounded-pill"
              style={{
                backgroundColor: color,
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
        <p className="font-display text-h3 text-fg" style={{ fontVariationSettings: '"WONK" 1' }}>
          {caption}
        </p>
      </div>
    </div>
  );
}
