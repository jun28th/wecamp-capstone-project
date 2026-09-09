import React, { useEffect, useState } from "react";
import Button from "./Button";
import Loading from "./Loading";

const MOOD_TYPES = [
  { moodNumber: 1, moodLabel: "very-bad", title: "Very Bad", icon: "😢" },
  { moodNumber: 2, moodLabel: "sad", title: "Sad", icon: "🙁" },
  { moodNumber: 3, moodLabel: "neutral", title: "Neutral", icon: "😐" },
  { moodNumber: 4, moodLabel: "happy", title: "Happy", icon: "🙂" },
  { moodNumber: 5, moodLabel: "very-happy", title: "Very Happy", icon: "😄" },
];

const NOTE_MAX_LENGTH = 60;

export default function MoodCard({ fromPage = "Cycle" }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState("");
  const [finalize, setFinalize] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredMood, setHoveredMood] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    /*
    const fetchTodayMood = async () => {
    try {
      //const res = await axios.get("/api/mood/today");
      if (cancelled) return;
      const { mood, note: savedNote } = res.data;
      if (mood) {
        setSelectedMood(mood);
      }
      if (savedNote) {
        setNote(savedNote);
        setFinalize(true);
      }
    } catch (err) {
      // hôm nay chưa có mood/note -> giữ fallback null/"" như hiện tại
      console.error("Failed to load today's mood:", err);
    }
  };
  fetchTodayMood()
    */

    setLoading(false);

    return () => {
      cancelled = true;
    };
  }, []);

  const handleMoodSelect = (moodNumber) => {
    // Đã chọn rồi thì không cho chọn lại
    if (selectedMood !== null) return;

    // gọi API đến BE setMood. set thành công thì mới gọi:
    setSelectedMood(moodNumber);
  };

  const handleSaveNote = () => {
    if (note === "") {
      setError("Cannot save an empty note.");
      setTimeout(() => setError(null), 2000);
      return;
    }
    if (note.length > NOTE_MAX_LENGTH) {
      setError("The note cannot exceed 60 characters.");
      setTimeout(() => setError(null), 2000);
      return;
    }

    // gọi API đến BE setNote. set thành công thì mới gọi:
    setFinalize(true);
    setError(null);
  };

  const hasSavedNote = finalize && note.trim() !== "";

  if (loading) {
    return <Loading />;
  }

  return (
    <div
      className={`card mx-auto mb-5 ${fromPage !== "Dashboard" && "max-w-[640px]"}`}
      data-od-id="mood-tracker-card"
    >
      <div className={`${fromPage === "Dashboard" && "max-w-[640px] mx-auto"}`}>
        <h3 className="m-0 mb-4 text-base font-semibold">
          How are you feeling today?
        </h3>

        <div
          className="flex justify-around gap-3 mb-4"
          data-od-id="mood-tracker-selector"
        >
          {MOOD_TYPES.map((mood) => {
            const isSelected = selectedMood === mood.moodNumber;
            const isLocked = selectedMood !== null;

            const canShowTooltipOnThis = selectedMood ? isSelected : true;
            const isTooltipVisible =
              hasSavedNote &&
              canShowTooltipOnThis &&
              hoveredMood === mood.moodNumber;

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

                <div
                  onClick={() => handleMoodSelect(mood.moodNumber)}
                  data-mood={mood.moodLabel}
                  title={mood.title}
                  className={`
          flex h-12 w-12 shrink-0 items-center justify-center
          rounded-full border-2
          transition-all duration-150 ease-out

          ${
            isSelected
              ? `
                border-[var(--color-primary-deep)]
                bg-[var(--color-primary-tint)]
                shadow-[0_0_0_2px_var(--color-primary-tint)]
              `
              : "border-transparent"
          }

          ${
            isLocked
              ? "cursor-not-allowed opacity-40"
              : "cursor-pointer hover:bg-[var(--color-primary-tint)] hover:scale-110"
          }

          ${isSelected && isLocked ? "opacity-100" : ""}
        `}
                >
                  <span className="text-[32px]">{mood.icon}</span>
                </div>
              </div>
            );
          })}
        </div>
        {selectedMood && (
          <p
            id="mood-locked-note"
            className="mt-2 text-center text-[13px] text-[var(--muted)]"
          >
            You've logged today's mood. Come back tomorrow to log again.
          </p>
        )}
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
      p-3
      font-[var(--font-body)]
      text-sm
      resize-y
      outline-none
      focus:border-[var(--color-primary-deep)]
    ${error ? "border-[var(--color-error-text)]" : ""}
    ${finalize ? "cursor-not-allowed opacity-60 bg-[var(--bg-muted,#f5f5f5)]" : ""}`}
            readOnly={finalize}
            maxLength={NOTE_MAX_LENGTH}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div className="flex mb-2 items-center justify-between">
            <span className="err-msg">{error}</span>
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
          {!finalize && (
            <Button
              id="save-mood-btn"
              className="w-full"
              onClick={handleSaveNote}
            >
              Save
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
