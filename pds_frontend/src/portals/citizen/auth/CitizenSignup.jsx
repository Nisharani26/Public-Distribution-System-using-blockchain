import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CitizenAuth.css';

const CitizenSignup = () => {
  const navigate = useNavigate();
  const [rationId, setRationId] = useState('');
  const [mobile, setMobile] = useState('');

  const handleSendOTP = (e) => {
    e.preventDefault();
    console.log('Sending OTP...');
    // Add logic to move to next step
  };

  return (
    <div className="auth-page-container">
      {/* Top Left Back Button */}
      <button className="top-back-btn" onClick={() => navigate(-1)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back
      </button>

      <div className="auth-card signup-card-width">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="hindi-title">नया खाता बनाएं</h1>
          <p className="english-subtitle">Create New Account</p>
        </div>

        {/* Stepper */}
        <div className="stepper-container">
          <div className="step active">
            <div className="step-circle">1</div>
            <span className="step-label">Ration ID</span>
          </div>
          <div className="step-line"></div>
          <div className="step">
            <div className="step-circle inactive">2</div>
            <span className="step-label">Mobile OTP</span>
          </div>
          <div className="step-line"></div>
          <div className="step">
            <div className="step-circle inactive">3</div>
            <span className="step-label">Create PIN</span>
          </div>
        </div>

        <form onSubmit={handleSendOTP} className="auth-form">
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

          {/* Mobile Number Input */}
          <div className="input-group">
            <label>मोबाइल नंबर / Mobile Number</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </span>
              <input 
                type="text" 
                placeholder="Enter 10-digit Mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="styled-input"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="primary-btn">
            Send OTP / ओटीपी भेजें
          </button>
        </form>
      </div>
    </div>
  );
};

export default CitizenSignup;
