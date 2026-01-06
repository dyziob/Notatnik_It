import React from "react";
import NoteCard from "./NoteCard";

export default function NotesGrid({ notes, onView, onEdit, onDelete }) {
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
          />
        ))}
      </div>
    </main>
  );
}
