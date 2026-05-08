import React, { useEffect, useState } from 'react';
import { admissionService } from '../../services/admissionService';
import { getAllEnquiries } from '../../services/enquiryService';
import hodService from '../../services/hodService';
import { departmentAbbr } from '../staff/StaffManagement';

const palettes = ['#175cd3', '#0e9384', '#dc6803', '#7a5af8', '#d92d20', '#475467'];
const countBy = (items, getter) => items.reduce((acc, item) => {
  const key = getter(item) || 'Unknown';
  acc[key] = (acc[key] || 0) + 1;
  return acc;
}, {});
const rowsFrom = (data) => Object.entries(data || {}).map(([label, value]) => ({ label, value }));
const unwrap = (data) => Array.isArray(data?.content) ? data.content : (Array.isArray(data) ? data : []);
const programAbbr = (program = '') => {
  const code = String(program).match(/^\s*(\d+|[A-Z&]+)\.?/)?.[1];
  return departmentAbbr(code, []) || departmentAbbr(program, []) || program;
};
const humanize = (key) => key.replace(/([A-Z])/g, ' $1').replace(/^./, value => value.toUpperCase());
const chartableFields = (items) => {
  const ignored = new Set(['id', 'createdAt', 'updatedAt']);
  return [...new Set(items.flatMap(item => Object.keys(item || {})))]
    .filter(key => !ignored.has(key) && !key.endsWith('Path') && items.some(item => ['string', 'number', 'boolean'].includes(typeof item?.[key])))
    .sort();
};

