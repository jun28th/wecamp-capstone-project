import { useState } from "react";
import Button from "@common/Button";
import Loading from "@common/Loading";
import { useTodayMood } from "@hooks/useTodayMood";

const MOOD_TYPES = [
  { moodNumber: 1, moodLabel: "very-bad", title: "Very Bad", icon: "😢" },
  { moodNumber: 2, moodLabel: "sad", title: "Sad", icon: "🙁" },
  { moodNumber: 3, moodLabel: "neutral", title: "Neutral", icon: "😐" },
  { moodNumber: 4, moodLabel: "happy", title: "Happy", icon: "🙂" },
  { moodNumber: 5, moodLabel: "very-happy", title: "Very Happy", icon: "😄" },
];

const NOTE_MAX_LENGTH = 60;

export default function MoodCard({ dashboard = false, onSaved }) {
  const {
    selectedMood,
    note,
    setNote,
    finalize,
    initialLoading,
    saving,
    selectMood,
    saveMood,
  } = useTodayMood({ onSaved });
  const [hoveredMood, setHoveredMood] = useState(null);

  const hasSavedNote = finalize && note.trim() !== "";

  if (initialLoading) {
    return <Loading />;
  }

  return (
    <div
      className={`card mx-auto mb-5 ${dashboard ? "" : "max-w-[640px]"}`}
      data-od-id="mood-tracker-card"
    >
      <div className={dashboard ? "max-w-[480px] mx-auto" : ""}>
        <h3 className="m-0 mb-4 text-base font-semibold">
          How are you feeling today?
        </h3>

        <div
          className="flex justify-around gap-3 mb-4"
          data-od-id="mood-tracker-selector"
        >
          {MOOD_TYPES.map((mood) => {
            const isSelected = selectedMood === mood.moodNumber;
            const isTooltipVisible =
              hasSavedNote && isSelected && hoveredMood === mood.moodNumber;

            return (
              <div
                key={mood.moodNumber}
                className="relative flex shrink-0 items-center justify-center"
                onMouseEnter={() => setHoveredMood(mood.moodNumber)}
                onMouseLeave={() => setHoveredMood(null)}
              >
                {isTooltipVisible && (
                  <div
                    role="tooltip"
                    id={`mood-note-tooltip-${mood.moodLabel}`}
                    className="
                      absolute -top-2 left-1/2 z-10 w-60 -translate-x-1/2 -translate-y-full
                      rounded-[var(--radius-input)] border-[1.5px] border-[var(--border)]
                      bg-[var(--bg-elevated,white)] p-3 text-left text-sm text-[var(--color-ink)]
                      shadow-lg break-words whitespace-pre-wrap
                    "
                  >
                    {note}
                    <div
                      className="
                        absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1/2
                        rotate-45 border-b-[1.5px] border-r-[1.5px] border-[var(--border)]
                        bg-[var(--bg-elevated,white)]
                      "
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => selectMood(mood.moodNumber)}
                  data-mood={mood.moodLabel}
                  title={mood.title}
                  aria-pressed={isSelected}
                  aria-label={mood.title}
                  disabled={finalize}
                  className={`
                    flex h-12 w-12 shrink-0 items-center justify-center
                    rounded-full border-2
                    transition-all duration-150 ease-out
                    ${
                      isSelected
                        ? "border-[var(--color-primary-deep)] bg-[var(--color-primary-tint)] shadow-[0_0_0_2px_var(--color-primary-tint)]"
                        : "border-transparent"
                    }
                    ${
                      finalize
                        ? "cursor-not-allowed opacity-40"
                        : "cursor-pointer hover:bg-[var(--color-primary-tint)] hover:scale-110"
                    }
                    ${isSelected && finalize ? "opacity-100" : ""}
                  `}
                >
                  <span className="text-[32px]">{mood.icon}</span>
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-4">
          <label
            htmlFor="mood-note"
            className="mb-2 block text-sm font-medium text-[var(--color-ink)]"
          >
            Note (optional)
          </label>

          <textarea
            id="mood-note"
            placeholder="How are you feeling? Any symptoms or notes..."
            className={`
              w-full min-h-20
              rounded-[var(--radius-input)]
              border-[1.5px] border-[var(--border)]
              p-3 font-[var(--font-body)] text-sm resize-y outline-none
              focus:border-[var(--color-primary-deep)]
              ${finalize ? "cursor-not-allowed opacity-60 bg-[var(--bg-muted,#f5f5f5)]" : ""}
            `}
            readOnly={finalize}
            maxLength={NOTE_MAX_LENGTH}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <div className="flex mb-2 items-center justify-end">
            <span
              className={`text-xs ${
                note.length >= NOTE_MAX_LENGTH
                  ? "text-[var(--color-error-text)]"
                  : "text-[var(--muted)]"
              }`}
            >
              {note.length}/{NOTE_MAX_LENGTH}
            </span>
          </div>

          {!finalize ? (
            <Button
              id="save-mood-btn"
              className="w-full"
              onClick={saveMood}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          ) : (
            <p
              id="mood-locked-note"
              className="mt-2 text-center text-[13px] text-[var(--muted)]"
            >
              You've logged today's mood. Come back tomorrow to log again.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}