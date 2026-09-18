import { useEffect, useRef, useState } from "react";

export function useCelebration(pct, enabled) {
  const [open, setOpen] = useState(false);
  const previousPctRef = useRef(null);

  useEffect(() => {
    if (enabled && previousPctRef.current !== null && previousPctRef.current < 100 && pct === 100) {
      setOpen(true);
    }
    previousPctRef.current = pct;
  }, [pct, enabled]);

  return [open, setOpen];
}