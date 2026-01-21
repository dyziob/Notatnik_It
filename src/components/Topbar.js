import React, { useEffect, useRef, useState } from "react";
import ProfileModal from "./modals/ProfileModal";
import SettingsModal from "./modals/SettingsModal";

export default function Topbar({ query, setQuery, profileStats, onOpenSettings }) {
  const [openMenu, setOpenMenu] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);


  const menuRef = useRef(null);

  const username = localStorage.getItem("authUser");

  useEffect(() => {
    const onDocClick = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpenMenu(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpenMenu(false);
        setOpenProfile(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="topbar">
        <div className="brand">Notatnik IT</div>

        <div className="topbar-search">
          <input
            className="topbar-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Wyszukaj notatkę po słowie bądź tagu"
          />
        </div>

        {/* USER */}
        <div className="topbar-user" ref={menuRef}>
          <button
            type="button"
            className={"userBtn" + (openMenu ? " open" : "")}
            onClick={() => setOpenMenu((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={openMenu}
            title="Menu użytkownika"
          >
            <svg className="userIcon" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 12c2.76 0 5-2.46 5-5.5S14.76 1 12 1 7 3.46 7 6.5 9.24 12 12 12Zm0 2c-4.42 0-8 2.24-8 5v2h16v-2c0-2.76-3.58-5-8-5Z"
              />
            </svg>
          </button>

          {openMenu && (
            <div className="userMenu" role="menu">
              <button
                type="button"
                className="userMenuItem"
                role="menuitem"
                onClick={() => {
                  setOpenMenu(false);
                  setOpenProfile(true);
                }}
              >
                Profil
              </button>

              {/* ustawienia dodamy w kolejnym kroku */}
              <div className="userMenuDivider" />

              <button
                type="button"
                className="userMenuItem"
                role="menuitem"
                onClick={() => {
                  setOpenMenu(false);
                  onOpenSettings?.();
                }}
              >
                Ustawienia
              </button>


              <div className="userMenuDivider" />

              <button
                type="button"
                className="userMenuItem danger"
                role="menuitem"
                onClick={() => {
                  setOpenMenu(false);
                  localStorage.removeItem("authUser");
                  window.location.hash = "#/"; // HashRouter
                }}
              >
                Wyloguj
              </button>
            </div>
          )}
        </div>
      </header>

      <ProfileModal
        open={openProfile}
        onClose={() => setOpenProfile(false)}
        username={username}
        stats={profileStats}
      />

      <SettingsModal
        open={openSettings}
        onClose={() => setOpenSettings(false)}
        onApply={(settings) => {
        }}
      />

    </>
  );
}
