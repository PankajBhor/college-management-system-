import React, { useEffect, useState } from 'react';
import userService from '../../services/userService';
import courseService from '../../services/courseService';
import { getAllBranches } from '../../services/lookupService';
import { allMenuItems, parseAccessPages } from '../../data/menuData';

const inputStyle = { padding: '10px', border: '1px solid #d0d5dd', borderRadius: '6px', fontSize: '14px' };
const DEPARTMENT_ABBREVIATIONS = {
  '1': 'CE', '2': 'CO', '3': 'EE', '4': 'E&TC', '5': 'ME', '6': 'IF', '7': 'MK',
  CE: 'CE', CO: 'CO', EE: 'EE', 'E&TC': 'E&TC', ME: 'ME', IF: 'IF', MK: 'MK'
};
const abbreviationFromName = (name = '') => {
  const value = name.toLowerCase();
  if (value.includes('computer')) return 'CO';
  if (value.includes('information')) return 'IF';
  if (value.includes('mechanical') && !value.includes('mechatronics')) return 'ME';
  if (value.includes('electronics') || value.includes('telecommunication') || value.includes('entc')) return 'E&TC';
  if (value.includes('electrical')) return 'EE';
  if (value.includes('civil')) return 'CE';
  if (value.includes('mechatronics')) return 'MK';
  return '';
};
const departmentAbbr = (code, branches) => {
  const branch = branches.find(item => String(item.code) === String(code));
  return DEPARTMENT_ABBREVIATIONS[String(code)] || abbreviationFromName(branch?.name) || code || 'Not assigned';
};

const emptyForm = { name: '', email: '', password: 'password', role: 'FACULTY', departmentCode: '', accessPages: '' };

