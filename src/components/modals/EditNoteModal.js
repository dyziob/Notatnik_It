import React, { useEffect, useMemo, useState } from "react";

const DEFAULT_TAGS = [
  "JavaScript", "Python", "Java", "C#", "C++", "PHP", "Swift", "TypeScript",
  "Ruby", "Go", "Kotlin", "Rust", "MATLAB", "R", "Perl", "Objective-C",
  "Scala", "Shell", "SQL", "HTML/CSS",
];

const NOTE_COLORS = [
  { key: "yellow", hex: "#f4e36a" },
  { key: "green", hex: "#b7d8b7" },
  { key: "red", hex: "#e9a1a1" },
  { key: "blue", hex: "#9cc8ea" },
  { key: "purple", hex: "#c7b2f3" },
  { key: "gray", hex: "#cfcfcf" },
  { key: "orange", hex: "#f2b37a" },
];

export default function EditNoteModal({ note, onClose, onSave }) {
  const [draft, setDraft] = useState(null);

  // tag UI
  const [tagInput, setTagInput] = useState("");
  const [showTagHints, setShowTagHints] = useState(false);

  useEffect(() => {
    if (!note) {
      setDraft(null);
      return;
    }

    setDraft({
      ...note,
      tags: Array.isArray(note.tags) ? note.tags : [],
      contentMode: note.contentMode || "auto",
      color: note.color || NOTE_COLORS[0].hex,
      title: note.title || "",
      content: note.content || "",
    });

    setTagInput("");
    setShowTagHints(false);
  }, [note]);

  const tagHints = useMemo(() => {
    const v = tagInput.trim().toLowerCase();
    if (!v) return [];
    return DEFAULT_TAGS.filter((t) => t.toLowerCase().includes(v));
  }, [tagInput]);

  if (!note || !draft) return null;

  const addTag = (tag) => {
    const clean = (tag || "").trim();
    if (!clean) return;

    setDraft((prev) => {
      if (prev.tags.includes(clean)) return prev;
      return { ...prev, tags: [...prev.tags, clean] };
    });

    setTagInput("");
    setShowTagHints(false);
  };

  const removeTag = (tag) => {
    setDraft((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const handleTagTyping = (e) => {
    const value = e.target.value;
    setTagInput(value);
    setShowTagHints(value.trim().length > 0);
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const v = tagInput.trim();
      if (v) addTag(v);
    }
    if (e.key === "Escape") {
      setShowTagHints(false);
    }
  };

  return (
    <div className="modalBackdrop" onClick={onClose}>
      <div
        className="modal modal--large modal--edit"
        onClick={(e) => e.stopPropagation()}
      >
        {/* X w prawym górnym rogu modalu */}
        <button className="modalX" onClick={onClose} aria-label="Zamknij">
          ×
        </button>

        <div className="modalHeader">
          <div className="modalTitle">Edytuj notatkę</div>
        </div>

        {/* BODY scrolluje, footer zostaje na dole */}
        <div className="modalBody modalBody--large">
          <div className="editGrid">
            {/* LEWA KOLUMNA */}
            <div className="editLeft">
              {/* Tytuł */}
              <label className="field field--title">
                <div className="label">Tytuł</div>
                <input
                  className="input"
                  value={draft.title}
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, title: e.target.value }))
                  }
                />
              </label>

              {/* Tryb treści */}
              <div className="field field--slider">
                <div className="label">Tryb treści</div>
                <div className="segmented" data-active={draft.contentMode}>
                  <div className="segIndicator" aria-hidden="true" />
                  <button
                    type="button"
                    className={
                      "segBtn" + (draft.contentMode === "text" ? " active" : "")
                    }
                    onClick={() =>
                      setDraft((p) => ({ ...p, contentMode: "text" }))
                    }
                  >
                    Tekst
                  </button>

                  <button
                    type="button"
                    className={
                      "segBtn" + (draft.contentMode === "auto" ? " active" : "")
                    }
                    onClick={() =>
                      setDraft((p) => ({ ...p, contentMode: "auto" }))
                    }
                  >
                    Auto
                  </button>

                  <button
                    type="button"
                    className={
                      "segBtn" + (draft.contentMode === "code" ? " active" : "")
                    }
                    onClick={() =>
                      setDraft((p) => ({ ...p, contentMode: "code" }))
                    }
                  >
                    Kod
                  </button>
                </div>
              </div>

              {/* Tagi */}
              <div className="field">
                <div className="label">Tagi</div>
                <input
                  className="input"
                  value={tagInput}
                  onChange={handleTagTyping}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Wpisz tag i Enter (albo wybierz z podpowiedzi)"
                />

                {showTagHints && tagHints.length > 0 && (
                  <div className="tagHints">
                    {tagHints
                      .filter((t) => !draft.tags.includes(t))
                      .slice(0, 10)
                      .map((t) => (
                        <button
                          type="button"
                          key={t}
                          className="tagHint"
                          onClick={() => addTag(t)}
                        >
                          {t}
                        </button>
                      ))}
                  </div>
                )}

                {draft.tags.length > 0 && (
                  <div className="tagRow">
                    {draft.tags.map((t) => (
                      <button
                        type="button"
                        key={t}
                        className="tagChip"
                        onClick={() => removeTag(t)}
                      >
                        {t} <span className="x">×</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Kolor */}
              <div className="field">
                <div className="label">Kolor notatki</div>
                <div className="colors">
                  {NOTE_COLORS.map((c) => (
                    <button
                      type="button"
                      key={c.key}
                      className={
                        "colorDot" + (draft.color === c.hex ? " active" : "")
                      }
                      style={{ background: c.hex }}
                      onClick={() => setDraft((p) => ({ ...p, color: c.hex }))}
                      aria-label={c.key}
                      title={c.key}
                    />
                  ))}
                </div>
              </div>
              
              {/* MINI PODGLĄD NOTATKI */}
              <div className="miniPreviewWrap">
                <div className="miniPreviewTitle">Podgląd notatki</div>

                <article className="miniNote" style={{ background: draft.color }}>
                  <div className="miniNoteHeader">
                    <div className="miniNoteTitle">
                      {draft.title?.trim() ? draft.title : "Tytuł"}
                    </div>
                    <div className="miniNoteBar" />
                  </div>

                  {draft.tags?.length > 0 && (
                    <div className="miniNoteTags">
                      {draft.tags.slice(0, 4).map((t) => (
                        <span key={t} className="noteTag">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="miniNoteBody">
                    {(draft.content?.trim() ? draft.content : "Treść notatki...")
                      .split("\n")
                      .slice(0, 6)
                      .join("\n")}
                  </div>

                  {/* Ikonka „więcej treści” – zawsze w rogu, ale pokazuj tylko gdy jest dużo tekstu */}
                  {(draft.content || "").length > 220 && (
                    <div className="miniMoreIcon" title="Notatka zawiera więcej treści">
                      …
                    </div>
                  )}
                </article>
              </div>
            </div>

            {/* PRAWA KOLUMNA */}
            <div className="editRight">
              <label className="field field--grow">
                <div className="label">Treść</div>
                <textarea
                  className="textarea textarea--editBig"
                  value={draft.content}
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, content: e.target.value }))
                  }
                />
              </label>
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="modalActions modalActions--sticky">
          <button className="modalClose btnSlide" onClick={onClose}>
            Anuluj
          </button>
          <button className="modalSave btnSlide" onClick={() => onSave(draft)}>
            Zapisz
          </button>
        </div>
      </div>
    </div>
  );
}
