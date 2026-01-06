import React, { useState } from 'react';
import '../css/Registration.css';
import '../css/LoginPage.css';
import { Link } from 'react-router-dom';

function RegistrationPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [registered, setRegistered] = useState(false);

  const handleRegistration = (event) => {
    event.preventDefault();
    if (username && password && password === confirmPassword && firstName && lastName && email) {
      // Tutaj można dodać logikę rejestracji użytkownika
      // Na potrzeby tego przykładu przyjmujemy, że użytkownik zostanie zarejestrowany, jeśli poda nazwę użytkownika, hasło, imię, nazwisko, email oraz potwierdzi hasło
      setRegistered(true);
      alert('Zarejestrowano pomyślnie!');
    } else {
      alert('Proszę podać wszystkie wymagane dane poprawnie.');
    }
  };

  return (
    <div id='unique-container'>
    <div className="registration-container">
      {registered ? (
        <div className="registration-success">
          <h2>Rejestracja zakończona pomyślnie!</h2>
          <p>Możesz teraz przejść do strony logowania.</p>
          <p><Link className={'link-style-register'} to="/"> Zaloguj się</Link></p>
        </div>
      ) : (
        <div className="registration-form login-animation">
          <h2>Rejestracja</h2>
          <form onSubmit={handleRegistration}>
            <div className="form-group">
              <label>Imię</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Nazwisko</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Nazwa użytkownika</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Hasło</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Potwierdź hasło</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button type="submit" className='register-button'>Zarejestruj Się</button>
            <p>Masz już konto?<Link className={'link-style-register'} to="/"> Zaloguj się</Link></p>
          </form>
        </div>
      )}
    </div>
    </div>
  );
}


export default RegistrationPage;
