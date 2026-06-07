import React, { useEffect, useState } from 'react';
import { formatDate } from '../../utils/formatters';
import enquiryService from '../../services/enquiryService';
import Pagination from '../../components/Pagination';
import ColumnVisibilityMenu from '../../components/ColumnVisibilityMenu';
import { getOptionValue } from '../../services/lookupService';
import { buildBranchPriorityFields, getBranchByPriority } from '../../utils/branchPreferences';

const parseMerit = (enquiry = {}) => {
  if (enquiry.merit && typeof enquiry.merit === 'object') return enquiry.merit;
  if (!enquiry.meritDetails) return {};
  if (typeof enquiry.meritDetails === 'object') return enquiry.meritDetails;
  try {
    return JSON.parse(enquiry.meritDetails);
  } catch {
    return {};
  }
};

const DEFAULT_VISIBLE_COLUMNS = new Set([
  'sNo',
  'name',
  'email',
  'phone',
  'sscSeatNo',
  'class10Merit',
  'class12Merit',
  'admissionFor',
  'location',
  'category',
  'referenceFaculty',
  'provisionalAdmission',
  'provisionalAdmissionDate',
  'status',
  'date'
]);

const isDefaultVisibleColumn = (key) => DEFAULT_VISIBLE_COLUMNS.has(key) || key.startsWith('branchPriority');