const ChartCard = ({ title, rows }) => {
  const [chartType, setChartType] = useState('bar');
  const [visible, setVisible] = useState(() => rows.reduce((acc, row) => ({ ...acc, [row.label]: true }), {}));
  useEffect(() => { setVisible(rows.reduce((acc, row) => ({ ...acc, [row.label]: true }), {})); }, [rows]);
  const shown = rows.filter(row => visible[row.label]);
  const max = Math.max(...shown.map(row => row.value), 1);
  const total = shown.reduce((sum, row) => sum + row.value, 0);
  let cursor = 0;
  const pieStops = shown.map((row, index) => {
    const start = cursor;
    const end = total > 0 ? cursor + (row.value / total) * 100 : cursor;
    cursor = end;
    return `${palettes[index % palettes.length]} ${start}% ${end}%`;
  }).join(', ');

  return (
    <div style={{ border: '1px solid #e4e7ec', borderRadius: '8px', padding: '18px', background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', marginBottom: '14px' }}>
        <h3 style={{ margin: 0, fontSize: '17px' }}>{title}</h3>
        <select value={chartType} onChange={(event) => setChartType(event.target.value)} style={{ padding: '6px 8px', border: '1px solid #d0d5dd', borderRadius: '6px' }}>
          <option value="bar">Bar</option>
          <option value="pie">Pie</option>
        </select>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
        {rows.map(row => (
          <label key={row.label} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#475467' }}>
            <input type="checkbox" checked={visible[row.label] !== false} onChange={() => setVisible(prev => ({ ...prev, [row.label]: !prev[row.label] }))} />
            {row.label}
          </label>
        ))}
      </div>
      {chartType === 'pie' && shown.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '18px', alignItems: 'center' }}>
          <div style={{ width: '150px', height: '150px', borderRadius: '50%', background: `conic-gradient(${pieStops})`, border: '1px solid #e4e7ec' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {shown.map((row, index) => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', fontSize: '13px' }}>
                <span><span style={{ display: 'inline-block', width: '10px', height: '10px', background: palettes[index % palettes.length], marginRight: '8px' }} />{row.label}</span>
                <strong>{row.value}</strong>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {shown.map((row, index) => (
            <div key={row.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                <span>{row.label}</span><span>{row.value}</span>
              </div>
              <div style={{ height: '12px', background: '#eef2f6', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.max(5, (row.value / max) * 100)}%`, background: palettes[index % palettes.length], borderRadius: '999px' }} />
              </div>
            </div>
          ))}
          {shown.length === 0 && <p style={{ color: '#667085', margin: 0 }}>Select at least one field to show this chart.</p>}
        </div>
      )}
    </div>
  );
};

const AnalysisPage = ({ user }) => {
  const [tab, setTab] = useState(user?.role === 'ENQUIRY_STAFF' ? 'enquiries' : 'admissions');
  const [data, setData] = useState({ admissions: [], enquiries: [], department: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [customAdmissionField, setCustomAdmissionField] = useState('category');
  const [customEnquiryField, setCustomEnquiryField] = useState('status');

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        if (user?.role === 'HOD') {
          const overview = await hodService.getHodOverview();
          if (mounted) setData({ admissions: [...(overview.fyAdmissions || []), ...(overview.dsyAdmissions || [])], enquiries: overview.enquiries || [], department: overview.department });
          return;
        }
        const canAdmissions = ['ADMIN', 'PRINCIPAL', 'OFFICE_STAFF', 'ACADEMIC_COORDINATOR'].includes(user?.role);
        const canEnquiries = ['ADMIN', 'PRINCIPAL', 'ENQUIRY_STAFF', 'ACADEMIC_COORDINATOR'].includes(user?.role);
        const admissionRequest = canAdmissions ? Promise.all([admissionService.getAllFYAdmissions(0, 500), admissionService.getAllDSYAdmissions(0, 500)]) : Promise.resolve([[], []]);
        const enquiryRequest = canEnquiries ? getAllEnquiries(0, 500) : Promise.resolve([]);
        const [[fy, dsy], enquiries] = await Promise.all([admissionRequest, enquiryRequest]);
        if (mounted) setData({ admissions: [...unwrap(fy), ...unwrap(dsy)], enquiries: unwrap(enquiries), department: null });
      } catch (err) {
        if (mounted) setError(err.message || 'Unable to load analysis data');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [user?.role]);

  useEffect(() => {
    if (user?.role === 'ENQUIRY_STAFF') setTab('enquiries');
  }, [user?.role]);

  const admissionRows = {
    status: rowsFrom(countBy(data.admissions, item => item.status)),
    category: rowsFrom(countBy(data.admissions, item => item.category)),
    type: rowsFrom(countBy(data.admissions, item => item.admissionType)),
    program: rowsFrom(countBy(data.admissions, item => programAbbr(item.program)))
  };
  const enquiryRows = {
    status: rowsFrom(countBy(data.enquiries, item => item.status)),
    category: rowsFrom(countBy(data.enquiries, item => item.category)),
    admissionFor: rowsFrom(countBy(data.enquiries, item => item.admissionFor)),
    location: rowsFrom(countBy(data.enquiries, item => item.location))
  };
  const canSeeAdmissions = data.admissions.length > 0 || ['ADMIN', 'PRINCIPAL', 'OFFICE_STAFF', 'HOD', 'ACADEMIC_COORDINATOR'].includes(user?.role);
  const canSeeEnquiries = data.enquiries.length > 0 || ['ADMIN', 'PRINCIPAL', 'ENQUIRY_STAFF', 'HOD', 'ACADEMIC_COORDINATOR'].includes(user?.role);
  const admissionFields = chartableFields(data.admissions);
  const enquiryFields = chartableFields(data.enquiries);
  const customRows = tab === 'admissions'
    ? rowsFrom(countBy(data.admissions, item => customAdmissionField === 'program' ? programAbbr(item.program) : item[customAdmissionField]))
    : rowsFrom(countBy(data.enquiries, item => item[customEnquiryField]));

  return (
    <div>
      <h2 style={{ margin: '0 0 8px', fontSize: '28px' }}>{user?.role === 'PRINCIPAL' ? 'Principal Analysis Center' : 'Analysis'}</h2>
      <p style={{ margin: '0 0 22px', color: '#667085' }}>{data.department ? `${data.department.name} department data` : 'Charts are based on records this login can access.'}</p>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '22px' }}>
        {canSeeAdmissions && <button onClick={() => setTab('admissions')} style={{ padding: '10px 14px', border: '1px solid #d0d5dd', borderRadius: '6px', background: tab === 'admissions' ? '#175cd3' : '#fff', color: tab === 'admissions' ? '#fff' : '#344054', cursor: 'pointer' }}>Admission Analysis</button>}
        {canSeeEnquiries && <button onClick={() => setTab('enquiries')} style={{ padding: '10px 14px', border: '1px solid #d0d5dd', borderRadius: '6px', background: tab === 'enquiries' ? '#175cd3' : '#fff', color: tab === 'enquiries' ? '#fff' : '#344054', cursor: 'pointer' }}>Enquiry Analysis</button>}
      </div>
      {loading ? <p>Loading analysis...</p> : error ? <p style={{ color: '#b42318' }}>{error}</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px' }}>
          {tab === 'admissions' ? <>
            <ChartCard title="Admission Status" rows={admissionRows.status} />
            <ChartCard title="Admission Category" rows={admissionRows.category} />
            <ChartCard title="Admission Type" rows={admissionRows.type} />
            <ChartCard title="Program Mix" rows={admissionRows.program} />
            <div style={{ border: '1px solid #e4e7ec', borderRadius: '8px', padding: '18px', background: '#fff' }}>
              <label style={{ display: 'block', marginBottom: '10px', color: '#475467', fontWeight: 700 }}>Analyze Admission Field</label>
              <select value={customAdmissionField} onChange={(event) => setCustomAdmissionField(event.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #d0d5dd', borderRadius: '6px', marginBottom: '14px' }}>
                {admissionFields.map(field => <option key={field} value={field}>{humanize(field)}</option>)}
              </select>
              <ChartCard title={`${humanize(customAdmissionField)} Analysis`} rows={customRows} />
            </div>
          </> : <>
            <ChartCard title="Enquiry Status" rows={enquiryRows.status} />
            <ChartCard title="Enquiry Category" rows={enquiryRows.category} />
            <ChartCard title="Admission Interest" rows={enquiryRows.admissionFor} />
            <ChartCard title="Location" rows={enquiryRows.location} />
            <div style={{ border: '1px solid #e4e7ec', borderRadius: '8px', padding: '18px', background: '#fff' }}>
              <label style={{ display: 'block', marginBottom: '10px', color: '#475467', fontWeight: 700 }}>Analyze Enquiry Field</label>
              <select value={customEnquiryField} onChange={(event) => setCustomEnquiryField(event.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #d0d5dd', borderRadius: '6px', marginBottom: '14px' }}>
                {enquiryFields.map(field => <option key={field} value={field}>{humanize(field)}</option>)}
              </select>
              <ChartCard title={`${humanize(customEnquiryField)} Analysis`} rows={customRows} />
            </div>
          </>}
        </div>
      )}
    </div>
  );
};

export default AnalysisPage;
