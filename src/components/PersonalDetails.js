import React, { useState } from 'react';
import './css/Registration.css';
import './css/LoginPage.css';
import { Link } from 'react-router-dom';

function RegistrationPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [registered, setRegistered] = useState(false);

  const handleRegistration = (event) => {
    event.preventDefault();
    if (username && password && password === confirmPassword && firstName && lastName && email && selectedTags.length > 0) {
      // Tutaj można dodać logikę rejestracji użytkownika
      // Na potrzeby tego przykładu przyjmujemy, że użytkownik zostanie zarejestrowany, jeśli poda nazwę użytkownika, hasło, imię, nazwisko, email, wybierze co najmniej jeden tag oraz potwierdzi hasło
      setRegistered(true);
      alert('Zarejestrowano pomyślnie!');
    } else {
      alert('Proszę podać wszystkie wymagane dane poprawnie.');
    }
  };

  const tags = ['JavaScript', 'Python', 'Java', 'C#', 'C++', 'PHP', 'Swift', 'TypeScript', 'Ruby', 'Go', 'Kotlin', 'Rust', 'MATLAB', 'R', 'Perl', 'Objective-C', 'Scala', 'Shell', 'SQL', 'HTML/CSS', 'React', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Angular', 'Vue.js', 'MongoDB', 'MySQL', 'PostgreSQL', 'Firebase', 'AWS', 'Azure', 'Docker', 'Kubernetes', 'Git', 'Jenkins'];

  return (
    <div id='unique-container3'>
      <div className=".details-container">
        {registered ? (
          <div className="registration-success">
            <h2>Rejestracja zakończona pomyślnie!</h2>
            <p>Możesz teraz przejść do strony logowania.</p>
            <p><Link className={'link-style-register'} to="/"> Zaloguj się</Link></p>
          </div>
        ) : (
          <div className="registration-form login-animation">
            <h2>Dodatkowe dane do PORTFOLIO</h2>
            <form onSubmit={handleRegistration}>
              <div className="form-group">
                <label>Data Urodzenia</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Zainteresowania</label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Języki</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Wykształcenie</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Doświadczenie zawodowe</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Wybierz umiejętności</label>
                <select
                  multiple
                  size="10"
                  value={selectedTags}
                  onChange={(e) => setSelectedTags(Array.from(e.target.selectedOptions, option => option.value))}
                >
                  {tags.map((tag, index) => (
                    <option key={index} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>
              <div className="selected-tags">
                {selectedTags.map((tag, index) => (
                  <div key={index} className="tag">{tag}</div>
                ))}
              </div>
              <button type="submit" className='register-button'>Zatwierdź</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default RegistrationPage;
