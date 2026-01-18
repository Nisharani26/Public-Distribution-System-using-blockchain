import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import AuthorityDashboard from './pages/AuthorityDashboard';
import AuthorityUsers from './pages/AuthorityUsers';
import AuthorityShops from './pages/AuthorityShops';
import AuthorityRequests from './pages/AuthorityRequests';
import AuthorityAudit from './pages/AuthorityAudit';
import CitizenDashboard from './pages/CitizenDashboard';
import CitizenProfile from './pages/CitizenProfile';
import CitizenTransactionHistory from './pages/CitizenTransactionHistory';

export default function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("citizen");
    return stored ? JSON.parse(stored) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("citizen");
    setUser(null);
    console.log("Logged out");
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN ROUTE (auto-redirect if already logged in) */}
        <Route
          path="/"
          element={
            user
              ? <Navigate to="/citizen/dashboard" replace />
              : <LoginPage onLogin={(loggedInUser) => setUser(loggedInUser)} />
          }
        />

        {/* AUTHORITY ROUTES */}
        <Route
          path="/authority/dashboard"
          element={<AuthorityDashboard user={user} onLogout={handleLogout} />}
        />
        <Route
          path="/authority/users"
          element={<AuthorityUsers user={user} onLogout={handleLogout} />}
        />
        <Route
          path="/authority/shops"
          element={<AuthorityShops user={user} onLogout={handleLogout} />}
        />
        <Route
          path="/authority/requests"
          element={<AuthorityRequests user={user} onLogout={handleLogout} />}
        />
        <Route
          path="/authority/audit"
          element={<AuthorityAudit user={user} onLogout={handleLogout} />}
        />

        {/* CITIZEN ROUTES */}
        <Route
          path="/citizen/dashboard"
          element={
            localStorage.getItem("token")
              ? <CitizenDashboard user={user} onLogout={handleLogout} />
              : <Navigate to="/" replace />
          }
        />

        <Route
          path="/citizen/profile"
          element={<CitizenProfile user={user} onLogout={handleLogout} />}
        />

        <Route
          path="/citizen/transactions"
          element={<CitizenTransactionHistory user={user} onLogout={handleLogout} />}
        />

        {/* SINGLE catch-all (VERY IMPORTANT) */}
        <Route
          path="*"
          element={
            localStorage.getItem("token")
              ? <Navigate to="/citizen/dashboard" replace />
              : <Navigate to="/" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
