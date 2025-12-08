import React from 'react';
import { useNavigate } from 'react-router-dom';
import familyQuotaData from '../data/familyQuotaData.json';
import '../styles/FamilyQuota.css';

const FamilyQuota = () => {
  const navigate = useNavigate();
  
  // Only destructure what's actually used
  const { 
    familyDetails: { 
      totalMembers = 5, 
      cardType = 'BPL',
      currentMonth = 'December 2025'
    } = {}, 
    monthlyAllocations = [], 
    notes = []
  } = familyQuotaData || {};

  const handleBackToDashboard = () => {
    navigate('/citizen/dashboard');
  };

  return (
    <div className="family-quota-container">
      <div className="page-header">
        <button className="back-btn" onClick={handleBackToDashboard}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Dashboard
        </button>
        <div className="header-text-group">
          <h1 className="hindi-title">परिवार का कोटा</h1>
          <span className="english-subtitle">Family Monthly Quota</span>
        </div>
      </div>

      <div className="content-stack">
        {/* Card 1: Family Details */}
        <div className="info-card">
          <div className="card-header">
            <div className="icon-circle user-icon-bg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4299e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div className="card-title-wrapper">
              <h2>Family Details</h2>
              <span className="hindi-label">परिवार का विवरण</span>
            </div>
          </div>

          <div className="details-grid-row">
            <div className="detail-block light-blue-bg">
              <span className="block-label">Total Members</span>
              <span className="block-value">{totalMembers} सदस्य</span>
            </div>
            
            <div className="detail-block light-green-bg">
              <span className="block-label">Card Type</span>
              <span className="block-value">{cardType}</span>
            </div>

            <div className="detail-block light-blue-bg">
              <span className="block-label">Current Month</span>
              <span className="block-value">{currentMonth}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Monthly Allocation */}
        <div className="info-card">
          <div className="card-header">
            <div className="icon-circle cube-icon-bg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3182ce" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
            <div className="card-title-wrapper">
              <h2>Monthly Allocation / मासिक आवंटन</h2>
            </div>
          </div>

          <div className="allocations-list">
            {monthlyAllocations.map((item, index) => {
              const percentage = Math.min((item.used / item.allocated) * 100, 100);
              
              return (
                <div key={index} className="allocation-item">
                  <div className="item-header-row">
                    <div className="item-title">
                      <strong>{item.itemName}</strong> / {item.itemNameHindi}
                    </div>
                    <div className="item-status">
                      <span className="status-highlight">{item.remaining} {item.unit} बचा</span>
                      <span className="status-sub">{item.remaining} {item.unit} remaining</span>
                    </div>
                  </div>

                  <div className="progress-track">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>

                  <div className="item-footer-row">
                    <span>आवंटित / Allocated: {item.allocated} {item.unit}</span>
                    <span>उपयोग किया / Used: {item.used} {item.unit}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 3: Notes */}
        {notes.length > 0 && (
          <div className="info-card">
            <div className="card-header">
              <div className="icon-circle note-icon-bg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d69e2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <div className="card-title-wrapper">
                <h2>Notes / सूचना</h2>
              </div>
            </div>

            <div className="notes-content">
              {notes.map((note, index) => (
                <div key={index} className="note-item">
                  <span className="note-bullet">•</span>
                  <span className="note-text">{note}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilyQuota;