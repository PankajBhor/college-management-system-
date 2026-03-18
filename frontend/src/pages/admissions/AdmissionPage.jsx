import React, { useState, useEffect } from 'react';
import { useAdmission } from '../../hooks/useAdmission';
import { useAuth } from '../../hooks/useAuth';
import AdmissionForm from './AdmissionForm';
import AdmittedListFY from './AdmittedListFY';
import AdmittedListDSY from './AdmittedListDSY';

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

  const [activeTab, setActiveTab] = useState('new'); // 'new' or 'admitted'
  const [admittedTab, setAdmittedTab] = useState('fy'); // 'fy' or 'dsy'
  const [filters, setFilters] = useState({
    name: '',
    program: '',
    status: '',
    documentStatus: ''
  });

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
    { key: 'anyOtherDocumentPath', label: 'Any Other Document' }
  ];

  const dsyRequiredDocuments = [
    { key: 'domicileCertificatePath', label: 'Domicile/Nationality Certificate' },
    { key: 'sscMarkSheetPath', label: 'SSC Mark Sheet' },
    { key: 'hscMarkSheetPath', label: 'HSC Mark Sheet' },
    { key: 'casteCertificatePath', label: 'Caste Certificate' },
    { key: 'nonCreamyLayerCertificatePath', label: 'Non Creamy Layer Certificate' },
    { key: 'aadhaarCardPath', label: 'Aadhaar Card' }
  ];

  // Apply filters
  const getFilteredAdmissions = (admissions, requiredDocs) => {
    return admissions.filter((a) => {
      if (filters.name && a.name && !a.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
      if (filters.program && a.program !== filters.program) return false;
      if (filters.status && a.status !== filters.status) return false;
      if (filters.documentStatus) {
        const docStatus = getDocumentStatus(a, requiredDocs);
        if (filters.documentStatus === 'complete' && !docStatus.isComplete) return false;
        if (filters.documentStatus === 'pending' && docStatus.isComplete) return false;
      }
      return true;
    });
  };

  const admittedFY = getFilteredAdmissions(baseAdmittedFY, fyRequiredDocuments);
  const admittedDSY = getFilteredAdmissions(baseAdmittedDSY, dsyRequiredDocuments);

  const canManageAdmissions = user && (user.role === 'ADMISSION_STAFF' || user.role === 'PRINCIPAL' || user.role === 'OFFICE_STAFF');

  return (
    <div>
      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '0',
        marginBottom: '35px',
        borderBottom: '2px solid #e5e7eb'
      }}>
        <button
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
        </button>
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
              <button
                onClick={() => setFilters({
                  name: '',
                  program: '',
                  status: '',
                  documentStatus: ''
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
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AdmissionPage;
