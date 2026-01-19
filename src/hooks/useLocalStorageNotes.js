import { useEffect, useState } from "react";

export function useLocalStorageNotes(key = "notes") {
  const [notes, setNotes] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  // ⬅️ wczytuj notatki zawsze, gdy zmieni się KEY (czyli użytkownik)
  useEffect(() => {
    setHydrated(false);

    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setNotes(parsed);
        else setNotes([]);
      } else {
        setNotes([]);
      }
    } catch (e) {
      setNotes([]);
    } finally {
      setHydrated(true);
    }
  }, [key]);

  // ⬅️ zapisuj do AKTUALNEGO key (nie do "notes")
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(key, JSON.stringify(notes));
  }, [notes, hydrated, key]);

  return [notes, setNotes];
}
