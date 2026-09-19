import { useState, useCallback, useEffect } from "react";
import { getCycles } from "../api/cycleApi";

export const useCycleLogs = () => {
  const [refreshSignal, setRefreshSignal] = useState(0);
  const bumpRefresh = useCallback(() => setRefreshSignal((s) => s + 1), []);

  const [cycleLogs, setCycleLogs] = useState([]);
  
  const fetchCycles = useCallback(async () => {
    try {
      const result = await getCycles();
      if (result.success) {
        setCycleLogs(result.data);
      }
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  }, []);

  useEffect(() => {
    fetchCycles();
  }, [fetchCycles]);

  return {
    cycleLogs,
    refreshSignal,
    bumpRefresh,
  };
};