import React, { useEffect, useState } from 'react';
import {
  createEmailPreset,
  deleteEmailPreset,
  getEmailPresets,
  sendEmailPreset,
  updateEmailPreset
} from '../../services/emailPresetService';
import { getAllAdmissionTypes, getAllBranches, getAllEnquiryCategories, getAllEnquiryStatuses, getAllLocations, getOptionValue } from '../../services/lookupService';

const emptyPreset = { name: '', subject: '', body: '', targetScope: 'ENQUIRY' };
const emptyFilters = { admissionFor: '', branch: '', category: '', location: '', status: '' };

const EmailPage = ({ scope = 'ENQUIRY' }) => {
  const [presets, setPresets] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [presetForm, setPresetForm] = useState({ ...emptyPreset, targetScope: scope });
  const [filters, setFilters] = useState(emptyFilters);
  const [files, setFiles] = useState([]);
  const [lookups, setLookups] = useState({ admissionTypes: [], branches: [], categories: [], locations: [], statuses: [] });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPresets();
    loadLookups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope]);

  const loadPresets = async () => {
    const data = await getEmailPresets(scope);
    setPresets(data || []);
    if (!selectedId && data?.length) {
      choosePreset(data[0]);
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
      const result = await sendEmailPreset({ presetId: selectedId, targetScope: scope, ...filters });
      setMessage(`Email sent to ${result.sent} recipient(s). Failed: ${result.failed}`);
    } catch (error) {
      setMessage(error.response?.data?.error || error.message || 'Unable to send email');
    } finally {
      setLoading(false);
    }
  };

  const optionValue = (option) => option.branchName || option.name || option.label || getOptionValue(option);
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
      <h2 style={{ marginTop: 0 }}>{scope === 'ADMISSION' ? 'Admission Email' : 'Enquiry Email'}</h2>
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
              <option value="">All statuses</option>
              {lookups.statuses.map(option => <option key={option.id || optionValue(option)} value={optionValue(option)}>{optionValue(option)}</option>)}
            </select>
          </div>
          <button style={{ ...styles.button, marginTop: '16px' }} disabled={loading} onClick={sendPreset}>Send Selected Preset</button>
        </div>
      </div>
    </div>
  );
};

export default EmailPage;
