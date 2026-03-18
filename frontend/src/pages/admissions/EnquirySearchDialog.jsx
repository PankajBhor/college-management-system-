import React, { useState } from 'react';
import './EnquirySearchDialog.css';
import enquiryService from '../../services/enquiryService';

const EnquirySearchDialog = ({ admissionType, onSelectEnquiry, onSkip, onBack }) => {
  const [step, setStep] = useState('question'); // 'question' | 'search' | 'notfound'
  const [sscSeatNo, setSscSeatNo] = useState('');
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

  const handleEnquiryYes = () => {
    setStep('search');
    setError('');
    setSscSeatNo('');
  };

  const handleEnquiryNo = () => {
    onSkip();
  };

  const handleSearchEnquiry = async () => {
    if (!sscSeatNo.trim()) {
      setError('Please enter SSC Seat No');
      return;
    }

    setSearching(true);
    setError('');

    try {
      // Search in database using enquiry service
      const foundEnquiry = await enquiryService.getEnquiryBySscSeatNo(sscSeatNo);

      if (foundEnquiry) {
        onSelectEnquiry(foundEnquiry);
      } else {
        setError(`No enquiry found with Seat No: ${sscSeatNo}`);
        setStep('notfound');
      }
    } catch (err) {
      setError('Error searching enquiry: ' + err.message);
    } finally {
      setSearching(false);
    }
  };

  const handleBackToQuestion = () => {
    setStep('question');
    setError('');
    setSscSeatNo('');
  };

  return (
    <div className="enquiry-dialog-container">
      {/* Step 1: Enquiry Status Question */}
      {step === 'question' && (
        <>
          <div className="dialog-section-heading">
            <h2>
              Student Enquiry Status
            </h2>
            <p>
              Was enquiry done in Jaihind Polytechnic?
            </p>
          </div>

          <div className="dialog-button-container">
            <button
              onClick={onBack}
              className="dialog-button dialog-button-secondary"
            >
              ← Back
            </button>
            <button
              onClick={handleEnquiryNo}
              className="dialog-button dialog-button-danger"
            >
              ❌ No
            </button>
            <button
              onClick={handleEnquiryYes}
              className="dialog-button dialog-button-success"
            >
              ✓ Yes
            </button>
          </div>
        </>
      )}

      {/* Step 2: SSC Seat No Search */}
      {step === 'search' && (
        <>
          <div className="dialog-section-heading">
            <h2>
              Search Student Record
            </h2>
            <p>
              Enter SSC Seat No to find student enquiry
            </p>
          </div>

          {error && (
            <div className="dialog-error-message">
              {error}
            </div>
          )}

          <div className="dialog-form-group">
            <label className="dialog-form-label">
              SSC Seat No <span className="dialog-form-label-required">*</span>
            </label>
            <input
              type="text"
              value={sscSeatNo}
              onChange={(e) => {
                setSscSeatNo(e.target.value.toUpperCase());
                setError('');
              }}
              placeholder="Enter seat number (e.g., ABC238)"
              className="dialog-form-input"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearchEnquiry();
                }
              }}
              disabled={searching}
              autoFocus
            />
            <p className="dialog-form-hint">
              Case-insensitive search
            </p>
          </div>

          <div className="dialog-button-container">
            <button
              onClick={handleBackToQuestion}
              disabled={searching}
              className="dialog-button dialog-button-secondary"
            >
              ← Back
            </button>
            <button
              onClick={handleSearchEnquiry}
              disabled={searching || !sscSeatNo.trim()}
              className="dialog-button dialog-button-success"
            >
              {searching ? '🔍 Searching...' : '🔍 Search'}
            </button>
          </div>
        </>
      )}

      {/* Step 3: Not Found */}
      {step === 'notfound' && (
        <>
          <div className="dialog-not-found-container">
            <div className="dialog-not-found-icon">❌</div>
            <h2 className="dialog-not-found-heading">
              Record Not Found
            </h2>
            <p className="dialog-not-found-message">
              No enquiry found for Seat No: <strong>{sscSeatNo}</strong>
            </p>
            <p className="dialog-not-found-subtext">
              Please check the seat number or fill the form manually
            </p>
          </div>

          <div className="dialog-button-container">
            <button
              onClick={handleBackToQuestion}
              className="dialog-button dialog-button-secondary"
            >
              ← Try Again
            </button>
            <button
              onClick={onSkip}
              className="dialog-button dialog-button-primary"
            >
              📝 Fill Manually
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EnquirySearchDialog;
