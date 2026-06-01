import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAdmission } from '../../hooks/useAdmission';
import AdmissionForm from './AdmissionForm';
import FYAdmissionForm from './FYAdmissionForm';
import DSYAdmissionForm from './DSYAdmissionForm';
import AdmittedListFY from './AdmittedListFY';
import AdmittedListDSY from './AdmittedListDSY';
import { exportAdmissionsToExcel } from '../../utils/exportUtils';
import ExportFieldChecklist from '../enquiry/ExportFieldChecklist';
import { admissionService } from '../../services/admissionService';
import { canAccessPage, parseAccessPages } from '../../data/menuData';

const AdmissionPage = () => {
  const { user } = useAuth();
  const {
    fyAdmissions,
    dsyAdmissions,
    fyPageNumber,
    fyPageSize,
    fyTotalPages,
    fyTotalElements,
    dsyPageNumber,
    dsyPageSize,
    dsyTotalPages,
    dsyTotalElements,
    fetchFYAdmissions,
    fetchDSYAdmissions,
    goToFYPage,
    changeFYPageSize,
    goToDSYPage,
    changeDSYPageSize,
    loading
  } = useAdmission();

  const explicitPages = parseAccessPages(user?.accessPages);
  const hasExplicitAdmissionAccess = explicitPages?.includes('admissions');
  const canCreateAdmission = Boolean(user && (['ADMIN', 'PRINCIPAL', 'OFFICE_STAFF'].includes(user.role) || hasExplicitAdmissionAccess || canAccessPage(user, 'admissions')));
  const canUploadFYAdmissions = canAccessPage(user, 'bulk-fy-admission-upload');
  const canUploadDSYAdmissions = canAccessPage(user, 'bulk-dsy-admission-upload');
  const [activeTab, setActiveTab] = useState(canCreateAdmission ? 'new' : 'admitted'); // 'new' or 'admitted'
  const [admittedTab, setAdmittedTab] = useState('fy'); // 'fy' or 'dsy'
  const [filters, setFilters] = useState({
    name: '',
    program: '',
    status: '',
    documentStatus: '',
    admissionType: '',
    phone: '',
    sortPercentage: '',
    percentageMin: '',
    percentageMax: ''
  });
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportFields, setExportFields] = useState([
    'fullName',
    'studentEmail',
    'mobileNo',
    'program',
    'category',
    'status',
    'admissionType'
  ]);
  const [editSearchOpen, setEditSearchOpen] = useState(false);
  const [editSearchName, setEditSearchName] = useState('');
  const [editMatches, setEditMatches] = useState([]);
  const [editLoading, setEditLoading] = useState(false);
  const [editingAdmission, setEditingAdmission] = useState(null);
  const [uploadingAdmission, setUploadingAdmission] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);


  useEffect(() => {
    if (!canCreateAdmission && activeTab === 'new') {
      setActiveTab('admitted');
    }
  }, [canCreateAdmission, activeTab]);
  useEffect(() => {
    if (activeTab === 'admitted') {
      fetchFYAdmissions();
      fetchDSYAdmissions();
    }
  }, [activeTab, fetchFYAdmissions, fetchDSYAdmissions]);

  // Filter admitted students (status = PENDING shows all submitted admissions)
  // A student is "admitted" when their application is submitted and waiting for approval
  const baseAdmittedFY = fyAdmissions.filter(a => a.status === 'PENDING' || a.status === 'APPROVED');
  const baseAdmittedDSY = dsyAdmissions.filter(a => a.status === 'PENDING' || a.status === 'APPROVED');

  // Get document status for filtering
  const getDocumentStatus = (admission, requiredDocs) => {
    const pendingDocs = requiredDocs
      .filter(doc => !admission[doc.key])
      .map(doc => doc.label);
    return {
      pending: pendingDocs,
      isComplete: pendingDocs.length === 0
    };
  };

  const fyRequiredDocuments = [
    { key: 'domicileCertificatePath', label: 'Domicile/Nationality Certificate' },
    { key: 'tenthMarkSheetPath', label: '10th Mark Sheet' },
    { key: 'twelfthMarkSheetPath', label: '12th/ITI Mark Sheet' },
    { key: 'leavingCertificatePath', label: 'Leaving Certificate' },
    { key: 'casteCertificatePath', label: 'Caste Certificate' },
    { key: 'nonCreamyLayerCertificatePath', label: 'Non Creamy Layer Certificate' },
    { key: 'incomeCertificatePath', label: 'Income Certificate' },
    { key: 'defenceCertificatePath', label: 'Defence Certificate' },
    { key: 'aadhaarCardPath', label: 'Aadhaar Card' },
    { key: 'anyOtherDocumentPath', label: 'Any Other Document' },
    { key: 'studentPhotoPath', label: 'Student Signed Passport Size Photo' },
    { key: 'undertakingFormPath', label: 'Undertaking / Anti-ragging Form' }
  ];

  const dsyRequiredDocuments = [
    { key: 'domicileCertificatePath', label: 'Domicile/Nationality Certificate' },
    { key: 'sscMarkSheetPath', label: 'SSC Mark Sheet' },
    { key: 'hscMarkSheetPath', label: 'HSC Mark Sheet' },
    { key: 'casteCertificatePath', label: 'Caste Certificate' },
    { key: 'nonCreamyLayerCertificatePath', label: 'Non Creamy Layer Certificate' },
    { key: 'aadhaarCardPath', label: 'Aadhaar Card' },
    { key: 'studentPhotoPath', label: 'Student Signed Passport Size Photo' },
    { key: 'undertakingFormPath', label: 'Undertaking / Anti-ragging Form' }
  ];

  const getFullName = (admission) => `${admission.applicantFirstName || ''} ${admission.applicantMiddleName ? admission.applicantMiddleName + ' ' : ''}${admission.applicantLastName || ''}`.replace(/\s+/g, ' ').trim();

  // Apply filters
  const getFilteredAdmissions = (admissions, requiredDocs) => {
    return admissions.filter((a) => {
      const fullName = getFullName(a).toLowerCase();
      if (filters.name && !fullName.includes(filters.name.toLowerCase())) return false;
      if (filters.phone && !(a.mobileNo || '').includes(filters.phone)) return false;
      if (filters.program && a.program !== filters.program) return false;
      if (filters.status && a.status !== filters.status) return false;
      if (filters.admissionType && a.admissionType !== filters.admissionType) return false;
      if (filters.documentStatus) {
        const docStatus = getDocumentStatus(a, requiredDocs);
        if (filters.documentStatus === 'complete' && !docStatus.isComplete) return false;
        if (filters.documentStatus === 'pending' && docStatus.isComplete) return false;
      }
      if (filters.sortPercentage === 'range') {
        const percent = Number(a.bestOfFiveMarks || a.marksObtained || a.scienceMarks || a.previousCGPA || 0);
        if (filters.percentageMin !== '' && percent < Number(filters.percentageMin)) return false;
        if (filters.percentageMax !== '' && percent > Number(filters.percentageMax)) return false;
      }
      return true;
    });
  };

  const sortByPercentage = (rows) => {
    const sorted = [...rows];
    if (!filters.sortPercentage || filters.sortPercentage === 'range') return sorted;
    sorted.sort((a, b) => {
      const aPercent = Number(a.bestOfFiveMarks || a.marksObtained || a.scienceMarks || a.previousCGPA || 0);
      const bPercent = Number(b.bestOfFiveMarks || b.marksObtained || b.scienceMarks || b.previousCGPA || 0);
      return filters.sortPercentage === 'asc' ? aPercent - bPercent : bPercent - aPercent;
    });
    return sorted;
  };

  const admittedFY = sortByPercentage(getFilteredAdmissions(baseAdmittedFY, fyRequiredDocuments));
  const admittedDSY = sortByPercentage(getFilteredAdmissions(baseAdmittedDSY, dsyRequiredDocuments));
  const currentAdmissions = admittedTab === 'fy' ? admittedFY : admittedDSY;
  const canUploadCurrentAdmission = admittedTab === 'fy' ? canUploadFYAdmissions : canUploadDSYAdmissions;

  const handleAdmissionBulkUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setUploadingAdmission(true);
    try {
      const result = admittedTab === 'fy'
        ? await admissionService.bulkUploadFYAdmissions(file)
        : await admissionService.bulkUploadDSYAdmissions(file);
      setUploadResult({ ...result, type: admittedTab.toUpperCase() });
      if (admittedTab === 'fy') {
        await fetchFYAdmissions(fyPageNumber, fyPageSize);
      } else {
        await fetchDSYAdmissions(dsyPageNumber, dsyPageSize);
      }
    } catch (error) {
      alert(error.response?.data?.error || error.response?.data?.message || error.message || 'Unable to upload admissions');
    } finally {
      setUploadingAdmission(false);
    }
  };

  const handleDownloadAdmissionTemplate = async () => {
    try {
      if (admittedTab === 'fy') {
        await admissionService.downloadFYAdmissionBulkUploadTemplate();
      } else {
        await admissionService.downloadDSYAdmissionBulkUploadTemplate();
      }
    } catch (error) {
      alert(error.response?.data?.error || error.response?.data?.message || error.message || 'Unable to download admission template');
    }
  };

  const searchAdmissionsForEdit = async () => {
    setEditLoading(true);
    try {
      const [fyData, dsyData] = await Promise.all([
        admissionService.getAllFYAdmissions(0, 1000),
        admissionService.getAllDSYAdmissions(0, 1000)
      ]);
      const fyRows = Array.isArray(fyData?.content) ? fyData.content : (Array.isArray(fyData) ? fyData : []);
      const dsyRows = Array.isArray(dsyData?.content) ? dsyData.content : (Array.isArray(dsyData) ? dsyData : []);
      const query = editSearchName.trim().toLowerCase();
      setEditMatches([
        ...fyRows.map(item => ({ ...item, admissionKind: 'FY' })),
        ...dsyRows.map(item => ({ ...item, admissionKind: 'DSY' }))
      ].filter(item => getFullName(item).toLowerCase().includes(query)));
    } catch (error) {
      alert(error.response?.data?.error || error.message || 'Unable to search admissions');
    } finally {
      setEditLoading(false);
    }
  };

  if (editingAdmission) {
    return (
      <div>
        <button onClick={() => setEditingAdmission(null)} style={{ marginBottom: '18px', padding: '10px 14px', border: '1px solid #d0d5dd', borderRadius: '6px', background: '#fff', cursor: 'pointer' }}>
          Back to Admissions
        </button>
        {editingAdmission.admissionKind === 'FY' ? (
          <FYAdmissionForm editAdmission={editingAdmission} onSaved={async () => { await fetchFYAdmissions(); setEditingAdmission(null); }} />
        ) : (
          <DSYAdmissionForm editAdmission={editingAdmission} onSaved={async () => { await fetchDSYAdmissions(); setEditingAdmission(null); }} />
        )}
      </div>
    );
  }


  return (
    <div>
      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '0',
        marginBottom: '35px',
        borderBottom: '2px solid #e5e7eb'
      }}>
        {canCreateAdmission && <button
          onClick={() => setActiveTab('new')}
          style={{
            padding: '14px 28px',
            background: activeTab === 'new' ? '#ffffff' : 'transparent',
            color: activeTab === 'new' ? '#2563eb' : '#666',
            border: 'none',
            borderBottom: activeTab === 'new' ? '3px solid #2563eb' : 'none',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            position: 'relative',
            bottom: '-2px'
          }}
          onMouseOver={(e) => {
            if (activeTab !== 'new') {
              e.target.style.color = '#1a1a1a';
            }
          }}
          onMouseOut={(e) => {
            if (activeTab !== 'new') {
              e.target.style.color = '#666';
            }
          }}
        >
          ➕ New Admission
        </button>}
        {canCreateAdmission && <button
          onClick={() => setEditSearchOpen(true)}
          style={{
            padding: '14px 28px',
            background: 'transparent',
            color: '#666',
            border: 'none',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            position: 'relative',
            bottom: '-2px'
          }}
        >
          Edit Submitted Form
        </button>}
        <button
          onClick={() => setActiveTab('admitted')}
          style={{
            padding: '14px 28px',
            background: activeTab === 'admitted' ? '#ffffff' : 'transparent',
            color: activeTab === 'admitted' ? '#2563eb' : '#666',
            border: 'none',
            borderBottom: activeTab === 'admitted' ? '3px solid #2563eb' : 'none',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            position: 'relative',
            bottom: '-2px'
          }}
          onMouseOver={(e) => {
            if (activeTab !== 'admitted') {
              e.target.style.color = '#1a1a1a';
            }
          }}
          onMouseOut={(e) => {
            if (activeTab !== 'admitted') {
              e.target.style.color = '#666';
            }
          }}
        >
          ✓ Admitted Students
        </button>
      </div>

      {/* New Admission Tab */}
      {activeTab === 'new' && (
        <div>
          <AdmissionForm />
        </div>
      )}

      {/* Admitted Students Tab */}
      {activeTab === 'admitted' && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '25px'
          }}>
            <div>
              <h2 style={{
                color: '#1a1a1a',
                margin: '0 0 10px 0',
                fontSize: '28px',
                fontWeight: '700'
              }}>
                Admitted Students
              </h2>
              <p style={{
                color: '#666',
                margin: 0,
                fontSize: '14px',
                fontWeight: '500'
              }}>
                View all approved admissions by program type
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {canUploadCurrentAdmission && (
                <>
                  <button
                    type="button"
                    onClick={handleDownloadAdmissionTemplate}
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
                    Download {admittedTab.toUpperCase()} Format
                  </button>
                  <label
                    style={{
                      padding: '10px 18px',
                      background: uploadingAdmission ? '#e5e7eb' : '#ecfdf3',
                      color: uploadingAdmission ? '#667085' : '#067647',
                      border: '1px solid #abefc6',
                      borderRadius: '8px',
                      cursor: uploadingAdmission ? 'wait' : 'pointer',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}
                    title={`Upload ${admittedTab.toUpperCase()} admissions from Excel`}
                  >
                    {uploadingAdmission ? 'Uploading...' : `Upload ${admittedTab.toUpperCase()} Excel`}
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      disabled={uploadingAdmission}
                      onChange={handleAdmissionBulkUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                </>
              )}
              <button
                onClick={() => setExportModalOpen(true)}
                style={{
                  padding: '10px 18px',
                  background: '#e8f1ff',
                  color: '#175cd3',
                  border: '1px solid #b2ccff',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600'
                }}
              >
                Export Excel
              </button>
              <button
                onClick={() => setFilters({
                  name: '',
                  program: '',
                  status: '',
                  documentStatus: '',
                  admissionType: '',
                  phone: '',
                  sortPercentage: '',
                  percentageMin: '',
                  percentageMax: ''
                })}
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
                onMouseOver={(e) => { e.target.style.background = '#e0e0e0'; }}
                onMouseOut={(e) => { e.target.style.background = '#f0f0f0'; }}
              >
                ↺ Reset Filters
              </button>
              <button
                onClick={() => setAdmittedTab('fy')}
                style={{
                  padding: '10px 20px',
                  background: admittedTab === 'fy' ? '#2563eb' : '#f0f0f0',
                  color: admittedTab === 'fy' ? 'white' : '#333',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  if (admittedTab !== 'fy') {
                    e.target.style.background = '#e0e0e0';
                  }
                }}
                onMouseOut={(e) => {
                  if (admittedTab !== 'fy') {
                    e.target.style.background = '#f0f0f0';
                  }
                }}
              >
                FY Admissions ({admittedFY.length})
              </button>
              <button
                onClick={() => setAdmittedTab('dsy')}
                style={{
                  padding: '10px 20px',
                  background: admittedTab === 'dsy' ? '#2563eb' : '#f0f0f0',
                  color: admittedTab === 'dsy' ? 'white' : '#333',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  if (admittedTab !== 'dsy') {
                    e.target.style.background = '#e0e0e0';
                  }
                }}
                onMouseOut={(e) => {
                  if (admittedTab !== 'dsy') {
                    e.target.style.background = '#f0f0f0';
                  }
                }}
              >
                DSY Admissions ({admittedDSY.length})
              </button>
            </div>
          </div>

          {uploadResult && (
            <div style={{ marginBottom: '18px', padding: '14px', border: '1px solid #d0d5dd', borderRadius: '8px', background: '#f8fafc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start' }}>
                <div>
                  <strong>{uploadResult.type} Excel upload complete:</strong> {uploadResult.successCount || 0} saved, {uploadResult.failedCount || 0} failed out of {uploadResult.totalRows || 0} rows.
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
              ⏳ Loading admissions...
            </div>
          ) : admittedTab === 'fy' ? (
            <AdmittedListFY
              admissions={admittedFY}
              filters={filters}
              setFilters={setFilters}
              allAdmissions={baseAdmittedFY}
              pageNumber={fyPageNumber}
              totalPages={fyTotalPages}
              pageSize={fyPageSize}
              totalElements={fyTotalElements}
              onPageChange={goToFYPage}
              onPageSizeChange={changeFYPageSize}
              onRefresh={fetchFYAdmissions}
            />
          ) : (
            <AdmittedListDSY
              admissions={admittedDSY}
              filters={filters}
              setFilters={setFilters}
              allAdmissions={baseAdmittedDSY}
              pageNumber={dsyPageNumber}
              totalPages={dsyTotalPages}
              pageSize={dsyPageSize}
              totalElements={dsyTotalElements}
              onPageChange={goToDSYPage}
              onPageSizeChange={changeDSYPageSize}
              onRefresh={fetchDSYAdmissions}
            />
          )}
        </div>
      )}
      <ExportFieldChecklist
        open={exportModalOpen}
        fields={exportFields}
        setFields={setExportFields}
        mode="admissions"
        onClose={() => setExportModalOpen(false)}
        onExport={() => {
          exportAdmissionsToExcel(currentAdmissions, admittedTab, exportFields);
          setExportModalOpen(false);
        }}
      />
      {editSearchOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', width: 'min(720px, 92vw)', maxHeight: '82vh', overflow: 'auto', borderRadius: '8px', padding: '22px', boxShadow: '0 18px 45px rgba(0,0,0,0.2)' }}>
            <h2 style={{ margin: '0 0 14px' }}>Find Submitted Admission</h2>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <input value={editSearchName} onChange={(event) => setEditSearchName(event.target.value)} placeholder="Enter student name" style={{ flex: 1, padding: '10px', border: '1px solid #d0d5dd', borderRadius: '6px' }} />
              <button onClick={searchAdmissionsForEdit} disabled={!editSearchName.trim() || editLoading} style={{ padding: '10px 14px', background: '#175cd3', color: '#fff', border: 0, borderRadius: '6px', cursor: 'pointer' }}>{editLoading ? 'Searching...' : 'Search'}</button>
              <button onClick={() => { setEditSearchOpen(false); setEditMatches([]); setEditSearchName(''); }} style={{ padding: '10px 14px', background: '#f2f4f7', border: 0, borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
            </div>
            {editMatches.length > 0 && (
              <div style={{ border: '1px solid #e4e7ec', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: '#f8fafc' }}>
                    <tr>{['Name', 'Type', 'Department', 'Action'].map(header => <th key={header} style={{ textAlign: 'left', padding: '12px' }}>{header}</th>)}</tr>
                  </thead>
                  <tbody>
                    {editMatches.map(item => (
                      <tr key={`${item.admissionKind}-${item.id}`}>
                        <td style={{ padding: '12px', borderTop: '1px solid #eef2f6' }}>{getFullName(item)}</td>
                        <td style={{ padding: '12px', borderTop: '1px solid #eef2f6' }}>{item.admissionKind}</td>
                        <td style={{ padding: '12px', borderTop: '1px solid #eef2f6' }}>{item.program || '-'}</td>
                        <td style={{ padding: '12px', borderTop: '1px solid #eef2f6' }}>
                          <button onClick={() => { setEditingAdmission(item); setEditSearchOpen(false); }} style={{ padding: '8px 12px', background: '#175cd3', color: '#fff', border: 0, borderRadius: '6px', cursor: 'pointer' }}>Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {editSearchName && !editLoading && editMatches.length === 0 && <p style={{ color: '#667085' }}>No matching submitted forms found yet.</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmissionPage;






