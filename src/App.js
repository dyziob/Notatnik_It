import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import Main from './components/main';
import PersonalDetails from './components/PersonalDetails';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path='/register' element={<RegistrationPage />} />
          <Route path='/main' element={<Main />} />
          <Route path='/personalDetails' element={<PersonalDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
