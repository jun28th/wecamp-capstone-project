import { useState } from "react";
import Button from "@common/Button";
import Modal from "@common/Modal";

const CONFETTI_COLORS = [
  "bg-primary",
  "bg-primary-deep",
  "bg-gold",
  "bg-secondary",
  "bg-cool",
];

function makeConfettiPieces() {
  return Array.from({ length: 24 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 300}ms`,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  }));
}

function Confetti() {
  const [pieces] = useState(makeConfettiPieces);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {pieces.map((piece, i) => (
        <span
          key={i}
          className={`absolute -top-2.5 size-2 animate-[confetti-fall_1400ms_ease-in_forwards] rounded-[2px] motion-reduce:hidden ${piece.color}`}
          style={{ left: piece.left, animationDelay: piece.delay }}
        />
      ))}
    </div>
  );
}

export default function CelebrationModal({ open, rewardText, onClose }) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      cardClassName="relative overflow-hidden text-center"
    >
      <Confetti />
      <div className="mb-2 text-[40px]">🎉</div>
      <h3 className="mb-4 text-[18px] text-ink">Goal complete!</h3>
      <p className="mb-5 text-[15px] text-ink">
        You've completed today's goal. Enjoy: {rewardText}
      </p>
      <Button className="w-full" onClick={onClose}>
        Nice!
      </Button>
    </Modal>
  );
}
