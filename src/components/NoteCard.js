import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import NoteContent from "./NoteContent";

export default function NoteCard({ note, onView, onEdit, onDelete }) {
  const bodyRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const measure = () => {
    const el = bodyRef.current;
    if (!el) return;
    const overflowing =
      el.scrollHeight > el.clientHeight + 1 ||
      el.scrollWidth > el.clientWidth + 1;
    setIsOverflowing(overflowing);
  };

  const measureKey = `${note.title ?? ""}||${note.content ?? ""}||${note.tags?.join(",") ?? ""}||${note.color ?? ""}||${note.contentMode ?? "auto"}`;

  useLayoutEffect(() => {
    measure();
    const t = setTimeout(measure, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measureKey]);
  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    let ro;
    if (bodyRef.current && "ResizeObserver" in window) {
      ro = new ResizeObserver(() => measure());
      ro.observe(bodyRef.current);
    }

    return () => {
      window.removeEventListener("resize", onResize);
      if (ro) ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const open = () => onView(note);

  const onCardKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  };

  return (
    <article
      className="note"
      style={{ background: note.color }}
      role="button"
      tabIndex={0}
      aria-label={`Otwórz notatkę: ${note.title}`}
      onClick={open}
      onKeyDown={onCardKeyDown} 
    >
      <div className="noteHeader">
        <div className="noteTitle">{note.title}</div>
      </div>

      <div className="noteDivider" />

      {note.tags?.length > 0 && (
        <div className="noteTags">
          {note.tags.map((t) => (
            <span key={t} className="noteTag">
              {t}
            </span>
          ))}
        </div>
      )}

      <div ref={bodyRef} className="noteBody">
        <NoteContent
          text={note.content}
          mode={note.contentMode || "text"}
          enableCopy={false}
        />
      </div>

      <div className="noteFooter">
        <span className="noteDate">
          {new Date(note.createdAt).toLocaleDateString("pl-PL")}
        </span>

        {isOverflowing && (
          <div className="noteMoreIcon" title="Notatka zawiera więcej treści">
            ⋯
          </div>
        )}
      </div>

      {/* ✅ overlay nie odpala clicka karty */}
      <div className="noteOverlay">
        <button
          type="button"
          className="overlayBtn btnSlide"
          onClick={(e) => {
            e.stopPropagation();     // ✅ nie otwieraj notatki
            onView(note);
          }}
        >
          👁 Przeglądaj notatkę
        </button>

        <button
          type="button"
          className="overlayBtn btnSlide"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(note);
          }}
        >
          ✏️ Edytuj notatkę
        </button>

        <button
          type="button"
          className="overlayBtn danger btnSlide"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note);
          }}
        >
          🗑 Usuń notatkę
        </button>
      </div>
    </article>
  );
}
