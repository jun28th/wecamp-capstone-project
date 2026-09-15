import { useState } from "react";

const CONFETTI_COLORS = [
  "var(--color-primary)",
  "var(--color-primary-deep)",
  "var(--color-gold)",
  "var(--color-secondary)",
  "var(--color-cool)",
];

function makeConfettiPieces() {
  return Array.from({ length: 24 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 300}ms`,
    background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  }));
}

function Confetti() {
  const [pieces] = useState(makeConfettiPieces);

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((piece, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{ left: piece.left, animationDelay: piece.delay, background: piece.background }}
        />
      ))}
    </div>
  );
}

export default function CelebrationModal({ open, rewardText, onClose }) {
  if (!open) return null;

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div className="modal-card celebration-card" onClick={(event) => event.stopPropagation()}>
        <Confetti />
        <div className="celebration-icon">🎉</div>
        <h3>Goal complete!</h3>
        <p style={{ margin: "0 0 20px 0", color: "var(--color-ink)", fontSize: "15px" }}>
          You've completed today's goal. Enjoy: {rewardText}
        </p>
        <button className="btn btn-primary" style={{ width: "100%" }} onClick={onClose}>
          Nice!
        </button>
      </div>
    </div>
  );
}
