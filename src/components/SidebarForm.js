import React, { useMemo, useState } from "react";
import TagModal from "./modals/TagModal";

export default function SidebarForm({
  defaultTags,
  noteColors,
  onAddNote,
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [tagInput, setTagInput] = useState("");
  const [showTagHints, setShowTagHints] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  const [selectedColor, setSelectedColor] = useState(noteColors[0].hex);

  const [contentMode, setContentMode] = useState("auto"); // "text" | "auto" | "code"
  const [tagModalOpen, setTagModalOpen] = useState(false);

  const TITLE_MAX = 40;   // możesz zmienić np. 32 / 50

  const [error, setError] = useState("");

  const tagHints = useMemo(() => {
    const value = tagInput.trim().toLowerCase();
    if (!value) return defaultTags;
    return defaultTags.filter((t) => t.toLowerCase().includes(value));
  }, [defaultTags, tagInput]);

  const addTag = (tag) => {
    if (!selectedTags.includes(tag)) setSelectedTags((prev) => [...prev, tag]);
    setTagInput("");
    setShowTagHints(false);
  };

  const removeTag = (tag) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setTagInput("");
    setSelectedTags([]);
    setSelectedColor(noteColors[0].hex);
    setShowTagHints(false);
    setContentMode("auto");
  };

  const submit = (e) => {
  e.preventDefault();

  const t = title.trim();
  const c = content.trim();

  if (!t) {
    setError("Dodaj tytuł notatki.");
    return;
  }
  /*if (!c) {
    setError("Dodaj treść notatki.");
    return;
  }*/

  onAddNote({
    title: t,
    content: c,
    tags: selectedTags,
    color: selectedColor,
    contentMode,
  });

  setError("");
  resetForm();
};

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Dodaj notatkę</h2>

      <form onSubmit={submit} className="form">
        <label className="field">
          <div className="labelRow">
            <div className="label">Tytuł notatki</div>
            <div className="charCount">
              {title.length}/{TITLE_MAX}
            </div>
          </div>

          <input
            className="input"
            value={title}
            maxLength={TITLE_MAX}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError("");
            }}
            placeholder="Podaj tytuł..."
          />
        </label>

        <div className="field">
          <div className="label label--withHelp">
            Tryb treści

            <span className="helpIcon" tabIndex={0}>
              ?
              <span className="helpTooltip">
                <strong>Tekst</strong> – zwykła notatka bez formatowania.<br /><br />
                <strong>Auto</strong> – aplikacja spróbuje wykryć, czy to kod i sformatuje go automatycznie. Jeśli nie wykryje kodu wpisze zwykły tekst do notatki.<br /><br />
                <strong>Kod</strong> – zawsze traktuje treść jako kod (kolory, czcionka).
              </span>
            </span>
          </div>

          <div
            className="segmented"
            data-active={contentMode}
            role="tablist"
            aria-label="Tryb treści"
          >
            <div className="segIndicator" aria-hidden="true" />

            <button
              type="button"
              className={"segBtn" + (contentMode === "text" ? " active" : "")}
              onClick={() => setContentMode("text")}
              aria-pressed={contentMode === "text"}
            >
              Tekst
            </button>

            <button
              type="button"
              className={"segBtn" + (contentMode === "auto" ? " active" : "")}
              onClick={() => setContentMode("auto")}
              aria-pressed={contentMode === "auto"}
            >
              Auto
            </button>

            <button
              type="button"
              className={"segBtn" + (contentMode === "code" ? " active" : "")}
              onClick={() => setContentMode("code")}
              aria-pressed={contentMode === "code"}
            >
              Kod
            </button>
          </div>
        </div>

        <label className="field">
          <div className="label">Treść notatki</div>
          <textarea
            className="textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Podaj treść..."
          />
        </label>

        <label className="field">
          <div className="label">Tagi</div>

          <div className="tagInputRow">
            <input
              className="input"
              value={tagInput}
              onChange={(e) => {
                const v = e.target.value;
                setTagInput(v);
                setShowTagHints(v.trim().length > 0);
              }}
              placeholder="np. JavaScript lub dodaj własne z pomocą +"
            />

            <button
              type="button"
              className="tagPlusBtn"
              onClick={() => setTagModalOpen(true)}
              aria-label="Dodaj tagi"
              title="Dodaj swoje tagi"
            >
              +
            </button>
          </div>

          {showTagHints && (
            <div className="tagHints">
              {tagHints
                .filter((t) => !selectedTags.includes(t))
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

          {selectedTags.length > 0 && (
            <div className="tagRow">
              {selectedTags.map((t) => (
                <button
                  type="button"
                  key={t}
                  className="tagChip"
                  onClick={() => removeTag(t)}
                  title="Kliknij, aby usunąć"
                >
                  {t} <span className="x">×</span>
                </button>
              ))}
            </div>
          )}

          <TagModal
            open={tagModalOpen}
            onClose={() => setTagModalOpen(false)}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            defaultTags={defaultTags}
          />
        </label>


        <div className="field">
          <div className="label">Kolory notatek</div>
          <div className="colors">
            {noteColors.map((c) => (
              <button
                type="button"
                key={c.key}
                className={"colorDot" + (selectedColor === c.hex ? " active" : "")}
                style={{ background: c.hex }}
                onClick={() => setSelectedColor(c.hex)}
                aria-label={c.key}
                title={c.key}
              />
            ))}
          </div>
        </div>

        {error && <div className="formError">{error}</div>}

        <button className="addBtn btnSlide" type="submit">
          Dodaj
        </button>
      </form>
    </aside>
  );
}
