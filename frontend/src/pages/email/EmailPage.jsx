import React, { useEffect, useState } from 'react';
import {
  createEmailPreset,
  deleteEmailPreset,
  getEmailPresets,
  sendEmailPreset,
  updateEmailPreset
} from '../../services/emailPresetService';
import { getAllAdmissionTypes, getAllBranches, getAllEnquiryCategories, getAllEnquiryStatuses, getAllLocations, getOptionValue } from '../../services/lookupService';
import enquiryService from '../../services/enquiryService';
import { admissionService } from '../../services/admissionService';
import { useAuth } from '../../hooks/useAuth';
import { canAccessPage } from '../../data/menuData';

const emptyPreset = { name: '', subject: '', body: '', targetScope: 'ENQUIRY' };
const emptyFilters = { admissionFor: '', branch: '', category: '', location: '', status: '' };

const EmailPage = ({ scope: initialScope }) => {
  const { user } = useAuth();
  const availableScopes = [
    canAccessPage(user, 'email-enquiry') || canAccessPage(user, 'enquiries') ? 'ENQUIRY' : null,
    canAccessPage(user, 'email-admission') || canAccessPage(user, 'admissions') ? 'ADMISSION' : null
  ].filter(Boolean);
  const [scope, setScope] = useState(initialScope || availableScopes[0] || 'ENQUIRY');
  const [presets, setPresets] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [presetForm, setPresetForm] = useState({ ...emptyPreset, targetScope: scope });
  const [filters, setFilters] = useState(emptyFilters);
  const [files, setFiles] = useState([]);
  const [lookups, setLookups] = useState({ admissionTypes: [], branches: [], categories: [], locations: [], statuses: [] });
  const [recipients, setRecipients] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPresets();
    loadLookups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope]);

  useEffect(() => {
    setPresetForm(prev => ({ ...prev, targetScope: scope }));
    setSelectedId('');
    setPresets([]);
    setFilters(emptyFilters);
    setRecipients([]);
    setSelectedRecipients([]);
  }, [scope]);

  const loadPresets = async () => {
    try {
      const data = await getEmailPresets(scope);
      setPresets(data || []);
      choosePreset(data?.length ? data[0] : null);
    } catch (error) {
      setPresets([]);
      choosePreset(null);
      setMessage(error.response?.data?.error || error.message || 'Unable to load email presets');
    }
  };

  const loadLookups = async () => {
    const [admissionTypes, branches, categories, locations, statuses] = await Promise.all([
      getAllAdmissionTypes().catch(() => []),
      getAllBranches().catch(() => []),
      getAllEnquiryCategories().catch(() => []),
      getAllLocations().catch(() => []),
      getAllEnquiryStatuses().catch(() => [])
    ]);
    setLookups({ admissionTypes, branches, categories, locations, statuses });
  };

  const choosePreset = (preset) => {
    setSelectedId(preset?.id || '');
    setPresetForm({
      name: preset?.name || '',
      subject: preset?.subject || '',
      body: preset?.body || '',
      targetScope: scope
    });
    setFiles([]);
  };

  const savePreset = async () => {
    setLoading(true);
    setMessage('');
    try {
      const saved = selectedId
        ? await updateEmailPreset(selectedId, presetForm, files)
        : await createEmailPreset({ ...presetForm, targetScope: scope }, files);
      setMessage('Preset saved');
      setSelectedId(saved.id);
      await loadPresets();
    } catch (error) {
      setMessage(error.response?.data?.error || error.message || 'Unable to save preset');
    } finally {
      setLoading(false);
    }
  };

  const removePreset = async () => {
    if (!selectedId || !window.confirm('Delete this preset?')) return;
    await deleteEmailPreset(selectedId);
    setSelectedId('');
    setPresetForm({ ...emptyPreset, targetScope: scope });
    await loadPresets();
  };

  const sendPreset = async () => {
    if (!selectedId) {
      setMessage('Select or save a preset first');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const result = await sendEmailPreset({ presetId: selectedId, targetScope: scope, ...filters, recipientEmails: selectedRecipients });
      setMessage(`Email sent to ${result.sent} recipient(s). Failed: ${result.failed}`);
    } catch (error) {
      setMessage(error.response?.data?.error || error.message || 'Unable to send email');
    } finally {
      setLoading(false);
    }
  };

  const optionValue = (option) => option.branchName || option.name || option.label || getOptionValue(option);
  const matches = (filter, value) => !filter || String(value || '').toLowerCase() === String(filter).toLowerCase();
  const branchMatches = (filter, row) => {
    if (!filter) return true;
    if (scope === 'ADMISSION') return String(row.program || '').toLowerCase() === filter.toLowerCase();
    return String(row.branchesInterested || '').toLowerCase().includes(filter.toLowerCase());
  };
  const getRecipientName = (row) => scope === 'ADMISSION'
    ? [row.applicantFirstName, row.applicantMiddleName, row.applicantLastName].filter(Boolean).join(' ')
    : [row.firstName, row.middleName, row.lastName].filter(Boolean).join(' ');
  const getRecipientEmail = (row) => scope === 'ADMISSION' ? row.studentEmail : row.email;
  const previewRecipients = async () => {
    setLoading(true);
    setMessage('');
    try {
      const rows = scope === 'ADMISSION'
        ? [
            ...normalizeRows(await admissionService.getAllFYAdmissions(0, 1000)).map(row => ({ ...row, admissionFor: 'FY' })),
            ...normalizeRows(await admissionService.getAllDSYAdmissions(0, 1000)).map(row => ({ ...row, admissionFor: 'DSY' }))
          ]
        : normalizeRows(await enquiryService.getAllEnquiries(0, 1000));
      const filtered = rows.filter(row => {
        const email = getRecipientEmail(row);
        if (!email) return false;
        if (scope === 'ENQUIRY' && !matches(filters.admissionFor, row.admissionFor)) return false;
        if (scope === 'ADMISSION' && !matches(filters.admissionFor, row.admissionFor)) return false;
        if (!matches(filters.category, row.category)) return false;
        if (scope === 'ENQUIRY' && !matches(filters.location, row.location)) return false;
        if (!matches(normalizeStatusFilter(filters.status), row.status)) return false;
        if (!branchMatches(filters.branch, row)) return false;
        return true;
      });
      setRecipients(filtered);
      setSelectedRecipients(filtered.map(getRecipientEmail));
    } catch (error) {
      setMessage(error.response?.data?.error || error.message || 'Unable to load recipients');
    } finally {
      setLoading(false);
    }
  };
  const normalizeRows = (data) => Array.isArray(data?.content) ? data.content : (Array.isArray(data) ? data : []);
  const normalizeStatusFilter = (status) => {
    if (scope === 'ADMISSION' && String(status).toLowerCase() === 'success') return 'APPROVED';
    return status;
  };
  const allPreviewSelected = recipients.length > 0 && recipients.every(row => selectedRecipients.includes(getRecipientEmail(row)));
  const toggleAllPreview = () => setSelectedRecipients(allPreviewSelected ? [] : recipients.map(getRecipientEmail));
  const toggleRecipient = (email) => setSelectedRecipients(prev => prev.includes(email) ? prev.filter(item => item !== email) : [...prev, email]);
  const styles = {
    grid: { display: 'grid', gridTemplateColumns: '260px 1fr', gap: '22px' },
    panel: { border: '1px solid #e5e7eb', borderRadius: '8px', padding: '18px', background: '#fff' },
    input: { width: '100%', padding: '11px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' },
    label: { display: 'block', fontWeight: 600, color: '#334155', marginBottom: '7px', fontSize: '13px' },
    button: { padding: '10px 16px', border: 0, borderRadius: '6px', background: '#2563eb', color: '#fff', fontWeight: 700, cursor: 'pointer' },
    secondary: { padding: '10px 16px', border: 0, borderRadius: '6px', background: '#e5e7eb', color: '#111827', fontWeight: 700, cursor: 'pointer' }
  };

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Email</h2>
      {availableScopes.length > 1 && (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          {availableScopes.map(item => (
            <button key={item} type="button" onClick={() => setScope(item)} style={scope === item ? styles.button : styles.secondary}>
              {item === 'ADMISSION' ? 'Admission Students' : 'Enquiry Students'}
            </button>
          ))}
        </div>
      )}
      <div style={styles.grid}>
        <div style={styles.panel}>
          <button style={{ ...styles.button, width: '100%', marginBottom: '12px' }} onClick={() => choosePreset(null)}>New Preset</button>
          {presets.map(preset => (
            <button
              key={preset.id}
              onClick={() => choosePreset(preset)}
              style={{ ...styles.secondary, width: '100%', marginBottom: '8px', textAlign: 'left', background: selectedId === preset.id ? '#dbeafe' : '#f3f4f6' }}
            >
              {preset.name}
            </button>
          ))}
        </div>
        <div style={styles.panel}>
          {message && <div style={{ marginBottom: '14px', color: message.includes('Unable') ? '#b91c1c' : '#166534' }}>{message}</div>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={styles.label}>Preset Name</label>
              <input style={styles.input} value={presetForm.name} onChange={(e) => setPresetForm(prev => ({ ...prev, name: e.target.value }))} />
            </div>
            <div>
              <label style={styles.label}>Subject</label>
              <input style={styles.input} value={presetForm.subject} onChange={(e) => setPresetForm(prev => ({ ...prev, subject: e.target.value }))} />
            </div>
          </div>
          <div style={{ marginTop: '14px' }}>
            <label style={styles.label}>Email Content</label>
            <textarea style={{ ...styles.input, minHeight: '180px', resize: 'vertical' }} value={presetForm.body} onChange={(e) => setPresetForm(prev => ({ ...prev, body: e.target.value }))} />
          </div>
          <div style={{ marginTop: '14px' }}>
            <label style={styles.label}>Attachments</label>
            <input type="file" accept="image/png,image/jpeg,application/pdf" multiple onChange={(e) => setFiles(Array.from(e.target.files || []))} />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button style={styles.button} disabled={loading} onClick={savePreset}>{selectedId ? 'Save Changes' : 'Create Preset'}</button>
            {selectedId && <button style={styles.secondary} disabled={loading} onClick={removePreset}>Delete</button>}
          </div>

          <h3 style={{ marginTop: '28px' }}>Recipients</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            <select style={styles.input} value={filters.admissionFor} onChange={(e) => setFilters(prev => ({ ...prev, admissionFor: e.target.value }))}>
              <option value="">{scope === 'ENQUIRY' ? 'All enquiry types' : 'All admission types'}</option>
              {lookups.admissionTypes.map(option => <option key={option.id || optionValue(option)} value={optionValue(option)}>{optionValue(option)}</option>)}
            </select>
            <select style={styles.input} value={filters.branch} onChange={(e) => setFilters(prev => ({ ...prev, branch: e.target.value }))}>
              <option value="">All branches</option>
              {lookups.branches.map(option => <option key={option.id || optionValue(option)} value={optionValue(option)}>{optionValue(option)}</option>)}
            </select>
            <select style={styles.input} value={filters.category} onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}>
              <option value="">All categories</option>
              {lookups.categories.map(option => <option key={option.id || optionValue(option)} value={optionValue(option)}>{optionValue(option)}</option>)}
            </select>
            {scope === 'ENQUIRY' && (
              <select style={styles.input} value={filters.location} onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}>
                <option value="">All locations</option>
                {lookups.locations.map(option => <option key={option.id || optionValue(option)} value={optionValue(option)}>{optionValue(option)}</option>)}
              </select>
            )}
            <select style={styles.input} value={filters.status} onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}>
              <option value="">All status</option>
              {lookups.statuses.map(option => <option key={option.id || optionValue(option)} value={optionValue(option)}>{optionValue(option)}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
            <button style={styles.secondary} disabled={loading} onClick={previewRecipients}>Show Recipients</button>
            <button style={styles.button} disabled={loading || selectedRecipients.length === 0} onClick={sendPreset}>Send Selected Preset</button>
          </div>
          {recipients.length > 0 && (
            <div style={{ marginTop: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ padding: '10px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>{selectedRecipients.length}/{recipients.length} selected</strong>
                <button type="button" style={styles.secondary} onClick={toggleAllPreview}>{allPreviewSelected ? 'Deselect All' : 'Select All'}</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>{['Select', 'Name', 'Email', 'Category', 'Status'].map(header => <th key={header} style={{ textAlign: 'left', padding: '10px', borderTop: '1px solid #e5e7eb' }}>{header}</th>)}</tr></thead>
                <tbody>
                  {recipients.map(row => {
                    const email = getRecipientEmail(row);
                    return (
                      <tr key={email}>
                        <td style={{ padding: '10px', borderTop: '1px solid #eef2f7' }}><input type="checkbox" checked={selectedRecipients.includes(email)} onChange={() => toggleRecipient(email)} /></td>
                        <td style={{ padding: '10px', borderTop: '1px solid #eef2f7' }}>{getRecipientName(row)}</td>
                        <td style={{ padding: '10px', borderTop: '1px solid #eef2f7' }}>{email}</td>
                        <td style={{ padding: '10px', borderTop: '1px solid #eef2f7' }}>{row.category || '-'}</td>
                        <td style={{ padding: '10px', borderTop: '1px solid #eef2f7' }}>{row.status || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailPage;
