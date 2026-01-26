import React from "react";
import NoteCard from "./NoteCard";

export default function NotesGrid({ notes, onView, onEdit, onDelete, isMobile, }) {
  return (
    <main className="board">
      <div className="notesGrid">
        {notes.map((n) => (
          <NoteCard
            key={n.id}
            note={n}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            isMobile={isMobile}
          />
        ))}
      </div>
    </main>
  );
}
