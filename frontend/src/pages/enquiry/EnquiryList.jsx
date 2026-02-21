import React from 'react';
import { formatDate } from '../../utils/formatters';

const EnquiryList = ({ enquiries, onDelete }) => {
  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#ffc107',
      'Follow-up': '#17a2b8',
      'Converted': '#28a745',
      'Lost': '#dc3545'
    };
    return colors[status] || '#999';
  };

  const getFullName = (enquiry) => {
    return `${enquiry.firstName} ${enquiry.middleName ? enquiry.middleName + ' ' : ''}${enquiry.lastName}`.trim();
  };

  const getBranches = (enquiry) => {
    if (!enquiry.branchesInterested || enquiry.branchesInterested.length === 0) return '—';
    return enquiry.branchesInterested
      .sort((a, b) => a.priority - b.priority)
      .map(b => b.branch)
      .join(', ');
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '15px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    }}>
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
            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#333' }}>Admission For</th>
            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#333' }}>Branches Interested</th>
            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#333' }}>Location</th>
            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#333' }}>Category</th>
            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#333' }}>Status</th>
            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#333' }}>Date</th>
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
                >
                  🗑️ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EnquiryList;
