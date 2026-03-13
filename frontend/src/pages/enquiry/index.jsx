import React, { useState, useEffect } from 'react';
import { useEnquiry } from '../../hooks/useEnquiry';
import { useAuth } from '../../hooks/useAuth';
import EnquiryList from './EnquiryList';
import { exportToExcel, exportToPDF } from '../../utils/exportUtils';
import ExportFieldChecklist from './ExportFieldChecklist';
// helper dropdown data
  locationOptions,
  categoryOptions
            return String(b.priority) === filters.branchPriority;
          }
          return true;
        });
        if (!match) return false;
      }
      return true;
    });
  };

  // helper to render dropdown options
  const renderOptions = (options) =>
    options.map((opt) => (
      <option key={opt} value={opt}>
        {opt}
      </option>
    ));

  // Check if user is enquiry staff or principal
  const canAddEnquiry = user && (user.role === 'ENQUIRY_STAFF' || user.role === 'PRINCIPAL');

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '35px'
      }}>
        <div>
          <h2 style={{
            color: '#1a1a1a',
            margin: '0 0 10px 0',
            fontSize: '28px',
            fontWeight: '700'
          }}>
            Enquiries
          </h2>
          <p style={{
            color: '#666',
            margin: 0,
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Manage and track student enquiries
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={() => {
              setFilters({
                admissionFor: '',
                branch: '',
                branchPriority: '',
                location: '',
                category: '',
                status: '',
                date: ''
              });
            }}
            style={{
              padding: '10px 18px',
              background: '#f0f0f0',
              color: '#333',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#e0e0e0';
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#f0f0f0';
            }}
          >
            🔄 Clear Filters
          </button>
          {canAddEnquiry && (
            <>
              <button
                onClick={() => setExportModal({ open: true, type: 'excel' })}
                style={{
                  padding: '10px 18px',
                  background: '#f0f0f0',
                  color: '#333',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#e0e0e0';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = '#f0f0f0';
                }}
                title="Download enquiries as CSV file"
              >
                📊 Export Excel
              </button>
              <button
                onClick={() => setExportModal({ open: true, type: 'pdf' })}
                style={{
                  padding: '10px 18px',
                  background: '#f0f0f0',
                  color: '#333',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#e0e0e0';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = '#f0f0f0';
                }}
                title="Download enquiries as PDF file"
              >
                📄 Export PDF
              </button>
            </>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#666',
          fontSize: '1.1em'
        }}>
          ⏳ Loading enquiries...
        </div>
      ) : enquiries.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: '#f8f9fa',
          borderRadius: '15px',
          color: '#666'
        }}>
          <p style={{ fontSize: '1.1em', margin: '0 0 10px 0' }}>📭 No enquiries yet</p>
          <p style={{ margin: 0, fontSize: '14px', color: '#999' }}>Use the "New Enquiry" page to add new enquiries</p>
        </div>
      ) : (
        <EnquiryList
          enquiries={getFilteredEnquiries()}
          onDelete={handleDelete}
          onStatusUpdate={handleStatusUpdate}
          filters={filters}
          setFilters={setFilters}
          allEnquiries={enquiries}
        />
      )}


    </div>
    <ExportFieldChecklist
      open={exportModal.open}
      fields={exportFields}
      setFields={setExportFields}
      onExport={() => {
        setExportModal({ open: false, type: null });
        if (exportModal.type === 'excel') {
          try {
            exportToExcel(enquiries, exportFields);
          } catch (error) {
            alert('Error exporting to Excel: ' + error.message);
          }
        } else if (exportModal.type === 'pdf') {
          try {
            exportToPDF(enquiries, exportFields);
          } catch (error) {
            alert('Error exporting to PDF: ' + error.message);
          }
        }
      }}
      onClose={() => setExportModal({ open: false, type: null })}
    />
  </>);
};

export default EnquiryIndex;


