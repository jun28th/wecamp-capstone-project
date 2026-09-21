import { useEffect, useRef, useState } from "react";

const hasCelebrated = (key) => {
  try {
    return localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
};

const setCelebrated = (key, value) => {
  try {
    if (value) localStorage.setItem(key, "1");
    else localStorage.removeItem(key);
  } catch {}
};

export function useCelebration(pct, enabled, storageKey = "celebration:progress") {
  const [open, setOpen] = useState(false);
  const previousPctRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const prev = previousPctRef.current;

    if (pct < 100) {
      // chỉ reset cờ khi thực sự thấy progress tụt từ 100 xuống
      if (prev === 100) setCelebrated(storageKey, false);
    } else if (prev !== null && prev < 100 && !hasCelebrated(storageKey)) {
      setCelebrated(storageKey, true);
      setOpen(true);
    }

    previousPctRef.current = pct;
  }, [pct, enabled, storageKey]);

  return [open, setOpen];
}