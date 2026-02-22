import React, { useState, useEffect } from 'react';
import { useEnquiry } from '../../hooks/useEnquiry';
import { useAuth } from '../../hooks/useAuth';
import EnquiryList from './EnquiryList';
import { exportToExcel, exportToPDF } from '../../utils/exportUtils';
// helper dropdown data
import {
  locationOptions,
  categoryOptions,
  branchOptions,
  admissionForOptions
} from '../../data/mockEnquiries';
const EnquiryIndex = () => {
  const { enquiries, loading, fetchEnquiries, addEnquiry, removeEnquiry } = useEnquiry();
  const { user } = useAuth();

  // filter state for the table
  const [filters, setFilters] = useState({
    admissionFor: '',
    branch: '',
    branchPriority: '',
    location: '',
    category: '',
    status: '',
    date: ''
  });

  useEffect(() => {
    fetchEnquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this enquiry?')) {
      try {
        await removeEnquiry(id);
        alert('Enquiry deleted successfully!');
      } catch (error) {
        alert('Error deleting enquiry: ' + error.message);
      }
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    // The status has already been updated in the backend by the EnquiryList component
    // Just refresh the enquiries to reflect the change
    try {
      await fetchEnquiries();
    } catch (error) {
      console.error('Error refreshing enquiries after status update:', error);
    }
  };

  // build filtered list based on current filters
  const getFilteredEnquiries = () => {
    return enquiries.filter((e) => {
      if (filters.admissionFor && e.admissionFor !== filters.admissionFor) return false;
      if (filters.location && e.location !== filters.location) return false;
      if (filters.category && e.category !== filters.category) return false;
      if (filters.status && e.status !== filters.status) return false;
      if (filters.date && e.enquiryDate !== filters.date) return false;
      if (filters.branch) {
        let branches = e.branchesInterested;
        if (typeof branches === 'string') {
          try {
            branches = JSON.parse(branches);
          } catch (_){ branches = []; }
        }
        const match = branches.find(b => {
          const basic = b.branch === filters.branch;
          if (!basic) return false;
          if (filters.branchPriority) {
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
                onClick={() => {
                  try {
                    exportToExcel(enquiries);
                  } catch (error) {
                    alert('Error exporting to Excel: ' + error.message);
                  }
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
                title="Download enquiries as CSV file"
              >
                📊 Export Excel
              </button>
              <button
                onClick={() => {
                  try {
                    exportToPDF(enquiries);
                  } catch (error) {
                    alert('Error exporting to PDF: ' + error.message);
                  }
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
  );
};

export default EnquiryIndex;


