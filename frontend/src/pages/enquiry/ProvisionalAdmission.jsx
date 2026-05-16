import React, { useEffect, useState } from 'react';
import { getProvisionalEnquiries } from '../../services/enquiryService';

const ProvisionalAdmission = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setRows(await getProvisionalEnquiries());
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Unable to load provisional admissions');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Provisional Admission</h2>
      {error && <div style={{ color: '#b91c1c', marginBottom: '14px' }}>{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
            <thead style={{ background: '#f8fafc' }}>
              <tr>
                {['Seat No', 'Name', 'Email', 'Mobile', 'Admission For', 'Category', 'Location', 'Status'].map(header => (
                  <th key={header} style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #e5e7eb' }}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id}>
                  <td style={cell}>{row.sscSeatNo || '-'}</td>
                  <td style={cell}>{[row.firstName, row.middleName, row.lastName].filter(Boolean).join(' ')}</td>
                  <td style={cell}>{row.email}</td>
                  <td style={cell}>{row.personalMobileNumber}</td>
                  <td style={cell}>{row.admissionFor}</td>
                  <td style={cell}>{row.category}</td>
                  <td style={cell}>{row.location === 'Other' ? row.otherLocation : row.location}</td>
                  <td style={cell}>{row.status}</td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td style={cell} colSpan="8">No provisional admissions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const cell = { padding: '12px', borderBottom: '1px solid #eef2f7', fontSize: '14px' };

export default ProvisionalAdmission;
