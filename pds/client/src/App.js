import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

// Authority pages
import AuthorityDashboard from "./pages/AuthorityDashboard";
import AuthorityUsers from "./pages/AuthorityUsers";
import AuthorityShops from "./pages/AuthorityShops";
import AuthorityRequests from "./pages/AuthorityRequests";
import AuthorityAudit from "./pages/AuthorityAudit";

// Citizen pages
import CitizenDashboard from "./pages/CitizenDashboard";
import CitizenProfile from "./pages/CitizenProfile";
import CitizenTransactionHistory from "./pages/CitizenTransactionHistory";

// Shopkeeper pages
import ShopkeeperDashboard from "./pages/ShopkeeperDashboard";
import ShopkeeperProfile from "./pages/ShopkeeperProfile";
import ShopkeeperTransactionHistory from "./pages/ShopkeeperTransactionHistory";
import ShopkeeperWeightMonitor from "./pages/ShopkeeperWeightMonitor";
export default function App() {
  // Load user from localStorage if already logged in
  const [user, setUser] = useState(() => {
    const storedCitizen = localStorage.getItem("citizen");
    const storedShop = localStorage.getItem("shopkeeper");
    const storedAuthority = localStorage.getItem("authority");

    if (storedCitizen) return { role: "citizen", ...JSON.parse(storedCitizen) };
    if (storedShop) return { role: "shopkeeper", ...JSON.parse(storedShop) };
    if (storedAuthority) return { role: "authority", ...JSON.parse(storedAuthority) };
    return null;
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("citizen");
    localStorage.removeItem("shopkeeper");
    localStorage.removeItem("authority");
    setUser(null);
    console.log("Logged out");
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN ROUTE (redirect if already logged in) */}
        <Route
          path="/"
          element={
            user ? (
              user.role === "citizen" ? (
                <Navigate to="/citizen/dashboard" replace />
              ) : user.role === "shopkeeper" ? (
                <Navigate to="/shopkeeper/dashboard" replace />
              ) : (
                <Navigate to="/authority/dashboard" replace />
              )
            ) : (
              <LoginPage onLogin={(loggedInUser) => setUser(loggedInUser)} />
            )
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
            localStorage.getItem("token") && user?.role === "citizen" ? (
              <CitizenDashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/citizen/profile"
          element={
            localStorage.getItem("token") && user?.role === "citizen" ? (
              <CitizenProfile user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/citizen/transactions"
          element={
            localStorage.getItem("token") && user?.role === "citizen" ? (
              <CitizenTransactionHistory user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* SHOPKEEPER ROUTES */}
        <Route
          path="/shopkeeper/dashboard"
          element={
            localStorage.getItem("token") && user?.role === "shopkeeper" ? (
              <ShopkeeperDashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/shopkeeper/profile"
          element={
            localStorage.getItem("token") && user?.role === "shopkeeper" ? (
              <ShopkeeperProfile user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/shopkeeper/transactions"
          element={
            localStorage.getItem("token") && user?.role === "shopkeeper" ? (
              <ShopkeeperTransactionHistory user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/shopkeeper/weight-monitor"
          element={
            localStorage.getItem("token") && user?.role === "shopkeeper" ? (
              <ShopkeeperWeightMonitor user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        {/* SINGLE catch-all */}
        <Route
          path="*"
          element={
            localStorage.getItem("token") ? (
              user?.role === "citizen" ? (
                <Navigate to="/citizen/dashboard" replace />
              ) : user?.role === "shopkeeper" ? (
                <Navigate to="/shopkeeper/dashboard" replace />
              ) : (
                <Navigate to="/authority/dashboard" replace />
              )
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
