import React, { useEffect, useMemo, useState } from 'react';
import { getHomePageContent, updateHomePageContent } from '../../services/homePageService';
import userService from '../../services/userService';
import { assetUrl, initials } from './homeUtils';

const inputStyle = { padding: '10px', border: '1px solid #d0d5dd', borderRadius: '6px', fontSize: '14px', width: '100%', minWidth: 0, boxSizing: 'border-box' };
const textareaStyle = { ...inputStyle, minHeight: '88px', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 };
const panelStyle = { display: 'grid', gap: '14px', padding: '16px', border: '1px solid #e4e7ec', borderRadius: '8px', background: '#fff' };
const rowGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', alignItems: 'start' };
const buttonStyle = { padding: '10px 14px', border: 0, borderRadius: '6px', background: '#175cd3', color: 'white', fontWeight: 700, cursor: 'pointer' };
const ghostButtonStyle = { ...buttonStyle, border: '1px solid #d0d5dd', background: '#fff', color: '#344054' };
const dangerButtonStyle = { ...ghostButtonStyle, borderColor: '#fda29b', color: '#b42318' };

const emptyLeadership = { name: '', designation: '', summary: '', imagePath: '' };
const emptyDeveloper = { name: '', role: '', email: '', phone: '', linkedin: '' };
const emptySocial = { label: '', url: '' };

const normalizeList = (items, emptyItem) => (Array.isArray(items) && items.length ? items : [emptyItem]).map(item => ({ ...emptyItem, ...item }));
const splitLines = (value) => String(value || '').split('\n').map(item => item.trim()).filter(Boolean);
const joinLines = (value) => Array.isArray(value) ? value.join('\n') : '';

