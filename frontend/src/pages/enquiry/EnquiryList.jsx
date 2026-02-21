import React, { useState } from 'react';
import { formatDate } from '../../utils/formatters';
import enquiryService from '../../services/enquiryService';
import {
  locationOptions,
  categoryOptions,
  branchOptions,
  admissionForOptions
} from '../../data/mockEnquiries';

const EnquiryList = ({ enquiries, onDelete, onStatusUpdate, filters, setFilters, allEnquiries }) => {
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');

  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#ffc107',
      'Success': '#28a745'
    };
    return colors[status] || '#999';
  };

  const getFullName = (enquiry) => {
    return `${enquiry.firstName} ${enquiry.middleName ? enquiry.middleName + ' ' : ''}${enquiry.lastName}`.trim();
  };

  const getBranches = (enquiry) => {
    try {
      let branches = enquiry.branchesInterested;
      
      // Parse if it's a JSON string
      if (typeof branches === 'string') {
        branches = JSON.parse(branches);
      }
      
      if (!branches || !Array.isArray(branches) || branches.length === 0) return '—';
      
      return branches
        .sort((a, b) => a.priority - b.priority)
        .map(b => `${b.branch} (${getOrdinal(b.priority)})`)
        .join(', ');
    } catch (e) {
      console.error('Error parsing branches:', e);
      return '—';
    }
  };

  const handleStatusUpdate = async (enquiryId, newStatus) => {
    setUpdatingId(enquiryId);
    setError('');
    try {
      await enquiryService.updateStatus(enquiryId, newStatus);
      if (onStatusUpdate) {
        onStatusUpdate(enquiryId, newStatus);
      }
    } catch (err) {
      setError(`Failed to update status: ${err.message}`);
      console.error('Error updating status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  // compute branch priority options dynamically
  const maxPriority = (allEnquiries || enquiries).reduce((max, e) => {
    let branches = e.branchesInterested;
    if (typeof branches === 'string') {
      try { branches = JSON.parse(branches); } catch { branches = []; }
    }
    const localMax = branches.reduce((m, b) => Math.max(m, b.priority || 0), 0);
    return Math.max(max, localMax);
  }, 0);
  const priorityOptions = Array.from({ length: maxPriority }, (_, i) => String(i + 1));

  const handleFilterChange = (field) => (e) => {
    const value = e.target.value;
    setFilters && setFilters(prev => ({ ...prev, [field]: value }));
  };

  // helper for ordinal text
  const getOrdinal = (num) => {
    if (num === 1) return '1st';
    if (num === 2) return '2nd';
    if (num === 3) return '3rd';
    return num + 'th';
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '15px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    }}>
      {error && (
        <div style={{
          padding: '15px',
          background: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '8px',
          color: '#721c24',
          margin: '15px'
        }}>
          {error}
        </div>
      )}
      <table style={{
        width: '100%',
        borderCollapse: 'collapse'
      }}>
        <thead style={{
          background: '#f8f9fa',
          borderBottom: '2px solid #dee2e6'
        }}>
          <tr>
            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#333' }}>Name</th>
            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#333' }}>Email</th>
            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#333' }}>Phone</th>
            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#333' }}>
              Admission For
              {filters && <div style={{ marginTop: '8px' }}>
                <select value={filters.admissionFor} onChange={handleFilterChange('admissionFor')} style={{ fontSize: '0.85em', padding: '4px' }}>
                  <option value="">All</option>
                  {admissionForOptions.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
                </select>
              </div>}
            </th>
            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#333' }}>
              Branches Interested
              {filters && <div style={{ marginTop: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                <select value={filters.branch} onChange={handleFilterChange('branch')} style={{ fontSize: '0.8em', padding: '4px' }}>
                  <option value="">Branch</option>
                  {branchOptions.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
                </select>
                <select value={filters.branchPriority} onChange={handleFilterChange('branchPriority')} style={{ fontSize: '0.8em', padding: '4px' }}>
                  <option value="">Pref</option>
                  {priorityOptions.map(p => (<option key={p} value={p}>{getOrdinal(parseInt(p))}</option>))}
                </select>
              </div>}
            </th>
            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#333' }}>
              Location
              {filters && <div style={{ marginTop: '8px' }}>
                <select value={filters.location} onChange={handleFilterChange('location')} style={{ fontSize: '0.85em', padding: '4px' }}>
                  <option value="">All</option>
                  {locationOptions.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
                </select>
              </div>}
            </th>
            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#333' }}>
              Category
              {filters && <div style={{ marginTop: '8px' }}>
                <select value={filters.category} onChange={handleFilterChange('category')} style={{ fontSize: '0.85em', padding: '4px' }}>
                  <option value="">All</option>
                  {categoryOptions.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
                </select>
              </div>}
            </th>
            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#333' }}>
              Status
              {filters && <div style={{ marginTop: '8px' }}>
                <select value={filters.status} onChange={handleFilterChange('status')} style={{ fontSize: '0.85em', padding: '4px' }}>
                  <option value="">All</option>
                  <option>Pending</option>
                  <option>Success</option>
                  <option>Follow-up</option>
                  <option>Converted</option>
                  <option>Lost</option>
                </select>
              </div>}
            </th>
            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#333' }}>
              Date
              {filters && <div style={{ marginTop: '8px' }}>
                <input type="date" value={filters.date} onChange={handleFilterChange('date')} style={{ fontSize: '0.85em', padding: '4px' }} />
              </div>}
            </th>
            <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600', color: '#333' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {enquiries.map((enquiry, index) => (
            <tr
              key={enquiry.id}
              style={{
                borderBottom: '1px solid #dee2e6',
                background: index % 2 === 0 ? '#ffffff' : '#f8f9fa',
                transition: 'background 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#e8f4f8';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = index % 2 === 0 ? '#ffffff' : '#f8f9fa';
              }}
            >
              <td style={{ padding: '15px' }}>
                <strong>{getFullName(enquiry)}</strong>
              </td>
              <td style={{ padding: '15px', color: '#666', fontSize: '0.9em' }}>
                {enquiry.email}
              </td>
              <td style={{ padding: '15px', color: '#666', fontSize: '0.9em' }}>
                {enquiry.personalMobileNumber}
              </td>
              <td style={{ padding: '15px', color: '#666', fontSize: '0.9em' }}>
                {enquiry.admissionFor || '—'}
              </td>
              <td style={{ padding: '15px', color: '#666', fontSize: '0.85em' }}>
                {getBranches(enquiry)}
              </td>
              <td style={{ padding: '15px', color: '#666', fontSize: '0.9em' }}>
                {enquiry.location === 'Other' ? enquiry.otherLocation : enquiry.location}
              </td>
              <td style={{ padding: '15px', color: '#666', fontSize: '0.9em' }}>
                {enquiry.category || '—'}
              </td>
              <td style={{ padding: '15px' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '5px 12px',
                  background: getStatusColor(enquiry.status),
                  color: 'white',
                  borderRadius: '20px',
                  fontSize: '0.85em',
                  fontWeight: '500'
                }}>
                  {enquiry.status}
                </span>
              </td>
              <td style={{ padding: '15px', color: '#666', fontSize: '0.9em' }}>
                {formatDate(enquiry.enquiryDate)}
              </td>
              <td style={{ padding: '15px', textAlign: 'center' }}>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
                  {enquiry.status === 'Pending' && (
                    <button
                      onClick={() => handleStatusUpdate(enquiry.id, 'Success')}
                      disabled={updatingId === enquiry.id}
                      style={{
                        padding: '6px 12px',
                        background: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: updatingId === enquiry.id ? 'not-allowed' : 'pointer',
                        fontSize: '0.85em',
                        transition: 'background 0.3s ease',
                        fontFamily: 'inherit',
                        opacity: updatingId === enquiry.id ? 0.7 : 1
                      }}
                      onMouseOver={(e) => {
                        if (updatingId !== enquiry.id) {
                          e.target.style.background = '#218838';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (updatingId !== enquiry.id) {
                          e.target.style.background = '#28a745';
                        }
                      }}
                      title="Mark as Success"
                    >
                      ✓ Success
                    </button>
                  )}
                  {enquiry.status === 'Success' && (
                    <button
                      onClick={() => handleStatusUpdate(enquiry.id, 'Pending')}
                      disabled={updatingId === enquiry.id}
                      style={{
                        padding: '6px 12px',
                        background: '#ffc107',
                        color: '#333',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: updatingId === enquiry.id ? 'not-allowed' : 'pointer',
                        fontSize: '0.85em',
                        transition: 'background 0.3s ease',
                        fontFamily: 'inherit',
                        opacity: updatingId === enquiry.id ? 0.7 : 1
                      }}
                      onMouseOver={(e) => {
                        if (updatingId !== enquiry.id) {
                          e.target.style.background = '#e0a800';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (updatingId !== enquiry.id) {
                          e.target.style.background = '#ffc107';
                        }
                      }}
                      title="Mark as Pending"
                    >
                      ⟳ Pending
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(enquiry.id)}
                    style={{
                      padding: '6px 12px',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.85em',
                      transition: 'background 0.3s ease',
                      fontFamily: 'inherit'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = '#c82333';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = '#dc3545';
                    }}
                    title="Delete enquiry"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EnquiryList;
