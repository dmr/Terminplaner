import { useEffect, useState } from "react";

const KEY = "terminplaner.v1";

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return { termine: [] };
}

export function useTermine() {
  const [termine, setTermine] = useState(() => loadState().termine);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ termine }));
    } catch {
      /* ignore quota / private mode */
    }
  }, [termine]);

  return [termine, setTermine];
}

export function uid() {
  return "t" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
