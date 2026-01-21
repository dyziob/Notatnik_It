import React, { useEffect, useMemo, useState } from "react";

const TAG_MAX = 24; // max długość 1 tagu (zmień jeśli chcesz)

export default function TagModal({
  open,
  onClose,
  selectedTags,
  setSelectedTags,
  defaultTags = [],
}) {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const normalize = (t) => (t || "").trim().replace(/\s+/g, " ");

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = Array.isArray(defaultTags) ? defaultTags : [];

    const filtered = q
      ? base.filter((t) => t.toLowerCase().includes(q))
      : base;

    // nie pokazuj już wybranych
    return filtered.filter((t) => !selectedTags.includes(t));
  }, [defaultTags, query, selectedTags]);

  // (opcjonalnie) czyść błędy po otwarciu modalu
  useEffect(() => {
    if (open) setError("");
  }, [open]);

  if (!open) return null;

  const closeAndReset = () => {
    setInput("");
    setQuery("");
    setError("");
    onClose();
  };

  const addOne = (raw) => {
    const clean = normalize(raw);

    // błąd: pusty tag
    if (!clean) {
      setError("Nie możesz dodać pustego tagu.");
      return false;
    }

    // limit długości
    if (clean.length > TAG_MAX) {
      setError(`Tag może mieć maksymalnie ${TAG_MAX} znaków.`);
      return false;
    }

    // duplikaty
    if (selectedTags.includes(clean)) {
      setError("Ten tag już jest dodany.");
      return false;
    }

    setSelectedTags((prev) => [...prev, clean]);
    setError("");
    return true;
  };

  const addMany = () => {
    // pozwól wpisywać po przecinku, w nowej linii, lub średniku
    const raw = input;

    // usuń potencjalne "puste" separatory i rozbij
    const parts = raw
      .split(/[,\n;]+/g)
      .map((x) => normalize(x))
      .filter(Boolean);

    if (parts.length === 0) {
      setError("Wpisz tag, zanim dodasz.");
      return;
    }

    let addedAny = false;

    for (const p of parts) {
      const ok = addOne(p);
      if (ok) addedAny = true;
    }

    // czyść input tylko jeśli cokolwiek dodano
    if (addedAny) setInput("");
  };

  const remove = (tag) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addMany();
    }
    if (e.key === "Escape") {
      closeAndReset();
    }
  };

  return (
    <div className="modalBackdrop" onClick={closeAndReset}>
      <div className="tagModal" onClick={(e) => e.stopPropagation()}>
        <button className="modalX" onClick={closeAndReset} aria-label="Zamknij">
          ×
        </button>

        <div className="tagModalTitle">Dodaj tagi</div>

        <div className="tagModalSection">
          <div className="label">Twoje tagi</div>

          <div className="tagRow">
            {selectedTags.length === 0 ? (
              <div className="tagModalEmpty">Brak tagów</div>
            ) : (
              selectedTags.map((t) => (
                <button
                  type="button"
                  key={t}
                  className="tagChip"
                  onClick={() => remove(t)}
                  title="Kliknij aby usunąć"
                >
                  {t} <span className="x">×</span>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="tagModalSection">
          <div className="label">Dodaj własny tag</div>

          <div className="tagModalAddRow">
            <input
              className="input"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (error) setError("");
              }}
              onKeyDown={onKeyDown}
              placeholder={`Wpisz tag (możesz kilka: np. react, python). Max ${TAG_MAX} znaków.`}
            />

            <button
              type="button"
              className="modalSave btnSlide"
              onClick={addMany}
              title="Dodaj"
            >
              Dodaj
            </button>
          </div>

          {error && <div className="formError">{error}</div>}
        </div>

        <div className="tagModalSection">
          <div className="label">Podpowiedzi</div>

          <input
            className="input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Szukaj w podpowiedziach..."
          />

          <div className="tagHints">
            {suggestions.slice(0, 20).map((t) => (
              <button
                type="button"
                key={t}
                className="tagHint"
                onClick={() => addOne(t)}
              >
                {t}
              </button>
            ))}

            {suggestions.length === 0 && (
              <div className="tagModalEmpty">Brak dopasowań</div>
            )}
          </div>
        </div>

        <div className="tagModalActions">
          <button className="modalClose btnSlide" onClick={closeAndReset}>
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
}
