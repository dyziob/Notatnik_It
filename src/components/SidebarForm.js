import React, { useMemo, useState } from "react";

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
  };

  const submit = (e) => {
    e.preventDefault();
    const t = title.trim();
    const c = content.trim();
    if (!t || !c) return;

    onAddNote({
      title: t,
      content: c,
      tags: selectedTags,
      color: selectedColor,
    });

    resetForm();
  };

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Dodaj notatkę</h2>

      <form onSubmit={submit} className="form">
        <label className="field">
          <div className="label">Tytuł notatki</div>
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Podaj tytuł..."
          />
        </label>

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
          <input
            className="input"
            value={tagInput}
            onChange={(e) => {
              const v = e.target.value;
              setTagInput(v);
              setShowTagHints(v.trim().length > 0);
            }}
            placeholder="np. JavaScript"
          />

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

        <button className="addBtn" type="submit">
          Dodaj
        </button>
      </form>
    </aside>
  );
}
