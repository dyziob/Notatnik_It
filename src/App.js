import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import LoginPage from './components/index';
import RegistrationPage from './components/RegistrationPage';
import Main from './components/main';
import PersonalDetails from './components/PersonalDetails';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path='/register' element={<RegistrationPage />} />
          <Route path='/main' element={<Main />} />
          <Route path='/personalDetails' element={<PersonalDetails />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
