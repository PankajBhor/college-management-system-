import React, { useEffect, useState } from 'react';
import ColumnVisibilityMenu from '../../components/ColumnVisibilityMenu';
import { getProvisionalEnquiries } from '../../services/enquiryService';
import { exportProvisionalAdmissionsToExcel } from '../../utils/exportUtils';
import { formatDate } from '../../utils/formatters';
import { buildBranchPriorityFields, getBranchByPriority } from '../../utils/branchPreferences';

const getColumns = (rows = []) => [
  { key: 'sscSeatNo', label: 'Seat No', render: row => row.sscSeatNo || '-' },
  { key: 'fullName', label: 'Name', render: row => [row.firstName, row.middleName, row.lastName].filter(Boolean).join(' ') },
  { key: 'email', label: 'Email', render: row => row.email },
  { key: 'personalMobileNumber', label: 'Mobile', render: row => row.personalMobileNumber },
  { key: 'admissionFor', label: 'Admission For', render: row => row.admissionFor },
  { key: 'category', label: 'Category', render: row => row.category },
  { key: 'location', label: 'Location', render: row => row.location === 'Other' ? row.otherLocation : row.location },
  ...buildBranchPriorityFields(rows).map(field => ({
    ...field,
    render: row => getBranchByPriority(row, field.priority) || '-'
  })),
  { key: 'referenceFaculty', label: 'Reference Faculty', render: row => row.referenceFaculty || '-' },
  { key: 'provisionalAdmissionDate', label: 'Provisional Date', render: row => formatDate(row.provisionalAdmissionDate) },
  { key: 'status', label: 'Status', render: row => row.status }
];

const ProvisionalAdmission = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [nameSearch, setNameSearch] = useState('');
  const columns = getColumns(rows);
  const columnKeys = columns.map(column => column.key).join('|');
  const [visibleColumns, setVisibleColumns] = useState(getColumns().map(column => column.key));

  useEffect(() => {
    setVisibleColumns(prev => {
      const nextKeys = columnKeys.split('|').filter(Boolean);
      const keptKeys = prev.filter(key => nextKeys.includes(key));
      const addedKeys = nextKeys.filter(key => !prev.includes(key));
      return [...keptKeys, ...addedKeys];
    });
  }, [columnKeys]);

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

  const filteredRows = rows.filter(row => [row.firstName, row.middleName, row.lastName].filter(Boolean).join(' ').toLowerCase().includes(nameSearch.toLowerCase()));

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
      <input
        type="search"
        value={nameSearch}
        onChange={(event) => setNameSearch(event.target.value)}
        placeholder="Search by name"
        style={{ width: '260px', maxWidth: '100%', padding: '10px', border: '1px solid #d0d5dd', borderRadius: '8px', marginBottom: '14px' }}
      />
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
              {filteredRows.map(row => (
                <tr key={row.id}>
                  {columns.filter(column => visibleColumns.includes(column.key)).map(column => (
                    <td key={column.key} style={cell}>{column.render(row)}</td>
                  ))}
                </tr>
              ))}
              {!filteredRows.length && (
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
