import React from "react";

export default function ViewNoteModal({ note, onClose }) {
  if (!note) return null;

  return (
    <div className="modalBackdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modalTitle">{note.title}</div>
        <div className="modalTags">
          {note.tags?.map((t) => (
            <span key={t} className="noteTag">
              {t}
            </span>
          ))}
        </div>
        <div className="modalBody">{note.content}</div>
        <button className="modalClose" onClick={onClose}>
          Zamknij
        </button>
      </div>
    </div>
  );
}
