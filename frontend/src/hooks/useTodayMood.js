import { useEffect, useState } from "react";
import dailyLogApi from "@api/dailyLogApi";
import { useToast } from "@contexts/toastContext";

export function useTodayMood({ onSaved } = {}) {
  const showToast = useToast();
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState("");
  const [finalize, setFinalize] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchTodayMood() {
      try {
        const log = await dailyLogApi.getTodayLog();
        if (cancelled) return;
        if (log === null) return;

        const { mood, note: savedNote } = log;
        if (mood) setSelectedMood(mood);
        if (savedNote) setNote(savedNote);
        setFinalize(true);
      } catch (err) {
        console.error("Failed to load today's mood:", err);
      } finally {
        if (!cancelled) setInitialLoading(false);
      }
    }

    fetchTodayMood();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectMood = (moodNumber) => {
    if (finalize) return;
    setSelectedMood(moodNumber);
  };

  const saveMood = async () => {
    if (selectedMood === null) {
      showToast("Mood isn't chosen yet.", "error");
      return;
    }
    try {
      setSaving(true);
      await dailyLogApi.createLog({ mood: selectedMood, note });
      setFinalize(true);
      onSaved?.();
    } catch (error) {
      console.error("Failed to save mood:", error);
      showToast("Unable to save mood; please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  return {
    selectedMood,
    note,
    setNote,
    finalize,
    initialLoading,
    saving,
    selectMood,
    saveMood,
  };
}