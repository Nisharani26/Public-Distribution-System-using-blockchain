import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CitizenAuth.css';

const CitizenLogin = () => {
  const navigate = useNavigate();
  const [rationId, setRationId] = useState('');
  const [pin, setPin] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Login logic here
    navigate('/citizen/dashboard');
  };

  return (
    <div className="auth-page-container">
      {/* Top Left Back Button */}
      <button className="top-back-btn" onClick={() => navigate('/')}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back
      </button>

      <div className="auth-card">
        {/* User Icon Circle */}
        <div className="icon-header">
          <div className="blue-circle-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="hindi-title">नागरिक लॉगिन</h1>
          <p className="english-subtitle">Citizen Login</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          {/* Ration ID Input */}
          <div className="input-group">
            <label>राशन कार्ड नंबर / Ration ID</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </span>
              <input 
                type="text" 
                placeholder="Enter Ration ID"
                value={rationId}
                onChange={(e) => setRationId(e.target.value)}
                className="styled-input"
              />
            </div>
          </div>

          {/* PIN Input */}
          <div className="input-group">
            <label>4-अंकीय पिन / 4-Digit PIN</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <input 
                type="password" 
                placeholder="Enter PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="styled-input"
              />
            </div>
          </div>

          {/* Login Button */}
          <button type="submit" className="primary-btn">
            लॉगिन करें / Login
          </button>
        </form>

        {/* Bottom Link */}
        <div className="bottom-link">
          <span className="new-user-text">नया उपयोगकर्ता? साइन अप करें / New User? </span>
          <button onClick={() => navigate('/citizen/signup')} className="link-btn">
             Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default CitizenLogin;
