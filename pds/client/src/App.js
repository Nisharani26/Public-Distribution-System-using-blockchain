import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import AuthorityDashboard from './pages/AuthorityDashboard';

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage onLogin={(loggedInUser) => setUser(loggedInUser)} />} />
        <Route path="/authority/dashboard" element={<AuthorityDashboard user={user} onLogout={() => setUser(null)} />} />
      </Routes>
    </BrowserRouter>
  );
}
