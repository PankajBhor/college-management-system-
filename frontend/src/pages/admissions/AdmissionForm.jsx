import React, { useState, useEffect } from 'react';
import './AdmissionForm.css';
import FYAdmissionForm from './FYAdmissionForm';
import DSYAdmissionForm from './DSYAdmissionForm';

const AdmissionForm = () => {
  const [admissionType, setAdmissionType] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleAdmissionTypeChange = (type) => {
    setAdmissionType(type);
    setShowForm(true);
  };

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

  return (
    <div className="admission-container">
      <button 
        className="btn btn-secondary back-btn"
        onClick={() => setShowForm(false)}
      >
        ← Back
      </button>
      
      {admissionType === 'FY' ? (
        <FYAdmissionForm />
      ) : (
        <DSYAdmissionForm />
      )}
    </div>
  );
};

export default AdmissionForm;
