import React, { useState } from 'react';
import { formatDate } from '../../utils/formatters';

const AdmittedListFY = ({ admissions, filters, setFilters, allAdmissions }) => {
  const [selectedAdmissionId, setSelectedAdmissionId] = useState(null);

  // Clean program name - remove number prefix
  const cleanProgramName = (program) => {
    if (!program) return '';
    // Remove "2. " or similar patterns at the beginning
    return program.replace(/^\d+\.\s*/, '');
  };

  const handleFilterChange = (field) => (e) => {
    const value = e.target.value;
    setFilters && setFilters(prev => ({ ...prev, [field]: value }));
  };

  // Get unique programs for filter
  const uniquePrograms = [...new Set((allAdmissions || admissions).map(a => a.program))].filter(Boolean);

  // FY required documents
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

  const getPendingDocuments = (admission) => {
    return fyRequiredDocuments
      .filter(doc => !admission[doc.key])
      .map(doc => doc.label);
  };

  const getDocumentStatus = (admission) => {
    const pendingDocs = getPendingDocuments(admission);
    const totalRequired = fyRequiredDocuments.length;
    const submitted = totalRequired - pendingDocs.length;
    
    return {
      submitted,
      total: totalRequired,
      pending: pendingDocs,
      isComplete: pendingDocs.length === 0
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return '#10b981';
      case 'PENDING':
        return '#f59e0b';
      case 'REJECTED':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getFullName = (admission) => {
    return `${admission.applicantFirstName} ${admission.applicantMiddleName ? admission.applicantMiddleName + ' ' : ''}${admission.applicantLastName}`.trim();
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      border: '1px solid #f0f0f0'
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse'
      }}>
        <thead style={{
          background: '#f8f9fa',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <tr>
            <th style={{ padding: '16px 15px', textAlign: 'center', fontWeight: '600', color: '#1a1a1a', fontSize: '13px', width: '50px' }}>S.No</th>
            <th style={{ padding: '16px 15px', textAlign: 'left', fontWeight: '600', color: '#1a1a1a', fontSize: '13px' }}>
              Name
              {filters && <div style={{ marginTop: '8px' }}>
                <input type="text" placeholder="Search..." value={filters.name} onChange={handleFilterChange('name')} style={{ fontSize: '0.85em', padding: '4px', width: '100%' }} />
              </div>}
            </th>
            <th style={{ padding: '16px 15px', textAlign: 'left', fontWeight: '600', color: '#1a1a1a', fontSize: '13px' }}>Email</th>
            <th style={{ padding: '16px 15px', textAlign: 'left', fontWeight: '600', color: '#1a1a1a', fontSize: '13px' }}>Phone</th>
            <th style={{ padding: '16px 15px', textAlign: 'left', fontWeight: '600', color: '#1a1a1a', fontSize: '13px' }}>
              Program
              {filters && <div style={{ marginTop: '8px' }}>
                <select value={filters.program} onChange={handleFilterChange('program')} style={{ fontSize: '0.85em', padding: '4px' }}>
                  <option value="">All</option>
                  {uniquePrograms.map(prog => (<option key={prog} value={prog}>{cleanProgramName(prog)}</option>))}
                </select>
              </div>}
            </th>
            <th style={{ padding: '16px 15px', textAlign: 'left', fontWeight: '600', color: '#1a1a1a', fontSize: '13px' }}>Admission Type</th>
            <th style={{ padding: '16px 15px', textAlign: 'left', fontWeight: '600', color: '#1a1a1a', fontSize: '13px' }}>
              Status
              {filters && <div style={{ marginTop: '8px' }}>
                <select value={filters.status} onChange={handleFilterChange('status')} style={{ fontSize: '0.85em', padding: '4px' }}>
                  <option value="">All</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>}
            </th>
            <th style={{ padding: '16px 15px', textAlign: 'center', fontWeight: '600', color: '#1a1a1a', fontSize: '13px' }}>
              Documents
              {filters && <div style={{ marginTop: '8px' }}>
                <select value={filters.documentStatus} onChange={handleFilterChange('documentStatus')} style={{ fontSize: '0.85em', padding: '4px' }}>
                  <option value="">All</option>
                  <option value="complete">Complete</option>
                  <option value="pending">Pending</option>
                </select>
              </div>}
            </th>
          </tr>
        </thead>
        <tbody>
          {admissions.map((admission, index) => {
            const docStatus = getDocumentStatus(admission);

            return (
              <tr
                key={admission.id}
                style={{
                  borderBottom: '1px solid #f0f0f0',
                  background: index % 2 === 0 ? '#ffffff' : '#fafafa',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f0f0';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#fafafa';
                }}
              >
                <td style={{ padding: '14px 15px', textAlign: 'center', fontSize: '13px', color: '#666' }}>
                  {index + 1}
                </td>
                <td style={{ padding: '14px 15px', fontSize: '13px', color: '#1a1a1a', fontWeight: '500' }}>
                  {getFullName(admission)}
                </td>
                <td style={{ padding: '14px 15px', fontSize: '13px', color: '#666' }}>
                  {admission.studentEmail}
                </td>
                <td style={{ padding: '14px 15px', fontSize: '13px', color: '#666' }}>
                  {admission.mobileNo}
                </td>
                <td style={{ padding: '14px 15px', fontSize: '13px', color: '#666' }}>
                  {cleanProgramName(admission.program)}
                </td>
                <td style={{ padding: '14px 15px', fontSize: '13px', color: '#666' }}>
                  {admission.admissionType}
                </td>
                <td style={{ padding: '14px 15px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '6px 12px',
                    background: getStatusColor(admission.status),
                    color: 'white',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}>
                    {admission.status || 'PENDING'}
                  </span>
                </td>
                <td style={{ padding: '14px 15px', textAlign: 'center' }}>
                  <div
                    style={{
                      position: 'relative',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '6px 12px',
                        background: docStatus.isComplete ? '#d1fae5' : '#fef3c7',
                        color: docStatus.isComplete ? '#065f46' : '#92400e',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: docStatus.isComplete ? 'default' : 'pointer'
                      }}
                      onClick={() => !docStatus.isComplete && setSelectedAdmissionId(admission.id)}
                    >
                      {docStatus.isComplete ? '✓ Completed' : '⏳ Pending'}
                    </span>
                    
                    {/* Document count badge */}
                    <span style={{
                      display: 'inline-block',
                      background: '#e5e7eb',
                      color: '#374151',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      fontSize: '11px',
                      fontWeight: '600',
                      lineHeight: '28px',
                      textAlign: 'center',
                      title: `${docStatus.submitted}/${docStatus.total} documents submitted`
                    }}>
                      {docStatus.submitted}/{docStatus.total}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {admissions.length === 0 && (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          color: '#666'
        }}>
          <p style={{ fontSize: '1.1em', margin: 0 }}>📭 No admitted students yet</p>
        </div>
      )}

      {/* Modal for document details */}
      {selectedAdmissionId && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}
        onClick={() => setSelectedAdmissionId(null)}
        >
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const selectedAdmission = (allAdmissions || admissions).find(a => a.id === selectedAdmissionId);
              const docStatus = selectedAdmission ? getDocumentStatus(selectedAdmission) : null;
              
              return (
                <>
                  <h2 style={{ margin: '0 0 16px 0', fontSize: '1.5em', color: '#1f2937' }}>
                    Required Documents
                  </h2>
                  <div style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>
                    <p style={{ margin: 0 }}>
                      <strong>Student:</strong> {selectedAdmission ? getFullName(selectedAdmission) : ''}
                    </p>
                    <p style={{ margin: '8px 0 0 0' }}>
                      <strong>Submitted:</strong> {docStatus?.submitted}/{docStatus?.total}
                    </p>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1em', color: '#374151' }}>
                      Pending Documents ({docStatus?.pending.length}):
                    </h3>
                    {docStatus?.pending.length > 0 ? (
                      <ul style={{
                        margin: 0,
                        paddingLeft: '20px',
                        listStyle: 'disc'
                      }}>
                        {docStatus?.pending.map((doc, i) => (
                          <li key={i} style={{ marginBottom: '8px', color: '#555' }}>
                            {doc}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ color: '#10b981', fontWeight: '500', margin: 0 }}>
                        ✓ All documents submitted
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedAdmissionId(null)}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#2563eb'}
                    onMouseLeave={(e) => e.target.style.background = '#3b82f6'}
                  >
                    Close
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmittedListFY;
