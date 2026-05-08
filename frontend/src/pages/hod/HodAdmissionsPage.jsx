import React, { useEffect, useState } from 'react';
import hodService from '../../services/hodService';
import AdmittedListFY from '../admissions/AdmittedListFY';
import AdmittedListDSY from '../admissions/AdmittedListDSY';
import { exportAdmissionsToExcel } from '../../utils/exportUtils';

const HodAdmissionsPage = () => {
  const [overview, setOverview] = useState(null);
  const [tab, setTab] = useState('fy');
  const [filters, setFilters] = useState({ name: '', program: '', status: '', documentStatus: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    hodService.getHodOverview()
      .then(setOverview)
      .catch(err => setError(err.message || 'Unable to load HOD admissions'))
      .finally(() => setLoading(false));
  }, []);

  const filterAdmissions = (items) => (items || []).filter(item => {
    const name = `${item.applicantFirstName || ''} ${item.applicantMiddleName || ''} ${item.applicantLastName || ''}`.toLowerCase();
    if (filters.name && !name.includes(filters.name.toLowerCase())) return false;
    if (filters.status && item.status !== filters.status) return false;
    if (filters.program && item.program !== filters.program) return false;
    return true;
  });

  if (loading) return <p>Loading department admissions...</p>;
  if (error) return <p style={{ color: '#b42318' }}>{error}</p>;

  const fy = filterAdmissions(overview?.fyAdmissions || []);
  const dsy = filterAdmissions(overview?.dsyAdmissions || []);

  return (
    <div>
      <h2 style={{ margin: '0 0 8px', fontSize: '28px' }}>Department Admissions</h2>
      <p style={{ margin: '0 0 22px', color: '#667085' }}>Read-only applications and approved admissions for {overview?.department?.name || 'your department'}.</p>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '18px' }}>
        <button onClick={() => setTab('fy')} style={{ padding: '10px 14px', border: '1px solid #d0d5dd', borderRadius: '6px', background: tab === 'fy' ? '#175cd3' : '#fff', color: tab === 'fy' ? '#fff' : '#344054' }}>FY ({fy.length})</button>
        <button onClick={() => setTab('dsy')} style={{ padding: '10px 14px', border: '1px solid #d0d5dd', borderRadius: '6px', background: tab === 'dsy' ? '#175cd3' : '#fff', color: tab === 'dsy' ? '#fff' : '#344054' }}>DSY ({dsy.length})</button>
        <button onClick={() => exportAdmissionsToExcel(tab === 'fy' ? fy : dsy, tab)} style={{ padding: '10px 14px', border: '1px solid #b2ccff', borderRadius: '6px', background: '#e8f1ff', color: '#175cd3' }}>Export Excel</button>
      </div>
      {tab === 'fy' ? <AdmittedListFY admissions={fy} allAdmissions={overview?.fyAdmissions || []} filters={filters} setFilters={setFilters} totalPages={0} /> : <AdmittedListDSY admissions={dsy} allAdmissions={overview?.dsyAdmissions || []} filters={filters} setFilters={setFilters} totalPages={0} />}
    </div>
  );
};

export default HodAdmissionsPage;

