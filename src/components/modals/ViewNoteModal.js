import React from "react";
import NoteContent from "../NoteContent";

export default function ViewNoteModal({ note, onClose }) {
  if (!note) return null;

  return (
    <div className="modalBackdrop" onClick={onClose}>
      <div
        className="modal modal--large"
        onClick={(e) => e.stopPropagation()}
      >
        {/* przycisk X */}
        <button
          className="modalX"
          onClick={onClose}
          aria-label="Zamknij"
        >
          ×
        </button>

        <div className="modalHeader">
          <div className="modalTitle">{note.title}</div>

          <div className="modalTags">
            {note.tags?.map((t) => (
              <span key={t} className="noteTag">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="modalBody modalBody--large">
          <NoteContent
            text={note.content}
            mode={note.contentMode || "text"}
            enableCopy={true}
          />
        </div>
      </div>
    </div>
  );
}
