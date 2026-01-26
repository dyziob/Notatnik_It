import React, { useEffect, useRef, useState } from "react";
import ProfileModal from "./modals/ProfileModal";

export default function Topbar({ query, setQuery, profileStats, onOpenSettings, onLogout }) {
  const [openUserMenu, setOpenUserMenu] = useState(false);   // desktop user menu
  const [openProfile, setOpenProfile] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false); // ✅ mobile dropdown

  const menuRef = useRef(null);
  const username = localStorage.getItem("authUser");

  useEffect(() => {
    const onDocClick = (e) => {
      // zamknij desktop menu po kliknięciu poza
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenUserMenu(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpenUserMenu(false);
        setOpenProfile(false);
        setMobileExpanded(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="topbarShell">
        {/* ===== DESKTOP (zostaje jak było) ===== */}
        <div className="topbar desktopTopbar">
          <div className="brand">Notatnik IT</div>

          <div className="topbar-search">
            <input
              className="topbar-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Wyszukaj notatkę po słowie bądź tagu"
            />
          </div>

          <div className="topbar-user" ref={menuRef}>
            <button
              type="button"
              className={"userBtn" + (openUserMenu ? " open" : "")}
              onClick={() => setOpenUserMenu((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={openUserMenu}
              title="Menu użytkownika"
            >
              <svg className="userIcon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 12c2.76 0 5-2.46 5-5.5S14.76 1 12 1 7 3.46 7 6.5 9.24 12 12 12Zm0 2c-4.42 0-8 2.24-8 5v2h16v-2c0-2.76-3.58-5-8-5Z"
                />
              </svg>
            </button>

            {openUserMenu && (
              <div className="userMenu" role="menu">
                <button
                  type="button"
                  className="userMenuItem"
                  role="menuitem"
                  onClick={() => {
                    setOpenUserMenu(false);
                    setOpenProfile(true);
                  }}
                >
                  Profil
                </button>

                <div className="userMenuDivider" />

                <button
                  type="button"
                  className="userMenuItem"
                  role="menuitem"
                  onClick={() => {
                    setOpenUserMenu(false);
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
                    setOpenUserMenu(false);
                    onLogout?.();
                  }}
                >
                  Wyloguj
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ===== MOBILE (jak na screenie: rozwijane) ===== */}
        <div className="mobileTopbar">
          {/* pasek 1: tytuł + strzałka */}
          <button
            type="button"
            className="mobileTopbarHeader"
            onClick={() => setMobileExpanded((v) => !v)}
            aria-expanded={mobileExpanded}
            aria-label="Rozwiń pasek górny"
          >
            <span className="mobileBrand">Notatnik IT</span>
            <span className={"mobileCaret" + (mobileExpanded ? " up" : "")}>˅</span>
          </button>

          {/* rozwijany panel */}
          <div className={"mobileTopbarPanel" + (mobileExpanded ? " open" : "")}>
            <button
              type="button"
              className="mobileProfileRow"
              onClick={() => {
                setMobileExpanded(false);
                setOpenProfile(true);
              }}
            >
              <span>Profil</span>
              <svg className="profileIcon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 12c2.76 0 5-2.46 5-5.5S14.76 1 12 1 7 3.46 7 6.5 9.24 12 12 12Zm0 2c-4.42 0-8 2.24-8 5v2h16v-2c0-2.76-3.58-5-8-5Z"
                />
              </svg>
            </button>

            <div className="mobileSearchRow">
              <div className="mobileSearchPill">
                <input
                  className="mobileSearchInput"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Wyszukaj notatkę"
                />
                <span className="mobileSearchIcon" aria-hidden="true">🔍</span>
              </div>
            </div>

            <div className="mobileActions">
              <button
                type="button"
                className="mobileActionBtn"
                onClick={() => {
                  setMobileExpanded(false);
                  onOpenSettings?.();
                }}
              >
                Ustawienia
              </button>
              <button
                type="button"
                className="mobileActionBtn danger"
                onClick={() => {
                  setMobileExpanded(false);
                  onLogout?.();
                }}
              >
                Wyloguj
              </button>
            </div>
          </div>
        </div>
      </header>

      <ProfileModal
        open={openProfile}
        onClose={() => setOpenProfile(false)}
        username={username}
        stats={profileStats}
      />
    </>
  );
}
