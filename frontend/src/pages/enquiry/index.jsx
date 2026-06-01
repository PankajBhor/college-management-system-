import React, { useState, useEffect } from 'react';
import { useEnquiry } from '../../hooks/useEnquiry';
import { useAuth } from '../../hooks/useAuth';
import EnquiryList from './EnquiryList';
import { exportToExcel } from '../../utils/exportUtils';
import ExportFieldChecklist from './ExportFieldChecklist';
import { enquiryMatchesBranchFilters } from '../../utils/branchPreferences';
import enquiryService from '../../services/enquiryService';
import { canAccessPage } from '../../data/menuData';
import {
  getAllAdmissionTypes,
  getAllBranches,
  getAllEnquiryCategories,
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
    date: '',
    name: '',
    referenceFaculty: '',
    dateSort: ''
  });
  const [exportModal, setExportModal] = useState({ open: false, type: null });
  const [exportFields, setExportFields] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
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
          getAllEnquiryCategories(),
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
      const displayLocation = enquiry.location === 'Other' ? enquiry.otherLocation : enquiry.location;
      if (filters.location && displayLocation !== filters.location) {
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
      if (filters.name) {
        const fullName = [enquiry.firstName, enquiry.middleName, enquiry.lastName].filter(Boolean).join(' ').toLowerCase();
        if (!fullName.includes(filters.name.toLowerCase())) return false;
      }
      if (filters.referenceFaculty) {
        const facultyName = String(enquiry.referenceFaculty || '').toLowerCase();
        if (!facultyName.includes(filters.referenceFaculty.toLowerCase())) return false;
      }

      if (filters.branch || filters.branchPriority) {
        return enquiryMatchesBranchFilters(enquiry, filters.branch, filters.branchPriority);
      }
      return true;
    }).sort((a, b) => {
      if (!filters.dateSort) return 0;
      const left = new Date(a.enquiryDate || 0).getTime();
      const right = new Date(b.enquiryDate || 0).getTime();
      return filters.dateSort === 'asc' ? left - right : right - left;
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
  const canAddEnquiry = user && ['ADMIN', 'ENQUIRY_STAFF', 'PRINCIPAL'].includes(user.role);
  const canUploadEnquiries = canAccessPage(user, 'bulk-enquiry-upload');

  const handleBulkUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setUploading(true);
    try {
      const result = await enquiryService.bulkUploadEnquiries(file);
      setUploadResult(result);
      await fetchEnquiries(pageNumber, pageSize);
    } catch (error) {
      alert(error.response?.data?.error || error.response?.data?.message || error.message || 'Unable to upload enquiries');
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      await enquiryService.downloadEnquiryBulkUploadTemplate();
    } catch (error) {
      alert(error.response?.data?.error || error.response?.data?.message || error.message || 'Unable to download enquiry template');
    }
  };

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
                date: '',
                name: '',
                referenceFaculty: '',
                dateSort: ''
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
            </>
          )}
          {canUploadEnquiries && (
            <>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                style={{
                  padding: '10px 18px',
                  background: '#fff',
                  color: '#344054',
                  border: '1px solid #d0d5dd',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600'
                }}
              >
                Download Format
              </button>
              <label
                style={{
                  padding: '10px 18px',
                  background: uploading ? '#e5e7eb' : '#ecfdf3',
                  color: uploading ? '#667085' : '#067647',
                  border: '1px solid #abefc6',
                  borderRadius: '8px',
                  cursor: uploading ? 'wait' : 'pointer',
                  fontSize: '13px',
                  fontWeight: '600'
                }}
                title="Upload enquiries from Excel"
              >
                {uploading ? 'Uploading...' : 'Upload Excel'}
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  disabled={uploading}
                  onChange={handleBulkUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </>
          )}
        </div>
      </div>

      {uploadResult && (
        <div style={{ marginBottom: '18px', padding: '14px', border: '1px solid #d0d5dd', borderRadius: '8px', background: '#f8fafc' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start' }}>
            <div>
              <strong>Excel upload complete:</strong> {uploadResult.successCount || 0} saved, {uploadResult.failedCount || 0} failed out of {uploadResult.totalRows || 0} rows.
              {uploadResult.errors?.length > 0 && (
                <ul style={{ margin: '10px 0 0', paddingLeft: '18px', color: '#b42318' }}>
                  {uploadResult.errors.slice(0, 10).map((error, index) => <li key={index}>{error}</li>)}
                </ul>
              )}
              {uploadResult.errors?.length > 10 && <p style={{ margin: '8px 0 0', color: '#b42318' }}>Showing first 10 errors.</p>}
            </div>
            <button type="button" onClick={() => setUploadResult(null)} style={{ border: '1px solid #d0d5dd', background: '#fff', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      )}

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
          }
        }}
        onClose={() => setExportModal({ open: false, type: null })}
      />
    </div>
  );
}

export default EnquiryIndex;





