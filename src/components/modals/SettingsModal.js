import React, { useEffect, useMemo, useState } from "react";

function storageKeyForUser(user) {
  return user ? `settings_${user}` : "settings_guest";
}

export default function SettingsModal({ open, onClose, onApply }) {
  const username = localStorage.getItem("authUser");
  const key = useMemo(() => storageKeyForUser(username), [username]);

  const [theme, setTheme] = useState("light"); // "light" | "dark"
  const [noteSize, setNoteSize] = useState("md"); // "sm" | "md" | "lg"

  // wczytaj ustawienia
  useEffect(() => {
    if (!open) return;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return;
      const parsed = JSON.parse(raw);

      if (parsed?.theme === "dark" || parsed?.theme === "light") setTheme(parsed.theme);
      if (["sm", "md", "lg"].includes(parsed?.noteSize)) setNoteSize(parsed.noteSize);
    } catch {}
  }, [open, key]);

  const save = () => {
    const payload = { theme, noteSize };
    localStorage.setItem(key, JSON.stringify(payload));
    onApply?.(payload);
    onClose();
  };

  // hooki zawsze na górze — ok
  if (!open) return null;

  return (
    <div className="modalBackdrop" onClick={onClose}>
      <div className="modal modal--large settingsModal" onClick={(e) => e.stopPropagation()}>
        <button className="modalX" onClick={onClose} aria-label="Zamknij">
          ×
        </button>

        <div className="modalHeader">
          <div className="modalTitle">Ustawienia</div>
        </div>

        <div className="modalBody modalBody--large">
          {/* THEME */}
          <div className="settingsSection">
            <div className="settingsSectionTitle">Wygląd</div>

            <div className="settingsRow">
              <div className="settingsRowLeft">
                <div className="settingsLabel">Tryb ciemny</div>
                <div className="settingsHint">Zmień wygląd aplikacji na ciemny.</div>
              </div>

              <button
                type="button"
                className={"toggle" + (theme === "dark" ? " on" : "")}
                onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
                aria-pressed={theme === "dark"}
              >
                <span className="toggleKnob" />
              </button>
            </div>
          </div>

          {/* NOTE SIZE */}
          <div className="settingsSection">
            <div className="settingsSectionTitle">Notatki</div>

            <div className="settingsRow">
              <div className="settingsRowLeft">
                <div className="settingsLabel">Rozmiar notatek</div>
                <div className="settingsHint">Wpływa na wielkość kafelków na tablicy.</div>
              </div>

              <div
                className="segmented2 segmented2--sm"
                style={{
                    "--seg-count": 3,
                    "--seg-index": noteSize === "sm" ? 0 : noteSize === "md" ? 1 : 2,
                }}
                >
                <div className="segIndicator2" aria-hidden="true" />

                <button
                    type="button"
                    className={"segBtn2" + (noteSize === "sm" ? " active" : "")}
                    onClick={() => setNoteSize("sm")}
                >
                    Małe
                </button>

                <button
                    type="button"
                    className={"segBtn2" + (noteSize === "md" ? " active" : "")}
                    onClick={() => setNoteSize("md")}
                >
                    Średnie
                </button>

                <button
                    type="button"
                    className={"segBtn2" + (noteSize === "lg" ? " active" : "")}
                    onClick={() => setNoteSize("lg")}
                >
                    Duże
                </button>
                </div>

            </div>

            <div className="settingsPreviewHint">
              Podgląd: rozmiar zmieni się po kliknięciu „Zapisz”.
            </div>
          </div>
        </div>

        <div className="modalActions modalActions--sticky">
          <button className="modalClose btnSlide" onClick={onClose}>
            Anuluj
          </button>
          <button className="modalSave btnSlide" onClick={save}>
            Zapisz
          </button>
        </div>
      </div>
    </div>
  );
}
