import React from "react";

export default function Topbar({ query, setQuery }) {
  return (
    <header className="topbar">
      <div className="brand">Notatnik It</div>

      <div className="topbar-search">
        <input
          className="topbar-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Wyszukaj notatkę po słowie bądź tagu"
        />
      </div>

      <div className="topbar-user" title="Profil">
        <div className="user-circle" />
      </div>
    </header>
  );
}
