import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Import pages
import Homepage from "./shared/pages/Homepage";

// Citizen routes
import CitizenLogin from "./portals/citizen/auth/CitizenLogin";
import CitizenSignup from "./portals/citizen/auth/CitizenSignup";
import CitizenDashboardPage from "./portals/citizen/pages/CitizenDashboardPage";
import FamilyQuota from "./portals/citizen/pages/FamilyQuota";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Homepage */}
          <Route path="/" element={<Homepage />} />
          
          {/* Citizen Routes */}
          <Route path="/citizen/login" element={<CitizenLogin />} />
          <Route path="/citizen/signup" element={<CitizenSignup />} />
          <Route path="/citizen/dashboard" element={<CitizenDashboardPage />} />
          <Route path="/citizen/family-quota" element={<FamilyQuota />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;