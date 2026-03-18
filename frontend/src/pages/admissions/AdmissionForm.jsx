import React, { useState } from 'react';
import './AdmissionForm.css';
import FYAdmissionForm from './FYAdmissionForm';
import DSYAdmissionForm from './DSYAdmissionForm';
import EnquirySearchDialog from './EnquirySearchDialog';

const AdmissionForm = () => {
  const [admissionType, setAdmissionType] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showEnquirySearch, setShowEnquirySearch] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const handleAdmissionTypeChange = (type) => {
    setAdmissionType(type);
    setShowForm(true);
    setShowEnquirySearch(true);
  };

  // Step 1: Show FY/DSY selection
  if (!showForm || !admissionType) {
    return (
      <div className="admission-selector">
        <div className="admission-card">
          <h1>Student Admissions</h1>
          <p>Select admission type to proceed</p>

          <div className="admission-options">
            <div
              className="admission-option fy-option"
              onClick={() => handleAdmissionTypeChange('FY')}
            >
              <h2>First Year (FY)</h2>
              <p>For students seeking admission to First Year Diploma Program</p>
              <button className="btn btn-primary">Select FY</button>
            </div>

            <div
              className="admission-option dsy-option"
              onClick={() => handleAdmissionTypeChange('DSY')}
            >
              <h2>Direct Second Year (DSY)</h2>
              <p>For students seeking admission to Direct Second Year Diploma Program</p>
              <button className="btn btn-primary">Select DSY</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Show enquiry search dialog
  if (showEnquirySearch) {
    return (
      <EnquirySearchDialog
        admissionType={admissionType}
        onSelectEnquiry={(enquiry) => {
          setSelectedEnquiry(enquiry);
          setShowEnquirySearch(false);
        }}
        onSkip={() => {
          setSelectedEnquiry(null);
          setShowEnquirySearch(false);
        }}
        onBack={() => {
          setShowForm(false);
          setAdmissionType('');
          setSelectedEnquiry(null);
        }}
      />
    );
  }

  // Step 3: Show admission form (with optional pre-filled data)
  return (
    <div className="admission-container">
      <button
        className="btn btn-secondary back-btn"
        onClick={() => {
          if (selectedEnquiry) {
            setShowEnquirySearch(true);
            setSelectedEnquiry(null);
          } else {
            setShowForm(false);
            setAdmissionType('');
          }
        }}
      >
        ← Back
      </button>

      {selectedEnquiry && (
        <div style={{
          marginBottom: '20px',
          padding: '12px 16px',
          background: '#e8f5e9',
          border: '1px solid #81c784',
          borderRadius: '8px',
          fontSize: '13px',
          color: '#2e7d32'
        }}>
          ✓ Pre-filled from enquiry: <strong>{`${selectedEnquiry.firstName} ${selectedEnquiry.lastName}`}</strong> (Seat: {selectedEnquiry.sscSeatNo})
        </div>
      )}

      {admissionType === 'FY' ? (
        <FYAdmissionForm prefilledEnquiry={selectedEnquiry} />
      ) : (
        <DSYAdmissionForm prefilledEnquiry={selectedEnquiry} />
      )}
    </div>
  );
};

export default AdmissionForm;
