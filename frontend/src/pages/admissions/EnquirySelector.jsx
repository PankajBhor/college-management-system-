import React, { useState, useEffect } from 'react';
import { useEnquiry } from '../../hooks/useEnquiry';
import enquiryService from '../../services/enquiryService';

const EnquirySelector = ({ admissionType, onSelectEnquiry, onSkip, onBack }) => {
  const { enquiries, loading, fetchEnquiries } = useEnquiry();
  const [selectedEnquiryId, setSelectedEnquiryId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  // Filter enquiries by admission type
  const filteredEnquiries = enquiries.filter(e => e.admissionFor === admissionType);

  // Get selected enquiry details
  const selectedEnquiry = filteredEnquiries.find(e => e.id === selectedEnquiryId);

  const handleSelectClick = () => {
    if (selectedEnquiry) {
      onSelectEnquiry(selectedEnquiry);
    }
  };

  const getFullName = (enquiry) => {
    return `${enquiry.firstName} ${enquiry.middleName ? enquiry.middleName + ' ' : ''}${enquiry.lastName}`.trim();
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '40px',
      maxWidth: '600px',
      margin: '0 auto',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      border: '1px solid #f0f0f0'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{
          color: '#1a1a1a',
          margin: '0 0 10px 0',
          fontSize: '24px',
          fontWeight: '700'
        }}>
          Select Student
        </h2>
        <p style={{
          color: '#666',
          margin: 0,
          fontSize: '14px',
          fontWeight: '500'
        }}>
          Select an existing enquiry to pre-fill the form, or skip to start with a blank form
        </p>
      </div>

      {error && (
        <div style={{
          padding: '12px 16px',
          background: '#fee7e7',
          border: '1px solid #f5a0a0',
          borderRadius: '8px',
          color: '#c53030',
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: '#666'
        }}>
          ⏳ Loading enquiries...
        </div>
      ) : filteredEnquiries.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          background: '#f8f9fa',
          borderRadius: '8px',
          color: '#666'
        }}>
          <p style={{ margin: '0 0 10px 0' }}>📭 No enquiries found for {admissionType}</p>
          <p style={{ margin: 0, fontSize: '13px', color: '#999' }}>You can skip and fill the form manually</p>
        </div>
      ) : (
        <>
          {/* Enquiry Dropdown */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '8px'
            }}>
              Available Enquiries ({filteredEnquiries.length})
            </label>
            <select
              value={selectedEnquiryId || ''}
              onChange={(e) => setSelectedEnquiryId(e.target.value ? parseInt(e.target.value) : null)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            >
              <option value="">-- Select an enquiry --</option>
              {filteredEnquiries.map(enquiry => (
                <option key={enquiry.id} value={enquiry.id}>
                  {getFullName(enquiry)} - {enquiry.email}
                </option>
              ))}
            </select>
          </div>

          {/* Enquiry Preview Card */}
          {selectedEnquiry && (
            <div style={{
              padding: '16px',
              background: '#f0f7ff',
              border: '1px solid #bde0ff',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <h4 style={{
                color: '#1a1a1a',
                margin: '0 0 12px 0',
                fontSize: '15px',
                fontWeight: '600'
              }}>
                {getFullName(selectedEnquiry)}
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                fontSize: '13px',
                color: '#555'
              }}>
                <div>
                  <span style={{ color: '#999' }}>Email:</span>
                  <div style={{ fontWeight: '500', color: '#1a1a1a' }}>{selectedEnquiry.email}</div>
                </div>
                <div>
                  <span style={{ color: '#999' }}>Mobile:</span>
                  <div style={{ fontWeight: '500', color: '#1a1a1a' }}>{selectedEnquiry.personalMobileNumber}</div>
                </div>
                <div>
                  <span style={{ color: '#999' }}>Category:</span>
                  <div style={{ fontWeight: '500', color: '#1a1a1a' }}>{selectedEnquiry.category}</div>
                </div>
                <div>
                  <span style={{ color: '#999' }}>Location:</span>
                  <div style={{
                    fontWeight: '500',
                    color: '#1a1a1a'
                  }}>
                    {selectedEnquiry.location === 'Other' ? selectedEnquiry.otherLocation : selectedEnquiry.location}
                  </div>
                </div>
                {selectedEnquiry.branchesInterested && selectedEnquiry.branchesInterested.length > 0 && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <span style={{ color: '#999' }}>Preferred Branches:</span>
                    <div style={{ fontWeight: '500', color: '#1a1a1a' }}>
                      {(() => {
                        let branches = selectedEnquiry.branchesInterested;
                        if (typeof branches === 'string') {
                          try {
                            branches = JSON.parse(branches);
                          } catch {
                            return 'N/A';
                          }
                        }
                        return Array.isArray(branches)
                          ? branches.map(b => `${b.branch}`).join(', ')
                          : 'N/A';
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end',
        marginTop: '30px'
      }}>
        <button
          onClick={onBack}
          style={{
            padding: '10px 20px',
            background: '#f0f0f0',
            color: '#333',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            fontFamily: 'inherit'
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#e0e0e0';
          }}
          onMouseOut={(e) => {
            e.target.style.background = '#f0f0f0';
          }}
        >
          ← Back
        </button>
        <button
          onClick={onSkip}
          style={{
            padding: '10px 20px',
            background: '#ccc',
            color: '#333',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            fontFamily: 'inherit'
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#bbb';
          }}
          onMouseOut={(e) => {
            e.target.style.background = '#ccc';
          }}
        >
          ⏭️ Skip & Start Fresh
        </button>
        <button
          onClick={handleSelectClick}
          disabled={!selectedEnquiry}
          style={{
            padding: '10px 20px',
            background: selectedEnquiry ? '#2563eb' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: selectedEnquiry ? 'pointer' : 'not-allowed',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            fontFamily: 'inherit'
          }}
          onMouseOver={(e) => {
            if (selectedEnquiry) {
              e.target.style.background = '#1d4ed8';
            }
          }}
          onMouseOut={(e) => {
            if (selectedEnquiry) {
              e.target.style.background = '#2563eb';
            }
          }}
        >
          ✓ Use This Enquiry
        </button>
      </div>
    </div>
  );
};

export default EnquirySelector;
