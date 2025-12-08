import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Homepage.css";

const Homepage = () => {
  const navigate = useNavigate();

  const handleCitizenPortal = () => {
    navigate("/citizen/login");
  };

  const handleShopkeeperPortal = () => {
    alert("Shopkeeper portal coming soon!");
  };

  const handleAuthorityPortal = () => {
    alert("Authority portal coming soon!");
  };

  return (
    <div className="landing-page">
      <header className="navbar">
        <div className="container">
          <div className="nav-content">
            <div className="logo">
              <h1>राशन वितरण प्रणाली</h1>
              <p>Government Ration Distribution System</p>
            </div>
            <nav className="nav-links">
              <a href="#home">Home</a>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
              <button className="login-btn">Login</button>
            </nav>
          </div>
        </div>
      </header>

      <section className="hero" id="home">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Government Ration Distribution System</h1>
            <p className="hero-subtitle">
              A digital platform for efficient and transparent ration distribution
            </p>
            <div className="hero-stats">
              <div className="stat">
                <h3>50,000+</h3>
                <p>Families Served</p>
              </div>
              <div className="stat">
                <h3>200+</h3>
                <p>Shops Registered</p>
              </div>
              <div className="stat">
                <h3>99%</h3>
                <p>System Efficiency</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="portals-section">
        <div className="container">
          <h2 className="section-title">Access Portals</h2>
          <p className="section-subtitle">
            Choose your portal to access the system
          </p>

          <div className="portals-grid">
            <div className="portal-card citizen-portal">
              <div className="portal-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h3>Citizen Portal</h3>
              <p className="portal-hindi">नागरिक पोर्टल</p>
              <p className="portal-description">
                Check quota, request items, track orders
              </p>
              <button className="portal-btn" onClick={handleCitizenPortal}>
                Enter Portal
              </button>
            </div>

            <div className="portal-card shopkeeper-portal">
              <div className="portal-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <h3>Shopkeeper Portal</h3>
              <p className="portal-hindi">दुकानदार पोर्टल</p>
              <p className="portal-description">
                Manage requests, verify delivery, update stock
              </p>
              <button className="portal-btn" onClick={handleShopkeeperPortal}>
                Enter Portal
              </button>
            </div>

            <div className="portal-card authority-portal">
              <div className="portal-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </div>
              <h3>Authority Portal</h3>
              <p className="portal-hindi">प्राधिकरण पोर्टल</p>
              <p className="portal-description">
                Monitor, allocate stock, manage users
              </p>
              <button className="portal-btn" onClick={handleAuthorityPortal}>
                Enter Portal
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-info">
              <h3>राशन वितरण प्रणाली</h3>
              <p>Government Ration Distribution System</p>
              <p>Ensuring food security for all citizens</p>
            </div>
            <div className="footer-contact">
              <h4>Contact Us</h4>
              <p>📞 Helpline: 1800-XXX-XXXX</p>
              <p>✉️ Email: support@ration.gov.in</p>
              <p>📍 Address: Ministry of Consumer Affairs, New Delhi</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2024 Government Ration Distribution System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;