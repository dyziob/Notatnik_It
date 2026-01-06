import './App.css';
import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/index';
import RegistrationPage from './pages/RegistrationPage';
import Main from './pages/main';
import PersonalDetails from './pages/PersonalDetails';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path='/register' element={<RegistrationPage />} />
          <Route path='/main' element={<Main />} />
          <Route path='/personalDetails' element={<PersonalDetails />} />
        </Routes>
    </Router>
  );
}

export default App;
