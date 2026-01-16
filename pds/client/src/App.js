import React, { useState } from 'react';
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
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null);
    console.log("Logged out");
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Login page */}
        <Route
          path="/"
          element={<LoginPage onLogin={(loggedInUser) => setUser(loggedInUser)} />}
        />

        {/* Authority pages */}
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

        {/* Catch-all: redirect unknown routes to dashboard if logged in, otherwise login */}
        <Route
          path="*"
          element={user ? <Navigate to="/authority/dashboard" replace /> : <Navigate to="/" replace />}
        />
        <Route
          path="/citizen/dashboard"
          element={<CitizenDashboard user={user} onLogout={handleLogout} />}
        />
        <Route
          path="/citizen/profile"
          element={<CitizenProfile user={user} onLogout={handleLogout} />}
        />
        <Route
          path="/citizen/transactions"
          element={<CitizenTransactionHistory user={user} onLogout={handleLogout} />}
        />
        {/* Catch-all: redirect unknown routes for citizen */}
        <Route
          path="*"
          element={user ? <Navigate to="/citizen/dashboard" replace /> : <Navigate to="/" replace />}
        />

      </Routes>

    </BrowserRouter>
  );
}
