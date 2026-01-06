import { useEffect, useState } from "react";

export function useLocalStorageNotes(key = "notes") {
  const [notes, setNotes] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  // load once
  useEffect(() => {
  try {
    const stored = localStorage.getItem("notes");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) setNotes(parsed);
    }
  } catch (e) {
    // opcjonalnie: localStorage.removeItem("notes");
  } finally {
    setHydrated(true); // ⬅️ dopiero teraz pozwalamy na zapis
  }
}, []);

useEffect(() => {
  if (!hydrated) return; // ⬅️ blokada zapisu na starcie
  localStorage.setItem("notes", JSON.stringify(notes));
}, [notes, hydrated]);


  return [notes, setNotes];
}
