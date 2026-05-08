import React, { useEffect, useState } from 'react';
import hodService from '../../services/hodService';
import EnquiryList from '../enquiry/EnquiryList';
import { exportToExcel } from '../../utils/exportUtils';

const HodEnquiriesPage = () => {
  const [overview, setOverview] = useState(null);
  const [filters, setFilters] = useState({ admissionFor: '', branch: '', branchPriority: '', location: '', category: '', status: '', date: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    hodService.getHodOverview()
      .then(setOverview)
      .catch(err => setError(err.message || 'Unable to load HOD enquiries'))
      .finally(() => setLoading(false));
  }, []);

  const enquiries = (overview?.enquiries || []).filter(enquiry => {
    if (filters.admissionFor && enquiry.admissionFor !== filters.admissionFor) return false;
    if (filters.location && enquiry.location !== filters.location) return false;
    if (filters.category && enquiry.category !== filters.category) return false;
    if (filters.status && enquiry.status !== filters.status) return false;
    if (filters.date && enquiry.enquiryDate !== filters.date) return false;
    return true;
  });

  if (loading) return <p>Loading department enquiries...</p>;
  if (error) return <p style={{ color: '#b42318' }}>{error}</p>;

  return (
    <div>
      <h2 style={{ margin: '0 0 8px', fontSize: '28px' }}>Department Enquiries</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', marginBottom: '22px' }}>
        <p style={{ margin: 0, color: '#667085' }}>Read-only enquiry list for {overview?.department?.name || 'your department'}.</p>
        <button onClick={() => exportToExcel(enquiries)} style={{ padding: '10px 14px', border: '1px solid #b2ccff', borderRadius: '6px', background: '#e8f1ff', color: '#175cd3' }}>Export Excel</button>
      </div>
      <EnquiryList enquiries={enquiries} allEnquiries={overview?.enquiries || []} filters={filters} setFilters={setFilters} totalPages={0} readOnly />
    </div>
  );
};

export default HodEnquiriesPage;

