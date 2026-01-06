import React, { useEffect, useState } from "react";

export default function EditNoteModal({ note, onClose, onSave }) {
  const [draft, setDraft] = useState(null);

  // gdy przychodzi nowa notatka do edycji, kopiujemy ją do draft
  useEffect(() => {
    if (note) {
      setDraft(note);
    } else {
      setDraft(null);
    }
  }, [note]);

  // jeśli note lub draft jeszcze nie są gotowe — nic nie renderuj
  if (!note || !draft) return null;

  return (
    <div className="modalBackdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modalTitle">Edytuj: {draft.title}</div>

        <label className="field">
          <div className="label">Tytuł</div>
          <input
            className="input"
            value={draft.title}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, title: e.target.value }))
            }
          />
        </label>

        <label className="field">
          <div className="label">Treść</div>
          <textarea
            className="textarea"
            value={draft.content}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, content: e.target.value }))
            }
          />
        </label>

        <div className="modalActions">
          <button className="modalClose" onClick={onClose}>
            Anuluj
          </button>
          <button className="modalSave" onClick={() => onSave(draft)}>
            Zapisz
          </button>
        </div>
      </div>
    </div>
  );
}