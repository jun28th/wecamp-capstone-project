import { useEffect, useState } from "react";
import { getPhaseMessage } from "@api/cycleApi";

export function usePhaseMessage() {
  const [phaseMessage, setPhaseMessage] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const result = await getPhaseMessage();
        if (!cancelled && result.success) {
          setPhaseMessage(result.data);
        }
      } catch (error) {
        console.error(error.response?.data?.message || error.message);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return phaseMessage;
}