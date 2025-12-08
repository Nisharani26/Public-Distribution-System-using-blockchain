import React from "react";
import { 
  MdPerson, 
  MdHome, 
  MdStore, 
  MdList, 
  MdShoppingCart, 
  MdReportProblem 
} from "react-icons/md";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../styles/CitizenDashboardPage.css";

const CitizenDashboardPage = () => {
  const navigate = useNavigate(); // Initialize navigate

  const handleFamilyQuotaClick = () => {
    navigate("/citizen/family-quota"); // Redirect to FamilyQuota page
  };

  const handleBackToHome = () => {
    navigate("/"); // Redirect back to homepage
  };

  const handleLogout = () => { // Add this function
    navigate("/citizen/login");
  };


  return (
    <div className="citizen-page">
      <header className="citizen-header">
        <div>
          <h1 className="portal-title">नागरिक पोर्टल</h1>
          <p className="portal-subtitle">Citizen Portal</p>
        </div>
        <div className="header-buttons">
          <button className="home-button" onClick={handleBackToHome}>
            Home
          </button>
          <button className="logout-button" onClick={handleLogout}> {/* Add onClick */}
          Logout
        </button>
        </div>
      </header>

      <main className="citizen-main">
        {/* Top user card */}
        <section className="citizen-top-card">
          <div className="user-icon-circle">
            <MdPerson className="user-icon" />
          </div>
          <div className="user-info">
            <p className="user-greeting">नमस्ते, राम कुमार</p>
            <p className="user-id">Ration ID: RA123456</p>
          </div>
        </section>

        {/* Three stats cards */}
        <section className="citizen-stats-row">
          <div className="stat-card stat-blue">
            <p className="stat-title">मौजूदा कोटा / Quota Left</p>
            <p className="stat-value">15 kg Rice</p>
          </div>
          <div className="stat-card stat-green">
            <p className="stat-title">लंबित ऑर्डर / Pending Orders</p>
            <p className="stat-value">2 Requests</p>
          </div>
          <div className="stat-card stat-blue">
            <p className="stat-title">पिछला ऑर्डर / Last Order</p>
            <p className="stat-value">3 days ago</p>
          </div>
        </section>

        {/* Action grid */}
        <section className="citizen-actions-grid">
          {/* Add onClick to this button */}
          <button className="action-card" onClick={handleFamilyQuotaClick}>
            <div className="action-card-header">
              <MdHome className="action-icon" />
              <h3>परिवार का कोटा</h3>
            </div>
            <p>Family Quota</p>
          </button>

          <button className="action-card">
            <div className="action-card-header">
              <MdStore className="action-icon" />
              <h3>दुकान का स्टॉक</h3>
            </div>
            <p>Shop Stock</p>
          </button>

          <button className="action-card">
            <div className="action-card-header">
              <MdList className="action-icon" />
              <h3>सामान माँगे</h3>
            </div>
            <p>Request Items</p>
          </button>

          <button className="action-card">
            <div className="action-card-header">
              <MdShoppingCart className="action-icon" />
              <h3>ऑर्डर ट्रैक करें</h3>
            </div>
            <p>Track Order</p>
          </button>

          <button className="action-card">
            <div className="action-card-header">
              <MdReportProblem className="action-icon" />
              <h3>नई शिकायत</h3>
            </div>
            <p>New Complaint</p>
          </button>

          <button className="action-card">
            <div className="action-card-header">
              <MdReportProblem className="action-icon" />
              <h3>शिकायत स्थिति</h3>
            </div>
            <p>Complaint Status</p>
          </button>
        </section>

        {/* Help section */}
        <section className="citizen-help">
          <h3>मदद / Help</h3>
          <p>
            किसी भी समस्या के लिए नजदीकी कार्ड सेवा केंद्र या हेल्पलाइन पर संपर्क करें:
            1800-XXX-XXXX
          </p>
        </section>
      </main>
    </div>
  );
};

export default CitizenDashboardPage;