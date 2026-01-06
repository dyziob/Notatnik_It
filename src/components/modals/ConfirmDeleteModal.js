import React from "react";

export default function ConfirmDeleteModal({ note, onCancel, onConfirm }) {
  if (!note) return null;

  return (
    <div className="modalBackdrop" onClick={onCancel}>
      <div className="confirmModal" onClick={(e) => e.stopPropagation()}>
        <button className="confirmClose" onClick={onCancel} aria-label="Zamknij">
          ×
        </button>

        <div className="confirmIconWrap">
          <div className="confirmIcon">🗑</div>
        </div>

        <div className="confirmTitle">Czy jesteś pewien?</div>
        <div className="confirmText">
          Czy na pewno chcesz usunąć notatkę?
          <br />
          Tego procesu nie da się odwrócić.
        </div>

        <div className="confirmActions">
          <button className="confirmCancel" onClick={onCancel}>
            Anuluj
          </button>
          <button className="confirmDelete" onClick={() => onConfirm(note)}>
            Tak, Usuń
          </button>
        </div>
      </div>
    </div>
  );
}
