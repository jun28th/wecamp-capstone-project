import { useCallback, useEffect, useState } from "react";
import goalApi from "@api/goalApi";
import { useToast } from "@contexts/toastContext";

export function useGoal() {
  const [goal, setGoal] = useState(null);
  const showToast = useToast();

  const loadGoal = useCallback(async () => {
    try {
      const data = await goalApi.getTodayGoal();
      setGoal(data);
    } catch (error) {
      showToast("Failed to load today's goal", "error");
    }
  }, [showToast]);

  useEffect(() => {
    loadGoal();
  }, [loadGoal]);

  const saveGoal = useCallback(
    async (rewardText) => {
      try {
        const data = await goalApi.setTodayGoal(rewardText);
        setGoal(data);
        showToast("Goal saved successfully");
        return true;
      } catch (error) {
        showToast("Something went wrong, please try again", "error");
        return false;
      }
    },
    [showToast],
  );

  const removeGoal = useCallback(async () => {
    try {
      await goalApi.deleteTodayGoal();
      setGoal(null);
      showToast("Goal removed");
      return true;
    } catch (error) {
      showToast("Failed to remove goal", "error");
      return false;
    }
  }, [showToast]);

  return { goal, saveGoal, removeGoal };
}
