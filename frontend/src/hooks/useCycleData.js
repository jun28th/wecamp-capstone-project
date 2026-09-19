// src/hooks/useCycleData.js
import { useState, useCallback, useEffect } from "react";
import { getCycles, getPrediction } from "../api/cycleApi";

export const useCycleData = (refreshSignal) => {
  const [cycleLogs, setCycleLogs] = useState([]);
  const [prediction, setPrediction] = useState(null);

  const fetchCycles = useCallback(async () => {
    try {
      const result = await getCycles();
      if (result.success) setCycleLogs(result.data);
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  }, []);

  const fetchPrediction = useCallback(async () => {
    try {
      const result = await getPrediction();
      if (result.success) setPrediction(result.data);
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  }, []);

  useEffect(() => {
    fetchCycles();
    fetchPrediction();
  }, [fetchCycles, fetchPrediction, refreshSignal]);

  return {
    cycleLogs,
    prediction,
    fetchCycles,
    fetchPrediction,
  };
};