import React, { useEffect, useMemo, useState } from "react";
import "./css/Main.css";

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

function Main() {
  // top search
  const [query, setQuery] = useState("");

  // notes
  const [notes, setNotes] = useState([]);

  // add note form
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // tags (with suggestions like on your old code)
  const [tagInput, setTagInput] = useState("");
  const [showTagHints, setShowTagHints] = useState(false);
  const [tagHints, setTagHints] = useState(DEFAULT_TAGS);
  const [selectedTags, setSelectedTags] = useState([]);

  // color
  const [selectedColor, setSelectedColor] = useState(NOTE_COLORS[0].hex);

  useEffect(() => {
    const stored = localStorage.getItem("notes");
    if (stored) setNotes(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const filteredNotes = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;

    return notes.filter((n) => {
      const inTitle = n.title.toLowerCase().includes(q);
      const inContent = n.content.toLowerCase().includes(q);
      const inTags = n.tags.some((t) => t.toLowerCase().includes(q));
      return inTitle || inContent || inTags;
    });
  }, [notes, query]);

  const handleTagTyping = (e) => {
    const value = e.target.value;
    setTagInput(value);
    setShowTagHints(value.trim().length > 0);

    const filtered = DEFAULT_TAGS.filter((t) =>
      t.toLowerCase().includes(value.toLowerCase())
    );
    setTagHints(filtered);
  };

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
    setSelectedColor(NOTE_COLORS[0].hex);
    setShowTagHints(false);
  };

  const addNote = (e) => {
    e.preventDefault();
    const t = title.trim();
    const c = content.trim();
    if (!t || !c) return;

    const now = new Date();
    const newNote = {
      id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
      title: t,
      content: c,
      tags: selectedTags,
      color: selectedColor,
      createdAt: now.toISOString(),
    };

    setNotes((prev) => [newNote, ...prev]);
    resetForm();
  };

  const deleteNote = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div id="MainApp">
      {/* TOP BAR */}
      <header className="topbar">
        <div className="brand">Notatnik It</div>

        <div className="topbar-search">
          <input
            className="topbar-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Wyszukaj notatkę po słowie bądź tagu"
          />
        </div>

        <div className="topbar-user" title="Profil">
          <div className="user-circle" />
        </div>
      </header>

      <div className="layout">
        {/* LEFT SIDEBAR */}
        <aside className="sidebar">
          <h2 className="sidebar-title">Dodaj notatkę</h2>

          <form onSubmit={addNote} className="form">
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
                onChange={handleTagTyping}
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
                {NOTE_COLORS.map((c) => (
                  <button
                    type="button"
                    key={c.key}
                    className={
                      "colorDot" + (selectedColor === c.hex ? " active" : "")
                    }
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

        {/* MAIN NOTES GRID */}
        <main className="board">
          <div className="notesGrid">
            {filteredNotes.map((n) => (
              <article
                key={n.id}
                className="note"
                style={{ background: n.color }}
              >
                <div className="noteHeader">
                  <div className="noteTitle">{n.title}</div>
                </div>

                {n.tags?.length > 0 && (
                  <div className="noteTags">
                    {n.tags.map((t) => (
                      <span key={t} className="noteTag">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="noteBody">{n.content}</div>

                <div className="noteFooter">
                  <span className="noteDate">
                    {new Date(n.createdAt).toLocaleDateString("pl-PL")}
                  </span>

                  <button
                    className="noteDelete"
                    onClick={() => deleteNote(n.id)}
                    title="Usuń notatkę"
                    type="button"
                  >
                    🗑
                  </button>
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Main;
