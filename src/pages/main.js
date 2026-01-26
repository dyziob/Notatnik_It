import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import SettingsModal from "../components/modals/SettingsModal";

import "../css/00-fonts.css";
import "../css/10-app-layout.css";
import "../css/20-sidebar.css";
import "../css/30-board-notes.css";
import "../css/40-note-card.css";
import "../css/50-modals.css";
import "../css/60-confirm-modal.css";
import "../css/70-segmented.css";
import "../css/80-codeblocks.css";

import Topbar from "../components/Topbar";
import SidebarForm from "../components/SidebarForm";
import NotesGrid from "../components/NotesGrid";

import ViewNoteModal from "../components/modals/ViewNoteModal";
import EditNoteModal from "../components/modals/EditNoteModal";
import ConfirmDeleteModal from "../components/modals/ConfirmDeleteModal";

import "highlight.js/styles/github.css";
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
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [openSettings, setOpenSettings] = useState(false);

  // ===== USER / KEYS =====
  const user = localStorage.getItem("authUser");
  const storageKey = user ? `notes_${user}` : "notes_guest";
  const settingsKey = user ? `settings_${user}` : "settings_guest";

  // ===== SETTINGS (theme + noteSize) =====
  const [appSettings, setAppSettings] = useState(() => {
    try {
      const raw = localStorage.getItem(settingsKey);
      const parsed = raw ? JSON.parse(raw) : null;
      return {
        theme: parsed?.theme === "dark" ? "dark" : "light",
        noteSize: ["sm", "md", "lg"].includes(parsed?.noteSize) ? parsed.noteSize : "md",
      };
    } catch {
      return { theme: "light", noteSize: "md" };
    }
  });

  // ===== MOBILE DETECTION + MOBILE SIDEBAR =====
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    const apply = () => setIsMobile(mq.matches);

    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  // jeśli przestajesz być mobile, zamknij sheet
  useEffect(() => {
    if (!isMobile) setMobileSidebarOpen(false);
  }, [isMobile]);

  // ===== NOTES =====
  const [notes, setNotes] = useLocalStorageNotes(storageKey);

  // ===== MODALS =====
  const [openNote, setOpenNote] = useState(null);
  const [editNote, setEditNote] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ===== LOGOUT =====
  const handleLogout = () => {
    localStorage.removeItem("authUser");
    setQuery("");
    navigate("/", { replace: true });
  };

  // ===== FILTER =====
  const filteredNotes = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;

    return notes.filter((n) => {
      const inTitle = (n.title || "").toLowerCase().includes(q);
      const inContent = (n.content || "").toLowerCase().includes(q);
      const inTags = (n.tags || []).some((t) => (t || "").toLowerCase().includes(q));
      return inTitle || inContent || inTags;
    });
  }, [notes, query]);

  // ===== PROFILE STATS (do Topbar) =====
  const profileStats = useMemo(() => {
    const notesCount = notes.length;

    const uniqueTags = new Set();
    let codeCount = 0;
    let lastCreatedAt = null;

    for (const n of notes) {
      (n.tags || []).forEach((t) => uniqueTags.add(t));
      if (n.contentMode === "code") codeCount++;

      if (n.createdAt) {
        const d = new Date(n.createdAt);
        if (!lastCreatedAt || d > lastCreatedAt) lastCreatedAt = d;
      }
    }

    return {
      notesCount,
      tagsCount: uniqueTags.size,
      codeCount,
      lastNoteDate: lastCreatedAt ? lastCreatedAt.toISOString() : null,
    };
  }, [notes]);

  // ===== CRUD =====
  const handleAddNote = ({ title, content, tags, color, contentMode }) => {
    const now = new Date();
    const newNote = {
      id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
      title,
      content,
      tags: Array.isArray(tags) ? tags : [],
      color,
      contentMode: contentMode || "auto", // "text" | "auto" | "code"
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

  // ✅ FAB ma się ukrywać, gdy jakikolwiek overlay jest otwarty
  const isAnyOverlayOpen =
    mobileSidebarOpen ||
    !!openNote ||
    !!editNote ||
    !!deleteTarget ||
    openSettings;

  return (
    <div id="MainApp" className={`theme-${appSettings.theme} notes-${appSettings.noteSize}`}>
      <Topbar
        query={query}
        setQuery={setQuery}
        profileStats={profileStats}
        onOpenSettings={() => setOpenSettings(true)}
        onLogout={handleLogout}
      />

      <div className="layout">
        {/* ✅ DESKTOP: normalny sidebar */}
        {!isMobile && (
          <SidebarForm
            defaultTags={DEFAULT_TAGS}
            noteColors={NOTE_COLORS}
            onAddNote={handleAddNote}
          />
        )}

        <NotesGrid
          notes={filteredNotes}
          onView={(note) => setOpenNote(note)}
          onEdit={(note) => setEditNote(note)}
          onDelete={(note) => requestDelete(note)}
          isMobile={isMobile}
        />
      </div>

      {/* ✅ MOBILE: FAB + bottom sheet z SidebarForm */}
      {isMobile && (
        <>
          <button
            className={"fabAdd" + (isAnyOverlayOpen ? " hidden" : "")}
            type="button"
            aria-label="Dodaj notatkę"
            onClick={() => setMobileSidebarOpen(true)}
          >
            +
          </button>

          {mobileSidebarOpen && (
            <div className="sheetBackdrop" onClick={() => setMobileSidebarOpen(false)}>
              <div className="sheet" onClick={(e) => e.stopPropagation()}>
                <div className="sheetHeader">
                  <div className="sheetTitle">Dodaj notatkę</div>
                  <button
                    className="sheetClose"
                    onClick={() => setMobileSidebarOpen(false)}
                    aria-label="Zamknij"
                  >
                    ×
                  </button>
                </div>

                <SidebarForm
                  defaultTags={DEFAULT_TAGS}
                  noteColors={NOTE_COLORS}
                  onAddNote={(data) => {
                    handleAddNote(data);
                    setMobileSidebarOpen(false); // ✅ po dodaniu zamknij
                  }}
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* Modale notatek */}
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

      {/* Settings */}
      <SettingsModal
        open={openSettings}
        onClose={() => setOpenSettings(false)}
        onApply={(settings) => {
          setAppSettings(settings);
          localStorage.setItem(settingsKey, JSON.stringify(settings));
        }}
      />
    </div>
  );
}