const HomePageAdmin = () => {
  const [form, setForm] = useState({
    heroTitle: '',
    heroTagline: '',
    heroHighlight: '',
    aboutText: '',
    leadership: [emptyLeadership],
    developers: [emptyDeveloper],
    contactAddress: '',
    contactPhones: '',
    contactEmail: '',
    socialLinks: [emptySocial]
  });
  const [users, setUsers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [uploadingUserId, setUploadingUserId] = useState(null);
  const [message, setMessage] = useState('');

  const loadHomePage = async () => {
    const [content, userData] = await Promise.all([getHomePageContent(), userService.getUsers()]);
    setForm({
      heroTitle: content?.hero?.title || '',
      heroTagline: content?.hero?.tagline || '',
      heroHighlight: content?.hero?.highlight || '',
      aboutText: content?.about || '',
      leadership: normalizeList(content?.leadership, emptyLeadership),
      developers: normalizeList(content?.developers, emptyDeveloper),
      contactAddress: content?.contact?.address || '',
      contactPhones: joinLines(content?.contact?.phones),
      contactEmail: content?.contact?.email || '',
      socialLinks: normalizeList(content?.contact?.socialLinks, emptySocial)
    });
    setUsers(userData || []);
  };

  useEffect(() => {
    let mounted = true;
    loadHomePage().catch(err => {
      if (mounted) setMessage(err.message || 'Unable to load home page details.');
    });
    return () => { mounted = false; };
  }, []);

  const photoUsers = useMemo(
    () => users.filter(user => ['PRINCIPAL', 'HOD'].includes(String(user.role || '').toUpperCase())),
    [users]
  );

  const handleChange = (field) => (event) => {
    setForm(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handleListChange = (listName, index, field) => (event) => {
    setForm(prev => ({
      ...prev,
      [listName]: prev[listName].map((item, itemIndex) => itemIndex === index ? { ...item, [field]: event.target.value } : item)
    }));
  };

  const addListItem = (listName, emptyItem) => {
    setForm(prev => ({ ...prev, [listName]: [...prev[listName], { ...emptyItem }] }));
  };

  const removeListItem = (listName, index, emptyItem) => {
    setForm(prev => {
      const next = prev[listName].filter((_, itemIndex) => itemIndex !== index);
      return { ...prev, [listName]: next.length ? next : [{ ...emptyItem }] };
    });
  };

  const cleanList = (items, requiredField) => items
    .map(item => Object.fromEntries(Object.entries(item).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])))
    .filter(item => item[requiredField]);

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
        leadership: cleanList(form.leadership, 'name'),
        developers: cleanList(form.developers, 'name'),
        contact: {
          address: form.contactAddress,
          phones: splitLines(form.contactPhones),
          email: form.contactEmail,
          socialLinks: cleanList(form.socialLinks, 'url')
        }
      });
      setMessage('Home page information updated.');
      await loadHomePage();
    } catch (err) {
      setMessage(err.response?.data?.error || err.message || 'Unable to update home page content.');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (userId, file) => {
    if (!file) return;
    setUploadingUserId(userId);
    setMessage('');
    try {
      const updatedUser = await userService.uploadUserProfileImage(userId, file);
      setUsers(prev => prev.map(user => user.id === userId ? updatedUser : user));
      setMessage('Photo uploaded. It will now appear on the public home page.');
    } catch (err) {
      setMessage(err.response?.data?.error || err.message || 'Unable to upload photo.');
    } finally {
      setUploadingUserId(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '18px' }}>
      <div>
        <h2 style={{ margin: '0 0 8px', fontSize: '28px' }}>Home Page</h2>
        <p style={{ margin: 0, color: '#667085' }}>Update the public home page text, leadership photos, Principal/HOD photos, developers, and contact details.</p>
      </div>

      <section style={panelStyle}>
        <h3 style={{ margin: 0, fontSize: '18px' }}>Top Section</h3>
        <div style={rowGridStyle}>
          <input style={inputStyle} value={form.heroTitle} onChange={handleChange('heroTitle')} placeholder="College name / title" />
          <input style={inputStyle} value={form.heroTagline} onChange={handleChange('heroTagline')} placeholder="Main tagline" />
          <input style={inputStyle} value={form.heroHighlight} onChange={handleChange('heroHighlight')} placeholder="Highlight line" />
        </div>
        <textarea style={textareaStyle} value={form.aboutText} onChange={handleChange('aboutText')} placeholder="About college text" />
      </section>

      <section style={panelStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <h3 style={{ margin: 0, fontSize: '18px' }}>Director, Founder and Leadership Photos</h3>
          <button type="button" onClick={() => addListItem('leadership', emptyLeadership)} style={ghostButtonStyle}>Add Person</button>
        </div>
        {form.leadership.map((person, index) => (
          <div key={index} style={{ ...panelStyle, background: '#f8fafc' }}>
            <div style={rowGridStyle}>
              <input style={inputStyle} value={person.name} onChange={handleListChange('leadership', index, 'name')} placeholder="Name" />
              <input style={inputStyle} value={person.designation} onChange={handleListChange('leadership', index, 'designation')} placeholder="Designation, e.g. Director" />
              <input style={inputStyle} value={person.imagePath || ''} onChange={handleListChange('leadership', index, 'imagePath')} placeholder="Image URL or uploads path" />
            </div>
            <textarea style={textareaStyle} value={person.summary || ''} onChange={handleListChange('leadership', index, 'summary')} placeholder="Short description" />
            <button type="button" onClick={() => removeListItem('leadership', index, emptyLeadership)} style={{ ...dangerButtonStyle, width: 'fit-content' }}>Remove</button>
          </div>
        ))}
      </section>

      <section style={panelStyle}>
        <h3 style={{ margin: 0, fontSize: '18px' }}>Principal and HOD Photos</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
          {photoUsers.map(user => {
            const image = assetUrl(user.profileImagePath);
            return (
              <div key={user.id} style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: '12px', alignItems: 'center', padding: '12px', border: '1px solid #e4e7ec', borderRadius: '8px', minWidth: 0 }}>
                <div style={{ width: '64px', aspectRatio: 1, borderRadius: '8px', overflow: 'hidden', background: '#dbeafe', color: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                  {image ? <img src={image} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials(user.name)}
                </div>
                <label style={{ minWidth: 0, display: 'grid', gap: '6px', color: '#344054', fontSize: '13px', fontWeight: 700 }}>
                  <span style={{ overflowWrap: 'anywhere' }}>{user.name} - {user.role}</span>
                  <input type="file" accept="image/png,image/jpeg" disabled={uploadingUserId === user.id} onChange={(event) => handlePhotoUpload(user.id, event.target.files?.[0])} />
                </label>
              </div>
            );
          })}
          {!photoUsers.length && <p style={{ margin: 0, color: '#667085' }}>Create Principal or HOD users first, then upload their photos here.</p>}
        </div>
      </section>

      <section style={panelStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <h3 style={{ margin: 0, fontSize: '18px' }}>Developers</h3>
          <button type="button" onClick={() => addListItem('developers', emptyDeveloper)} style={ghostButtonStyle}>Add Developer</button>
        </div>
        {form.developers.map((developer, index) => (
          <div key={index} style={{ ...panelStyle, background: '#f8fafc' }}>
            <div style={rowGridStyle}>
              <input style={inputStyle} value={developer.name} onChange={handleListChange('developers', index, 'name')} placeholder="Name" />
              <input style={inputStyle} value={developer.role || ''} onChange={handleListChange('developers', index, 'role')} placeholder="Role" />
              <input style={inputStyle} value={developer.email || ''} onChange={handleListChange('developers', index, 'email')} placeholder="Email" />
              <input style={inputStyle} value={developer.phone || ''} onChange={handleListChange('developers', index, 'phone')} placeholder="Phone" />
              <input style={inputStyle} value={developer.linkedin || ''} onChange={handleListChange('developers', index, 'linkedin')} placeholder="LinkedIn URL" />
            </div>
            <button type="button" onClick={() => removeListItem('developers', index, emptyDeveloper)} style={{ ...dangerButtonStyle, width: 'fit-content' }}>Remove</button>
          </div>
        ))}
      </section>

      <section style={panelStyle}>
        <h3 style={{ margin: 0, fontSize: '18px' }}>Contact</h3>
        <textarea style={textareaStyle} value={form.contactAddress} onChange={handleChange('contactAddress')} placeholder="Address" />
        <div style={rowGridStyle}>
          <textarea style={textareaStyle} value={form.contactPhones} onChange={handleChange('contactPhones')} placeholder="Phone numbers, one per line" />
          <input style={inputStyle} value={form.contactEmail} onChange={handleChange('contactEmail')} placeholder="Email" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <strong>Social links</strong>
          <button type="button" onClick={() => addListItem('socialLinks', emptySocial)} style={ghostButtonStyle}>Add Link</button>
        </div>
        {form.socialLinks.map((link, index) => (
          <div key={index} style={rowGridStyle}>
            <input style={inputStyle} value={link.label || ''} onChange={handleListChange('socialLinks', index, 'label')} placeholder="Label, e.g. Facebook" />
            <input style={inputStyle} value={link.url || ''} onChange={handleListChange('socialLinks', index, 'url')} placeholder="URL" />
            <button type="button" onClick={() => removeListItem('socialLinks', index, emptySocial)} style={dangerButtonStyle}>Remove</button>
          </div>
        ))}
      </section>

      {message && <div style={{ padding: '10px 12px', background: '#f8fafc', border: '1px solid #e4e7ec', borderRadius: '6px', overflowWrap: 'anywhere' }}>{message}</div>}
      <button type="submit" disabled={saving} style={{ ...buttonStyle, width: 'fit-content', cursor: saving ? 'wait' : 'pointer' }}>
        {saving ? 'Saving...' : 'Update Home Page'}
      </button>
    </form>
  );
};

export default HomePageAdmin;
