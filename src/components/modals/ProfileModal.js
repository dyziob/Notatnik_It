import React, { useMemo } from "react";

function getInitial(name) {
  const t = (name || "").trim();
  return t ? t[0].toUpperCase() : "?";
}

function fmtDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("pl-PL");
  } catch {
    return "—";
  }
}

export default function ProfileModal({ open, onClose, username, stats }) {
  // ✅ HOOKI NA SAMEJ GÓRZE
  const initial = useMemo(() => getInitial(username), [username]);

  // ⬇️ dopiero TERAZ warunek renderu
  if (!open) return null;

  return (
    <div className="modalBackdrop" onClick={onClose}>
      <div
        className="modal modal--large profileModal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modalX" onClick={onClose} aria-label="Zamknij">
          ×
        </button>

        <div className="modalHeader">
          <div className="modalTitle">Profil</div>
        </div>

        <div className="modalBody modalBody--large">
          <div className="profileHeader">
            <div className="profileAvatar">{initial}</div>

            <div className="profileInfo">
              <div className="profileName">{username || "Gość"}</div>
              <div className="profileSub">Notatnik It</div>
            </div>
          </div>

          <div className="profileSection">
            <div className="profileSectionTitle">Statystyki</div>

            <div className="profileStatsGrid">
              <div className="profileStat">
                <div className="profileStatLabel">Notatki</div>
                <div className="profileStatValue">{stats?.notesCount ?? 0}</div>
              </div>

              <div className="profileStat">
                <div className="profileStatLabel">Tagi</div>
                <div className="profileStatValue">{stats?.tagsCount ?? 0}</div>
              </div>

              <div className="profileStat">
                <div className="profileStatLabel">Kod</div>
                <div className="profileStatValue">{stats?.codeCount ?? 0}</div>
              </div>

              <div className="profileStat">
                <div className="profileStatLabel">Ostatnia notatka</div>
                <div className="profileStatValue">
                  {fmtDate(stats?.lastNoteDate)}
                </div>
              </div>
            </div>
          </div>

          <div className="profileSection">
            <div className="profileSectionTitle">Konto</div>

            <div className="profileRow">
              <span className="profileRowLabel">Użytkownik</span>
              <span className="profileRowValue">{username || "guest"}</span>
            </div>

            <div className="profileRow">
              <span className="profileRowLabel">Klucz zapisu</span>
              <span className="profileRowValue">
                {username ? `notes_${username}` : "notes_guest"}
              </span>
            </div>
          </div>
        </div>

        <div className="modalActions modalActions--sticky">
          <button className="modalClose btnSlide" onClick={onClose}>
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
}
