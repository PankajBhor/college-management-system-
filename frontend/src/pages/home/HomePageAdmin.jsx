import React, { useEffect, useState } from 'react';
import { getHomePageContent, updateHomePageContent } from '../../services/homePageService';

const inputStyle = { padding: '10px', border: '1px solid #d0d5dd', borderRadius: '6px', fontSize: '14px' };
const textareaStyle = { ...inputStyle, minHeight: '120px', fontFamily: 'Consolas, monospace' };

const stringify = (value) => JSON.stringify(value || [], null, 2);

const HomePageAdmin = () => {
  const [form, setForm] = useState({
    heroTitle: '',
    heroTagline: '',
    heroHighlight: '',
    aboutText: '',
    leadership: '[]',
    developers: '[]',
    contact: '{}'
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let mounted = true;
    getHomePageContent().then(data => {
      if (!mounted) return;
      setForm({
        heroTitle: data?.hero?.title || '',
        heroTagline: data?.hero?.tagline || '',
        heroHighlight: data?.hero?.highlight || '',
        aboutText: data?.about || '',
        leadership: stringify(data?.leadership),
        developers: stringify(data?.developers),
        contact: JSON.stringify(data?.contact || {}, null, 2)
      });
    });
    return () => { mounted = false; };
  }, []);

  const handleChange = (field) => (event) => {
    setForm(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await updateHomePageContent({
        heroTitle: form.heroTitle,
        heroTagline: form.heroTagline,
        heroHighlight: form.heroHighlight,
        aboutText: form.aboutText,
        leadership: JSON.parse(form.leadership || '[]'),
        developers: JSON.parse(form.developers || '[]'),
        contact: JSON.parse(form.contact || '{}')
      });
      setMessage('Home page information updated.');
    } catch (err) {
      setMessage(err.response?.data?.error || err.message || 'Unable to update home page content.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <input style={inputStyle} value={form.heroTitle} onChange={handleChange('heroTitle')} placeholder="Hero title" />
        <input style={inputStyle} value={form.heroTagline} onChange={handleChange('heroTagline')} placeholder="Hero tagline" />
        <input style={inputStyle} value={form.heroHighlight} onChange={handleChange('heroHighlight')} placeholder="Hero highlight" />
      </div>
      <textarea style={{ ...inputStyle, minHeight: '100px' }} value={form.aboutText} onChange={handleChange('aboutText')} placeholder="About college text" />
      <label>
        <strong>Leadership JSON</strong>
        <textarea style={textareaStyle} value={form.leadership} onChange={handleChange('leadership')} />
      </label>
      <label>
        <strong>Developers JSON</strong>
        <textarea style={textareaStyle} value={form.developers} onChange={handleChange('developers')} />
      </label>
      <label>
        <strong>Contact JSON</strong>
        <textarea style={textareaStyle} value={form.contact} onChange={handleChange('contact')} />
      </label>
      {message && <div style={{ padding: '10px 12px', background: '#f8fafc', border: '1px solid #e4e7ec', borderRadius: '6px' }}>{message}</div>}
      <button type="submit" disabled={saving} style={{ width: 'fit-content', padding: '10px 14px', border: 0, borderRadius: '6px', background: '#175cd3', color: 'white', fontWeight: 700, cursor: saving ? 'wait' : 'pointer' }}>
        {saving ? 'Saving...' : 'Update Home Page'}
      </button>
    </form>
  );
};

export default HomePageAdmin;