const EnquiryList = ({
  enquiries,
  onDelete,
  onStatusUpdate,
  filters,
  setFilters,
  allEnquiries,
  pageNumber = 0,
  totalPages = 1,
  pageSize = 10,
  totalElements = 0,
  onPageChange,
  onPageSizeChange,
  lookupOptions = {},
  readOnly = false
}) => {
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');
  const branchOptions = lookupOptions.branches || [];
  const branchPriorityColumns = buildBranchPriorityFields(allEnquiries || enquiries, branchOptions);
  const columns = [
    { key: 'sNo', label: 'S.No' },
    { key: 'name', label: 'Name' },
    { key: 'firstName', label: 'First Name' },
    { key: 'middleName', label: 'Middle Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Personal Mobile' },
    { key: 'guardianMobileNumber', label: 'Guardian Mobile' },
    { key: 'sscSeatNo', label: 'SSC Seat No' },
    { key: 'class10Merit', label: 'Class 10 Merit' },
    { key: 'class12Merit', label: 'Class 12 Merit' },
    { key: 'itiMerit', label: 'ITI Merit' },
    { key: 'otherMerit', label: 'Other Merit' },
    { key: 'otherMeritOf', label: 'Other Marks Of' },
    { key: 'admissionFor', label: 'Admission For' },
    ...branchPriorityColumns,
    { key: 'location', label: 'Location' },
    { key: 'otherLocation', label: 'Other Location' },
    { key: 'category', label: 'Category' },
    { key: 'referenceFaculty', label: 'Reference Faculty' },
    { key: 'dteRegistrationDone', label: 'DTE Registration' },
    { key: 'emailEnabled', label: 'Email Enabled' },
    { key: 'provisionalAdmission', label: 'Provisional Admission' },
    { key: 'provisionalAdmissionDate', label: 'Provisional Admission Date' },
    { key: 'status', label: 'Status' },
    { key: 'date', label: 'Enquiry Date' }
  ];
  const [visibleColumns, setVisibleColumns] = useState(columns.filter(column => isDefaultVisibleColumn(column.key)).map(column => column.key));
  const columnKeys = columns.map(column => column.key).join('|');
  const locationOptions = [
    ...(lookupOptions.locations || []).map(getOptionValue),
    ...(allEnquiries || enquiries).map(item => item.location === 'Other' ? item.otherLocation : item.location)
  ].filter(Boolean).filter((value, index, list) => list.indexOf(value) === index);
  const categoryOptions = lookupOptions.categories || [];
  const admissionForOptions = lookupOptions.admissionTypes || [];
  const statusOptions = lookupOptions.statuses || [];

  useEffect(() => {
    setVisibleColumns(prev => {
      const nextKeys = columnKeys.split('|').filter(Boolean);
      const keptKeys = prev.filter(key => nextKeys.includes(key));
      const addedKeys = nextKeys.filter(key => !prev.includes(key) && isDefaultVisibleColumn(key));
      return [...keptKeys, ...addedKeys];
    });
  }, [columnKeys]);

  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#e8e8e8',
      'Success': '#e8e8e8'
    };
    return colors[status] || '#f0f0f0';
  };

  const hiddenColumnCss = columns
    .map((column, index) => visibleColumns.includes(column.key) ? '' : `.enquiry-data-table th:nth-child(${index + 1}), .enquiry-data-table td:nth-child(${index + 1}) { display: none; }`)
    .filter(Boolean)
    .join('\n');

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
  const maxPriority = branchPriorityColumns.length || (allEnquiries || enquiries).reduce((max, e) => {
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
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      border: '1px solid #f0f0f0'
    }}>
      {error && (
        <div style={{
          padding: '15px 20px',
          background: '#fee7e7',
          border: '1px solid #f5a0a0',
          borderRadius: '0',
          color: '#a51e1e',
          margin: 0,
          fontSize: '14px',
          fontWeight: '500'
        }}>
          ⚠️ {error}
        </div>
      )}
      <style>{hiddenColumnCss}</style>
      <ColumnVisibilityMenu columns={columns} visibleColumns={visibleColumns} setVisibleColumns={setVisibleColumns} />
      <div style={{ overflow: 'auto', maxHeight: '70vh', scrollbarGutter: 'stable' }}>
      <table className="enquiry-data-table" style={{
        width: '100%',
        minWidth: '1150px',
        borderCollapse: 'collapse'
      }}>
        <thead style={{
          background: '#f8f9fa',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <tr>
            <th style={{ padding: '16px 15px', textAlign: 'center', fontWeight: '600', color: '#1a1a1a', fontSize: '13px', letterSpacing: '0.3px', width: '50px' }}>S.No</th>
            <th style={{ padding: '16px 15px', textAlign: 'left', fontWeight: '600', color: '#1a1a1a', fontSize: '13px', letterSpacing: '0.3px' }}>
              Name
              {filters && <div style={{ marginTop: '8px' }}><input value={filters.name || ''} onChange={handleFilterChange('name')} placeholder="Search name" style={{ fontSize: '0.85em', padding: '4px', width: '110px' }} /></div>}
            </th>
            <th style={{ padding: '16px 15px', textAlign: 'left', fontWeight: '600', color: '#1a1a1a', fontSize: '13px', letterSpacing: '0.3px' }}>First Name</th>
            <th style={{ padding: '16px 15px', textAlign: 'left', fontWeight: '600', color: '#1a1a1a', fontSize: '13px', letterSpacing: '0.3px' }}>Middle Name</th>
            <th style={{ padding: '16px 15px', textAlign: 'left', fontWeight: '600', color: '#1a1a1a', fontSize: '13px', letterSpacing: '0.3px' }}>Last Name</th>
            <th style={{ padding: '16px 15px', textAlign: 'left', fontWeight: '600', color: '#1a1a1a', fontSize: '13px', letterSpacing: '0.3px' }}>Email</th>
            <th style={{ padding: '16px 15px', textAlign: 'left', fontWeight: '600', color: '#1a1a1a', fontSize: '13px', letterSpacing: '0.3px' }}>Personal Mobile</th>
            <th style={{ padding: '16px 15px', textAlign: 'left', fontWeight: '600', color: '#1a1a1a', fontSize: '13px', letterSpacing: '0.3px' }}>Guardian Mobile</th>
            <th style={{ padding: '16px 15px', textAlign: 'left', fontWeight: '600', color: '#1a1a1a', fontSize: '13px', letterSpacing: '0.3px' }}>SSC Seat No</th>
            <th style={{ padding: '16px 15px', textAlign: 'left', fontWeight: '600', color: '#1a1a1a', fontSize: '13px', letterSpacing: '0.3px' }}>Class 10 Merit</th>
            <th style={{ padding: '16px 15px', textAlign: 'left', fontWeight: '600', color: '#1a1a1a', fontSize: '13px', letterSpacing: '0.3px' }}>Class 12 Merit</th>
            <th style={{ padding: '16px 15px', textAlign: 'left', fontWeight: '600', color: '#1a1a1a', fontSize: '13px', letterSpacing: '0.3px' }}>ITI Merit</th>
            <th style={{ padding: '16px 15px', textAlign: 'left', fontWeight: '600', color: '#1a1a1a', fontSize: '13px', letterSpacing: '0.3px' }}>Other Merit</th>
            <th style={{ padding: '16px 15px', textAlign: 'left', fontWeight: '600', color: '#1a1a1a', fontSize: '13px', letterSpacing: '0.3px' }}>Other Marks Of</th>
            <th style={{ padding: '16px 15px', textAlign: 'left', fontWeight: '600', color: '#1a1a1a', fontSize: '13px', letterSpacing: '0.3px' }}>
              Admission For
              {filters && <div style={{ marginTop: '8px' }}>
                <select value={filters.admissionFor} onChange={handleFilterChange('admissionFor')} style={{ fontSize: '0.85em', padding: '4px' }}>
                  <option value="">All</option>
                  {admissionForOptions.map(opt => {
                    const value = getOptionValue(opt);
                    return <option key={opt.id || opt.code || value} value={value}>{value}</option>;
                  })}
                </select>
              </div>}
            </th>
            {branchPriorityColumns.map((column, index) => (
            <th key={column.key} style={{ padding: '16px 15px', textAlign: 'left', fontWeight: '600', color: '#1a1a1a', fontSize: '13px', letterSpacing: '0.3px' }}>
              {column.label}
              {filters && index === 0 && <div style={{ marginTop: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                <select value={filters.branch} onChange={handleFilterChange('branch')} style={{ fontSize: '0.8em', padding: '4px' }}>
                  <option value="">Branch</option>
                  {branchOptions.map(opt => {
                    const value = opt.branchName || opt.name || opt.label;
                    return <option key={opt.id || opt.branchCode || value} value={value}>{opt.label || value}</option>;
                  })}
                </select>
                <select value={filters.branchPriority} onChange={handleFilterChange('branchPriority')} style={{ fontSize: '0.8em', padding: '4px' }}>
                  <option value="">Pref</option>
                  {priorityOptions.map(p => (<option key={p} value={p}>{getOrdinal(parseInt(p))}</option>))}
                </select>
              </div>}
            </th>
            ))}
            <th style={{ padding: '16px 15px', textAlign: 'left', fontWeight: '600', color: '#1a1a1a', fontSize: '13px', letterSpacing: '0.3px' }}>
              Location
              {filters && <div style={{ marginTop: '8px' }}>
                <select value={filters.location} onChange={handleFilterChange('location')} style={{ fontSize: '0.85em', padding: '4px' }}>
                  <option value="">All</option>
                  {locationOptions.map(value => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </div>}
            </th>
            <th style={{ padding: '16px 15px', textAlign: 'left', fontWeight: '600', color: '#1a1a1a', fontSize: '13px', letterSpacing: '0.3px' }}>Other Location</th>
            <th style={{ padding: '16px 15px', textAlign: 'left', fontWeight: '600', color: '#1a1a1a', fontSize: '13px', letterSpacing: '0.3px' }}>
              Category
              {filters && <div style={{ marginTop: '8px' }}>
                <select value={filters.category} onChange={handleFilterChange('category')} style={{ fontSize: '0.85em', padding: '4px' }}>
                  <option value="">All</option>
                  {categoryOptions.map(opt => {
                    const value = getOptionValue(opt);
                    return <option key={opt.id || opt.code || value} value={value}>{value}</option>;
                  })}
                </select>
              </div>}
            </th>
            <th style={{ padding: '16px 15px', textAlign: 'left', fontWeight: '600', color: '#1a1a1a', fontSize: '13px', letterSpacing: '0.3px' }}>
              Reference Faculty
              {filters && <div style={{ marginTop: '8px' }}><input value={filters.referenceFaculty || ''} onChange={handleFilterChange('referenceFaculty')} placeholder="Search faculty" style={{ fontSize: '0.85em', padding: '4px', width: '130px' }} /></div>}
            </th>
            <th style={{ padding: '16px 15px', textAlign: 'left', fontWeight: '600', color: '#1a1a1a', fontSize: '13px', letterSpacing: '0.3px' }}>DTE Registration</th>
            <th style={{ padding: '16px 15px', textAlign: 'left', fontWeight: '600', color: '#1a1a1a', fontSize: '13px', letterSpacing: '0.3px' }}>Email Enabled</th>
            <th style={{ padding: '16px 15px', textAlign: 'left', fontWeight: '600', color: '#1a1a1a', fontSize: '13px', letterSpacing: '0.3px' }}>Provisional Admission</th>
            <th style={{ padding: '16px 15px', textAlign: 'left', fontWeight: '600', color: '#1a1a1a', fontSize: '13px', letterSpacing: '0.3px' }}>Provisional Admission Date</th>
            <th style={{ padding: '16px 15px', textAlign: 'left', fontWeight: '600', color: '#1a1a1a', fontSize: '13px', letterSpacing: '0.3px' }}>
              Status
              {filters && <div style={{ marginTop: '8px' }}>
                <select value={filters.status} onChange={handleFilterChange('status')} style={{ fontSize: '0.85em', padding: '4px' }}>
                  <option value="">All</option>
                  {statusOptions.map(opt => {
                    const value = getOptionValue(opt);
                    return <option key={opt.id || opt.code || value} value={value}>{value}</option>;
                  })}
                </select>
              </div>}
            </th>
            <th style={{ padding: '16px 15px', textAlign: 'left', fontWeight: '600', color: '#1a1a1a', fontSize: '13px', letterSpacing: '0.3px' }}>
              Date
              {filters && <div style={{ marginTop: '8px' }}>
                <input type="date" value={filters.date} onChange={handleFilterChange('date')} style={{ fontSize: '0.85em', padding: '4px' }} />
                <select value={filters.dateSort || ''} onChange={handleFilterChange('dateSort')} style={{ fontSize: '0.85em', padding: '4px', marginTop: '4px' }}>
                  <option value="">Sort</option>
                  <option value="asc">Oldest</option>
                  <option value="desc">Newest</option>
                </select>
              </div>}
            </th>
            {!readOnly && <th style={{ padding: '16px 15px', textAlign: 'center', fontWeight: '600', color: '#1a1a1a', fontSize: '13px', letterSpacing: '0.3px' }}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {enquiries.map((enquiry, index) => {
            const merit = parseMerit(enquiry);
            return (
            <tr
              key={enquiry.id}
              style={{
                borderBottom: '1px solid #e8e8e8',
                background: index % 2 === 0 ? '#ffffff' : '#fafafa',
                transition: 'background 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#f0f7ff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = index % 2 === 0 ? '#ffffff' : '#fafafa';
              }}
            >
              <td style={{ padding: '15px', textAlign: 'center', fontWeight: '600', color: '#666' }}>
                {pageNumber * pageSize + index + 1}
              </td>
              <td style={{ padding: '15px' }}>
                <strong>{getFullName(enquiry)}</strong>
              </td>
              <td style={{ padding: '15px', color: '#666', fontSize: '0.9em' }}>{enquiry.firstName || '-'}</td>
              <td style={{ padding: '15px', color: '#666', fontSize: '0.9em' }}>{enquiry.middleName || '-'}</td>
              <td style={{ padding: '15px', color: '#666', fontSize: '0.9em' }}>{enquiry.lastName || '-'}</td>
              <td style={{ padding: '15px', color: '#666', fontSize: '0.9em' }}>
                {enquiry.email}
              </td>
              <td style={{ padding: '15px', color: '#666', fontSize: '0.9em' }}>
                {enquiry.personalMobileNumber}
              </td>
              <td style={{ padding: '15px', color: '#666', fontSize: '0.9em' }}>{enquiry.guardianMobileNumber || '-'}</td>
              <td style={{ padding: '15px', color: '#666', fontSize: '0.9em' }}>{enquiry.sscSeatNo || '-'}</td>
              <td style={{ padding: '15px', color: '#666', fontSize: '0.85em' }}>{merit.class10 || '-'}</td>
              <td style={{ padding: '15px', color: '#666', fontSize: '0.85em' }}>{merit.class12 || '-'}</td>
              <td style={{ padding: '15px', color: '#666', fontSize: '0.85em' }}>{merit.iti || '-'}</td>
              <td style={{ padding: '15px', color: '#666', fontSize: '0.85em' }}>{merit.other || '-'}</td>
              <td style={{ padding: '15px', color: '#666', fontSize: '0.85em' }}>{merit.otherDescription || '-'}</td>
              <td style={{ padding: '15px', color: '#666', fontSize: '0.9em' }}>
                {enquiry.admissionFor || '—'}
              </td>
              {branchPriorityColumns.map(column => (
                <td key={column.key} title={getBranches(enquiry)} style={{ padding: '15px', color: '#666', fontSize: '0.85em' }}>
                  {getBranchByPriority(enquiry, column.priority) || '-'}
                </td>
              ))}
              <td style={{ padding: '15px', color: '#666', fontSize: '0.9em' }}>
                {enquiry.location === 'Other' ? enquiry.otherLocation : enquiry.location}
              </td>
              <td style={{ padding: '15px', color: '#666', fontSize: '0.9em' }}>{enquiry.otherLocation || '-'}</td>
              <td style={{ padding: '15px', color: '#666', fontSize: '0.9em' }}>
                {enquiry.category || '—'}
              </td>
              <td style={{ padding: '15px', color: '#666', fontSize: '0.9em' }}>{enquiry.referenceFaculty || '-'}</td>
              <td style={{ padding: '15px', color: '#666', fontSize: '0.9em' }}>{enquiry.dteRegistrationDone ? 'Yes' : 'No'}</td>
              <td style={{ padding: '15px', color: '#666', fontSize: '0.9em' }}>{enquiry.emailEnabled ? 'Yes' : 'No'}</td>
              <td style={{ padding: '15px', color: '#666', fontSize: '0.9em' }}>{enquiry.provisionalAdmission ? 'Yes' : 'No'}</td>
              <td style={{ padding: '15px', color: '#666', fontSize: '0.9em' }}>{formatDate(enquiry.provisionalAdmissionDate)}</td>
              <td style={{ padding: '15px' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '5px 12px',
                  background: getStatusColor(enquiry.status),
                  color: '#333',
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
              {!readOnly && <td style={{ padding: '15px', textAlign: 'center' }}>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
                  {enquiry.status === 'Pending' && (
                    <button
                      onClick={() => handleStatusUpdate(enquiry.id, 'Success')}
                      disabled={updatingId === enquiry.id}
                      style={{
                        padding: '6px 12px',
                        background: '#e8e8e8',
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
                          e.target.style.background = '#d8d8d8';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (updatingId !== enquiry.id) {
                          e.target.style.background = '#e8e8e8';
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
                        background: '#e8e8e8',
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
                          e.target.style.background = '#d8d8d8';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (updatingId !== enquiry.id) {
                          e.target.style.background = '#e8e8e8';
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
                      background: '#e8e8e8',
                      color: '#333',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.85em',
                      transition: 'background 0.3s ease',
                      fontFamily: 'inherit'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = '#d8d8d8';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = '#e8e8e8';
                    }}
                    title="Delete enquiry"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </td>}
            </tr>
          );
          })}
        </tbody>
      </table>
      </div>
      {(pageNumber !== undefined && totalPages > 0) && (
        <Pagination
          currentPage={pageNumber}
          totalPages={totalPages}
          pageSize={pageSize}
          totalElements={totalElements}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
};

export default EnquiryList;



