import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import NoteContent from "./NoteContent";

export default function NoteCard({ note, onView, onEdit, onDelete, isMobile }) {
  const bodyRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const measure = () => {
    const el = bodyRef.current;
    if (!el) return;
    const overflowing =
      el.scrollHeight > el.clientHeight + 1 ||
      el.scrollWidth > el.clientWidth + 1;
    setIsOverflowing(overflowing);
  };

  useLayoutEffect(() => {
    measure();
    const t = setTimeout(measure, 0);
    return () => clearTimeout(t);
  }, [note.title, note.content, note.tags?.join(","), note.color, note.contentMode]);

  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const open = () => onView(note);

  return (
    <article
      className={"note" + (isMobile ? " note--mobile" : "")}
      style={{ background: note.color }}
      onClick={open}
      role="button"
      tabIndex={0}
      aria-label={`Otwórz notatkę: ${note.title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
    >
      <div className="noteHeader">
        <div className="noteTitle">{note.title}</div>

        {/* ✅ mobile: 3 kropki */}
        {isMobile && (
          <div className="noteKebabWrap" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="noteKebab"
              aria-label="Menu notatki"
              onClick={() => setMenuOpen((v) => !v)}
            >
              ⋮
            </button>

            {menuOpen && (
              <div className="noteMenu">
                <button type="button" onClick={() => { setMenuOpen(false); onView(note); }}>
                  👁 Podgląd
                </button>
                <button type="button" onClick={() => { setMenuOpen(false); onEdit(note); }}>
                  ✏️ Edytuj
                </button>
                <button type="button" className="danger" onClick={() => { setMenuOpen(false); onDelete(note); }}>
                  🗑 Usuń
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="noteDivider" />

      {note.tags?.length > 0 && (
        <div className="noteTags">
          {note.tags.map((t) => (
            <span key={t} className="noteTag">{t}</span>
          ))}
        </div>
      )}

      <div ref={bodyRef} className="noteBody">
        <NoteContent text={note.content} mode={note.contentMode || "text"} enableCopy={false} />
      </div>

      <div className="noteFooter">
        <span className="noteDate">
          {new Date(note.createdAt).toLocaleDateString("pl-PL")}
        </span>

        {isOverflowing && (
          <div className="noteMoreIcon" title="Notatka zawiera więcej treści">⋯</div>
        )}
      </div>

      {/* ✅ desktop zostaje overlay hover */}
      {!isMobile && (
        <div className="noteOverlay" onClick={open}>
          <button type="button" className="overlayBtn btnSlide" onClick={(e) => { e.stopPropagation(); onView(note); }}>
            👁 Przeglądaj notatkę
          </button>
          <button type="button" className="overlayBtn btnSlide" onClick={(e) => { e.stopPropagation(); onEdit(note); }}>
            ✏️ Edytuj notatkę
          </button>
          <button type="button" className="overlayBtn danger btnSlide" onClick={(e) => { e.stopPropagation(); onDelete(note); }}>
            🗑 Usuń notatkę
          </button>
        </div>
      )}
    </article>
  );
}
