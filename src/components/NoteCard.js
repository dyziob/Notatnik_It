import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import NoteContent from "./NoteContent";


export default function NoteCard({ note, onView, onEdit, onDelete }) {
  const bodyRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const measure = () => {
    const el = bodyRef.current;
    if (!el) return;
    const overflowing =
      el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1;
    setIsOverflowing(overflowing);
  };

  useLayoutEffect(() => {
    measure();
    const t = setTimeout(measure, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note.title, note.content, note.tags?.join(","), note.color]);

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

  return (
    <article className="note" style={{ background: note.color }}>
      <div className="noteHeader">
        <div className="noteTitle">{note.title}</div>
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
        <div className="noteMoreIcon" title="Notatka zawiera więcej treści">
          ⋯
        </div>
      )}
      </div>

      <div className="noteOverlay">
        <button type="button" className="overlayBtn btnSlide" onClick={() => onView(note)}>
          👁 Przeglądaj notatkę
        </button>

        <button type="button" className="overlayBtn btnSlide" onClick={() => onEdit(note)}>
          ✏️ Edytuj notatkę
        </button>

        <button type="button" className="overlayBtn danger btnSlide" onClick={() => onDelete(note)}>
          🗑 Usuń notatkę
        </button>
      </div>
    </article>
  );
}
