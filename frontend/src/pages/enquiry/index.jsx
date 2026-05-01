import React, { useState, useEffect } from 'react';
import { useEnquiry } from '../../hooks/useEnquiry';
import { useAuth } from '../../hooks/useAuth';
import EnquiryList from './EnquiryList';
import { exportToExcel, exportToPDF } from '../../utils/exportUtils';
import ExportFieldChecklist from './ExportFieldChecklist';
import {
  getAllAdmissionTypes,
  getAllBranches,
  getAllCategories,
  getAllEnquiryStatuses,
  getAllLocations
} from '../../services/lookupService';

function EnquiryIndex() {
  const { user } = useAuth();
  const {
    enquiries,
    loading,
    fetchEnquiries,
    removeEnquiry,
    pageNumber,
    totalPages,
    pageSize,
    totalElements,
    goToPage,
    changePageSize
  } = useEnquiry();

  // State definitions
  const [filters, setFilters] = useState({
    admissionFor: '',
    branch: '',
    branchPriority: '',
    location: '',
    category: '',
    status: '',
    date: ''
  });
  const [exportModal, setExportModal] = useState({ open: false, type: null });
  const [exportFields, setExportFields] = useState([]);
  const [lookupOptions, setLookupOptions] = useState({
    locations: [],
    categories: [],
    branches: [],
    admissionTypes: [],
    statuses: []
  });

  // Fetch enquiries on component mount
  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  useEffect(() => {
    async function fetchLookupOptions() {
      try {
        const [locations, categories, branches, admissionTypes, statuses] = await Promise.all([
          getAllLocations(),
          getAllCategories(),
          getAllBranches(),
          getAllAdmissionTypes(),
          getAllEnquiryStatuses()
        ]);
        setLookupOptions({
          locations: locations || [],
          categories: categories || [],
          branches: branches || [],
          admissionTypes: admissionTypes || [],
          statuses: statuses || []
        });
      } catch (error) {
        console.error('Error loading enquiry lookup options:', error);
      }
    }
    fetchLookupOptions();
  }, []);

  // Filter enquiries based on current filters
  const getFilteredEnquiries = () => {
    return enquiries.filter((enquiry) => {
      // Apply each filter
      if (filters.admissionFor && enquiry.admissionFor !== filters.admissionFor) {
        return false;
      }
      if (filters.location && enquiry.location !== filters.location) {
        return false;
      }
      if (filters.category && enquiry.category !== filters.category) {
        return false;
      }
      if (filters.status && enquiry.status !== filters.status) {
        return false;
      }
      if (filters.date && enquiry.enquiryDate !== filters.date) {
        return false;
      }

      // Filter by branch if selected
      if (filters.branch || filters.branchPriority) {
        let branches = enquiry.branchesInterested;
        if (typeof branches === 'string') {
          try {
            branches = JSON.parse(branches);
          } catch {
            branches = [];
          }
        }

        if (filters.branch && !branches.some((b) => b.branch === filters.branch)) {
          return false;
        }

        if (filters.branchPriority) {
          if (!branches.some((b) => String(b.priority) === filters.branchPriority)) {
            return false;
          }
          return true;
        }
        return true;
      }
      return true;
    });
  };

  // Handle delete enquiry
  const handleDelete = async (enquiryId) => {
    if (window.confirm('Are you sure you want to delete this enquiry?')) {
      try {
        await removeEnquiry(enquiryId);
      } catch (error) {
        alert('Error deleting enquiry: ' + error.message);
      }
    }
  };

  // Handle status update
  const handleStatusUpdate = async (enquiryId, newStatus) => {
    try {
      await fetchEnquiries(pageNumber, pageSize);
    } catch (error) {
      alert('Error updating status: ' + error.message);
    }
  };

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
          pageNumber={pageNumber}
          totalPages={totalPages}
          pageSize={pageSize}
          totalElements={totalElements}
          onPageChange={goToPage}
          onPageSizeChange={changePageSize}
          lookupOptions={lookupOptions}
        />
      )}

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
    </div>
  );
}

export default EnquiryIndex;