const StaffManagement = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState('staff');
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingUserId, setEditingUserId] = useState(null);
  const [departmentForm, setDepartmentForm] = useState({ code: '', name: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [userData, branchData] = await Promise.all([userService.getUsers(), getAllBranches()]);
      setUsers(userData || []);
      setBranches(branchData || []);
    } catch (err) {
      setError(err.message || 'Unable to load staff records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);
  const handleChange = (field) => (event) => setForm(prev => ({ ...prev, [field]: event.target.value }));
  const handleDepartmentChange = (field) => (event) => setDepartmentForm(prev => ({ ...prev, [field]: event.target.value }));
  const isAdmin = currentUser?.role === 'ADMIN';
  const selectedAccessPages = parseAccessPages(form.accessPages) || [];

  const resetForm = () => {
    setForm(emptyForm);
    setEditingUserId(null);
  };

  const handleAccessToggle = (page) => {
    setForm(prev => {
      const pages = parseAccessPages(prev.accessPages) || [];
      const nextPages = pages.includes(page) ? pages.filter(item => item !== page) : [...pages, page];
      return { ...prev, accessPages: nextPages.join(',') };
    });
  };

  const handleEdit = (user) => {
    setEditingUserId(user.id);
    setForm({
      name: user.name || '',
      email: user.email || '',
      password: '',
      role: user.role || 'FACULTY',
      departmentCode: user.departmentCode || '',
      accessPages: user.accessPages || ''
    });
    setActiveTab('staff');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if ((form.role === 'HOD' || form.role === 'FACULTY') && !form.departmentCode) {
      setError('Please assign a department for teaching staff or HOD.');
      return;
    }
    try {
      if (editingUserId) {
        await userService.updateUser(editingUserId, form);
      } else {
        await userService.createUser(form);
      }
      resetForm();
      await loadData();
    } catch (err) {
      setError(err.message || 'Unable to save staff');
    }
  };

  const handleDepartmentSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await courseService.createCourse({ ...departmentForm, duration: 3 });
      setDepartmentForm({ code: '', name: '' });
      await loadData();
      setActiveTab('staff');
    } catch (err) {
      setError(err.message || 'Unable to add department');
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Remove login for ${user.name}?`)) return;
    try {
      await userService.deleteUser(user.id);
      await loadData();
    } catch (err) {
      setError(err.message || 'Unable to remove staff');
    }
  };

  const handleDepartmentDelete = async (branch) => {
    if (!branch.id) {
      setError('Unable to remove this department because it has no database id.');
      return;
    }
    if (!window.confirm(`Remove department ${branch.name}?`)) return;
    try {
      await courseService.deleteCourse(branch.id);
      await loadData();
    } catch (err) {
      setError(err.message || 'Unable to remove department');
    }
  };

  return (
    <div>
      <h2 style={{ margin: '0 0 8px', fontSize: '28px' }}>Staff/Department Management</h2>
      <p style={{ margin: '0 0 18px', color: '#667085' }}>Add staff logins, assign departments, and create new departments before assigning HODs.</p>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '22px' }}>
        <button onClick={() => setActiveTab('staff')} style={{ padding: '10px 14px', border: '1px solid #d0d5dd', borderRadius: '6px', background: activeTab === 'staff' ? '#175cd3' : '#fff', color: activeTab === 'staff' ? '#fff' : '#344054' }}>Staff</button>
        <button onClick={() => setActiveTab('departments')} style={{ padding: '10px 14px', border: '1px solid #d0d5dd', borderRadius: '6px', background: activeTab === 'departments' ? '#175cd3' : '#fff', color: activeTab === 'departments' ? '#fff' : '#344054' }}>Departments</button>
      </div>
      {error && <div style={{ padding: '12px', marginBottom: '18px', background: '#fff1f3', color: '#b42318', border: '1px solid #fecdd3', borderRadius: '6px' }}>{error}</div>}

      {activeTab === 'departments' ? (
        <>
          <form onSubmit={handleDepartmentSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '28px', padding: '18px', border: '1px solid #e4e7ec', borderRadius: '8px', background: '#f8fafc' }}>
            <input style={inputStyle} placeholder="Abbreviation, e.g. CO" value={departmentForm.code} onChange={handleDepartmentChange('code')} required />
            <input style={inputStyle} placeholder="Department name" value={departmentForm.name} onChange={handleDepartmentChange('name')} required />
            <button type="submit" style={{ padding: '10px 14px', border: 0, borderRadius: '6px', background: '#175cd3', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Add Department</button>
          </form>
          <div style={{ overflowX: 'auto', border: '1px solid #e4e7ec', borderRadius: '8px' }}>
            <table style={{ width: '100%', minWidth: '620px', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8fafc' }}><tr>{['Sr. No', 'Abbr', 'Department', 'Action'].map(h => <th key={h} style={{ textAlign: 'left', padding: '12px' }}>{h}</th>)}</tr></thead>
              <tbody>{branches.map((branch, index) => <tr key={branch.id || branch.code}><td style={{ padding: '12px', borderTop: '1px solid #eef2f6' }}>{index + 1}</td><td style={{ padding: '12px', borderTop: '1px solid #eef2f6' }}>{departmentAbbr(branch.code, branches)}</td><td style={{ padding: '12px', borderTop: '1px solid #eef2f6' }}>{branch.name}</td><td style={{ padding: '12px', borderTop: '1px solid #eef2f6' }}><button type="button" onClick={() => handleDepartmentDelete(branch)} style={{ padding: '7px 10px', border: '1px solid #fda29b', borderRadius: '6px', background: '#fff', color: '#b42318', cursor: 'pointer' }}>Remove</button></td></tr>)}</tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '28px', padding: '18px', border: '1px solid #e4e7ec', borderRadius: '8px', background: '#f8fafc' }}>
            <input style={inputStyle} placeholder="Name" value={form.name} onChange={handleChange('name')} required />
            <input style={inputStyle} placeholder="College email" type="email" value={form.email} onChange={handleChange('email')} required />
            <input style={inputStyle} placeholder={editingUserId ? 'New password (leave blank)' : 'Initial password'} value={form.password} onChange={handleChange('password')} required={!editingUserId} />
            <select style={inputStyle} value={form.role} onChange={handleChange('role')} required>
              {isAdmin && <option value="ADMIN">Admin</option>}
              <option value="PRINCIPAL">Principal</option>
              <option value="FACULTY">Teaching Staff</option>
              <option value="HOD">HOD</option>
              <option value="ACADEMIC_COORDINATOR">Academic Coordinator</option>
              <option value="OFFICE_STAFF">Office Staff</option>
              <option value="ENQUIRY_STAFF">Enquiry Staff</option>
            </select>
            <select style={inputStyle} value={form.departmentCode} onChange={handleChange('departmentCode')}>
              <option value="">Department</option>
              {branches.map(branch => <option key={branch.id || branch.code} value={branch.code}>{departmentAbbr(branch.code, branches)} - {branch.name}</option>)}
            </select>
            <button type="submit" style={{ padding: '10px 14px', border: 0, borderRadius: '6px', background: '#175cd3', color: 'white', fontWeight: 700, cursor: 'pointer' }}>{editingUserId ? 'Update Staff' : 'Add Staff'}</button>
            {editingUserId && <button type="button" onClick={resetForm} style={{ padding: '10px 14px', border: '1px solid #d0d5dd', borderRadius: '6px', background: '#fff', color: '#344054', fontWeight: 700, cursor: 'pointer' }}>Cancel Edit</button>}
          </form>

          {isAdmin && (
            <div style={{ marginBottom: '28px', padding: '18px', border: '1px solid #e4e7ec', borderRadius: '8px', background: '#fff' }}>
              <h3 style={{ margin: '0 0 12px', fontSize: '16px' }}>Specific Login Access</h3>
              <p style={{ margin: '0 0 14px', color: '#667085' }}>Leave all unchecked to use the default access for the selected role.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                {allMenuItems.map(item => (
                  <label key={item.page} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', border: '1px solid #eef2f6', borderRadius: '6px' }}>
                    <input type="checkbox" checked={selectedAccessPages.includes(item.page)} onChange={() => handleAccessToggle(item.page)} />
                    {item.label}
                  </label>
                ))}
              </div>
            </div>
          )}

          {loading ? <p>Loading staff...</p> : (
            <div style={{ overflowX: 'auto', border: '1px solid #e4e7ec', borderRadius: '8px' }}>
              <table style={{ width: '100%', minWidth: '760px', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f8fafc' }}><tr>{['Name', 'Email', 'Role', 'Department', 'Action'].map(header => <th key={header} style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #e4e7ec' }}>{header}</th>)}</tr></thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td style={{ padding: '12px', borderBottom: '1px solid #eef2f6' }}>{user.name}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #eef2f6' }}>{user.email}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #eef2f6' }}>{user.role}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #eef2f6' }}>{departmentAbbr(user.departmentCode, branches)}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #eef2f6' }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button onClick={() => handleEdit(user)} style={{ padding: '7px 10px', border: '1px solid #84caff', borderRadius: '6px', background: '#fff', color: '#175cd3', cursor: 'pointer' }}>Edit</button>
                          {user.role !== 'PRINCIPAL' && user.role !== 'ADMIN' && <button onClick={() => handleDelete(user)} style={{ padding: '7px 10px', border: '1px solid #fda29b', borderRadius: '6px', background: '#fff', color: '#b42318', cursor: 'pointer' }}>Remove</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StaffManagement;
export { departmentAbbr };

