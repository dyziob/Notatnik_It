import React, { useMemo, useState } from "react";
import "../css/Main.css";

import Topbar from "../components/Topbar";
import SidebarForm from "../components/SidebarForm";
import NotesGrid from "../components/NotesGrid";

import ViewNoteModal from "../components/modals/ViewNoteModal";
import EditNoteModal from "../components/modals/EditNoteModal";
import ConfirmDeleteModal from "../components/modals/ConfirmDeleteModal";

import { useLocalStorageNotes } from "../hooks/useLocalStorageNotes";

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

export default function Main() {
  const [query, setQuery] = useState("");

  const user = localStorage.getItem("authUser");
  const storageKey = user ? `notes_${user}` : "notes_guest";

  const [notes, setNotes] = useLocalStorageNotes(storageKey);

  const [openNote, setOpenNote] = useState(null);
  const [editNote, setEditNote] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

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

  const handleAddNote = ({ title, content, tags, color }) => {
    const now = new Date();
    const newNote = {
      id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
      title,
      content,
      tags,
      color,
      createdAt: now.toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const requestDelete = (note) => setDeleteTarget(note);

  const confirmDelete = (note) => {
    setNotes((prev) => prev.filter((n) => n.id !== note.id));
    setDeleteTarget(null);
  };

  const saveEdit = (draft) => {
    setNotes((prev) => prev.map((n) => (n.id === draft.id ? { ...n, ...draft } : n)));
    setEditNote(null);
  };

  return (
    <div id="MainApp">
      <Topbar query={query} setQuery={setQuery} />

      <div className="layout">
        <SidebarForm
          defaultTags={DEFAULT_TAGS}
          noteColors={NOTE_COLORS}
          onAddNote={handleAddNote}
        />

        <NotesGrid
          notes={filteredNotes}
          onView={(note) => setOpenNote(note)}
          onEdit={(note) => setEditNote(note)}
          onDelete={(note) => requestDelete(note)}
        />
      </div>

      <ViewNoteModal note={openNote} onClose={() => setOpenNote(null)} />

      <EditNoteModal
        note={editNote}
        onClose={() => setEditNote(null)}
        onSave={saveEdit}
      />

      <ConfirmDeleteModal
        note={deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
