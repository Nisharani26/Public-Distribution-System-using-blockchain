import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import AuthorityDashboard from './pages/AuthorityDashboard';
import AuthorityUsers from './pages/AuthorityUsers';
import AuthorityShops from './pages/AuthorityShops';
import AuthorityRequests from './pages/AuthorityRequests';
import AuthorityAudit from './pages/AuthorityAudit';
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
        <Route path="/authority/users" element={<AuthorityUsers />} />
        <Route path="/authority/shops" element={<AuthorityShops />} />
        <Route path="/authority/requests" element={<AuthorityRequests />} />
        <Route path="/authority/audit" element={<AuthorityAudit />} />
      </Routes>
    </BrowserRouter>
  );
}
