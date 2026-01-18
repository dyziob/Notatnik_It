import React, { useState } from 'react';
import '../css/LoginPage.css';
import { Link, useNavigate } from 'react-router-dom';
import "highlight.js/styles/github.css";

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
  e.preventDefault();

  if (username && password) {
    localStorage.setItem("authUser", username); // ⬅️ KLUCZOWE
    navigate("/main");
  } else {
    alert("Proszę podać nazwę użytkownika i hasło.");
  }
};

  return (
    <div id='LoginId'>
      <div className="login-container">
        <div className="login-form-container login-animation">
            <div className="login-site">
              <h1>Logowanie</h1>
              <form className="login-form" onSubmit={handleLogin}>
                <div>
                  <label className="login-label">Nazwa użytkownika</label> <br/>
                  <input
                    className="login-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <label className="login-label">Hasło</label> <br/>
                  <input
                    className="login-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button className="login-button" type="submit">Zaloguj</button>
              </form>
              <p>Nie masz jeszcze konta? <Link className={'link-style'} to="/register">Zarejestruj się</Link></p>
            </div>
        </div>
        <div className="login-image-container login-animation">
          <img src={require("../img/logo.png")} alt="Portfolio" />
          <h1>Notatnik It -<br></br>twoje miejsce na notatki!</h1>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;