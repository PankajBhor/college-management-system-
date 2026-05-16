import React, { useEffect, useState } from 'react';
import ColumnVisibilityMenu from '../../components/ColumnVisibilityMenu';
import { getProvisionalEnquiries } from '../../services/enquiryService';
import { exportProvisionalAdmissionsToExcel } from '../../utils/exportUtils';

const columns = [
  { key: 'sscSeatNo', label: 'Seat No', render: row => row.sscSeatNo || '-' },
  { key: 'fullName', label: 'Name', render: row => [row.firstName, row.middleName, row.lastName].filter(Boolean).join(' ') },
  { key: 'email', label: 'Email', render: row => row.email },
  { key: 'personalMobileNumber', label: 'Mobile', render: row => row.personalMobileNumber },
  { key: 'admissionFor', label: 'Admission For', render: row => row.admissionFor },
  { key: 'category', label: 'Category', render: row => row.category },
  { key: 'location', label: 'Location', render: row => row.location === 'Other' ? row.otherLocation : row.location },
  { key: 'branchPriority1', label: 'Priority 1', render: row => row.branchPriority1 || '-' },
  { key: 'branchPriority2', label: 'Priority 2', render: row => row.branchPriority2 || '-' },
  { key: 'branchPriority3', label: 'Priority 3', render: row => row.branchPriority3 || '-' },
  { key: 'branchPriority4', label: 'Priority 4', render: row => row.branchPriority4 || '-' },
  { key: 'referenceFaculty', label: 'Reference Faculty', render: row => row.referenceFaculty || '-' },
  { key: 'status', label: 'Status', render: row => row.status }
];

const ProvisionalAdmission = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [visibleColumns, setVisibleColumns] = useState(columns.map(column => column.key));

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
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
        <h2 style={{ marginTop: 0 }}>Provisional Admission</h2>
        <button
          type="button"
          onClick={() => exportProvisionalAdmissionsToExcel(rows, visibleColumns)}
          style={{ padding: '10px 16px', border: '1px solid #b2ccff', borderRadius: '8px', background: '#e8f1ff', color: '#175cd3', fontWeight: 700, cursor: 'pointer' }}
        >
          Export Excel
        </button>
      </div>
      <ColumnVisibilityMenu columns={columns} visibleColumns={visibleColumns} setVisibleColumns={setVisibleColumns} />
      {error && <div style={{ color: '#b91c1c', marginBottom: '14px' }}>{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
            <thead style={{ background: '#f8fafc' }}>
              <tr>
                {columns.filter(column => visibleColumns.includes(column.key)).map(column => (
                  <th key={column.key} style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #e5e7eb' }}>{column.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id}>
                  {columns.filter(column => visibleColumns.includes(column.key)).map(column => (
                    <td key={column.key} style={cell}>{column.render(row)}</td>
                  ))}
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td style={cell} colSpan={Math.max(1, visibleColumns.length)}>No provisional admissions found.</td>
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
