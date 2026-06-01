import React, { useState, useEffect } from 'react';
import enquiryService, { normalizeEnquiry } from '../../services/enquiryService';
import { getEmailPresets } from '../../services/emailPresetService';
import {
  getAllAdmissionTypes,
  getAllBranches,
  getAllEnquiryCategories,
  getAllEnquiryStatuses,
  getAllLocations,
  getOptionValue
} from '../../services/lookupService';
import { getAllFaculty } from '../../services/facultyService';

const emptyMerit = { class10: '', class12: '', iti: '', other: '', otherDescription: '' };
const today = () => new Date().toISOString().split('T')[0];

const UpdateEnquiry = ({ enquiry, onUpdate }) => {
  const normalizedEnquiry = normalizeEnquiry(enquiry);
  const [locationOptions, setLocationOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [admissionTypeOptions, setAdmissionTypeOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [facultyOptions, setFacultyOptions] = useState([]);
  const [emailPresets, setEmailPresets] = useState([]);
  const [nameSearch, setNameSearch] = useState('');
  const [facultySearch, setFacultySearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [searchMatches, setSearchMatches] = useState([]);
  const [searching, setSearching] = useState(false);

  // Fetch all dropdown data from database
  useEffect(() => {
    async function fetchDropdownData() {
      try {
        const [locations, categories, branches, admissionTypes, statuses, faculties, presets] = await Promise.all([
          getAllLocations(),
          getAllEnquiryCategories(),
          getAllBranches(),
          getAllAdmissionTypes(),
          getAllEnquiryStatuses(),
          getAllFaculty(),
          getEmailPresets('ENQUIRY').catch(() => [])
        ]);

        setLocationOptions(locations || []);
        setCategoryOptions(categories || []);
        setBranchOptions(branches || []);
        setAdmissionTypeOptions(admissionTypes || []);
        setStatusOptions(statuses || []);
        setFacultyOptions(faculties || []);
        setEmailPresets(presets || []);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    }
    fetchDropdownData();
  }, []);
  const [formData, setFormData] = useState(normalizedEnquiry || {
    firstName: '',
    middleName: '',
    lastName: '',
    personalMobileNumber: '',
    guardianMobileNumber: '',
    email: '',
    merit: { ...emptyMerit },
    admissionFor: 'FY',
    location: '',
    otherLocation: '',
    category: '',
    branchesInterested: [],
    referenceFaculty: '',
    sscSeatNo: '',
    dteRegistrationDone: false,
    emailEnabled: false,
    selectedEmailPresetId: '',
    provisionalAdmission: false,
    provisionalAdmissionDate: '',
    enquiryDate: today(),
    status: 'Pending'
  });
  const [showOtherMeritDetails, setShowOtherMeritDetails] = useState(
    Boolean(normalizedEnquiry?.merit?.other || normalizedEnquiry?.merit?.otherDescription)
  );

  const [selectedBranches, setSelectedBranches] = useState(() => {
    try {
      let branches = enquiry?.branchesInterested || [];
      // Parse if it's a JSON string
      if (typeof branches === 'string') {
        branches = JSON.parse(branches);
      }
      return Array.isArray(branches) ? branches.slice().sort((a, b) => Number(a.priority || 0) - Number(b.priority || 0)).map(b => b.branch) : [];
    } catch (e) {
      console.error('Error parsing branches:', e);
      return [];
    }
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const filteredFacultyOptions = facultyOptions.filter(faculty => (faculty.name || faculty.email || '').toLowerCase().includes(facultySearch.toLowerCase()));
  const filteredLocationOptions = locationOptions
    .filter(option => getOptionValue(option).toLowerCase().includes(locationSearch.toLowerCase()))
    .sort((left, right) => {
      const leftValue = getOptionValue(left).toLowerCase();
      const rightValue = getOptionValue(right).toLowerCase();
      if (leftValue === 'other') return -1;
      if (rightValue === 'other') return 1;
      return getOptionValue(left).localeCompare(getOptionValue(right));
    });
  const allowedStatusOptions = statusOptions.filter(option => ['pending', 'success'].includes(getOptionValue(option).toLowerCase()));

  const refreshFacultyOptions = async () => {
    try {
      const faculties = await getAllFaculty();
      setFacultyOptions(faculties || []);
    } catch (error) {
      console.error('Error refreshing faculty data:', error);
    }
  };

  const applyFetchedEnquiry = (fetched) => {
    const normalized = normalizeEnquiry(fetched);
    setFormData({
      ...normalized,
      selectedEmailPresetId: normalized.selectedEmailPresetId || ''
    });
    let branches = normalized.branchesInterested || [];
    if (typeof branches === 'string') {
      try {
        branches = JSON.parse(branches);
      } catch {
        branches = [];
      }
    }
    setSelectedBranches(Array.isArray(branches) ? branches.slice().sort((a, b) => Number(a.priority || 0) - Number(b.priority || 0)).map(b => b.branch) : []);
    setShowOtherMeritDetails(Boolean(normalized?.merit?.other || normalized?.merit?.otherDescription));
  };

  const getFullName = (item) => [item.firstName, item.middleName, item.lastName].filter(Boolean).join(' ');

  const handleNameSearch = async () => {
    if (!nameSearch.trim()) {
      setError('Enter student name to search enquiries');
      return;
    }
    setSearching(true);
    setError('');
    try {
      const data = await enquiryService.getAllEnquiries(0, 1000);
      const rows = Array.isArray(data?.content) ? data.content : (Array.isArray(data) ? data : []);
      const query = nameSearch.trim().toLowerCase();
      setSearchMatches(rows.filter(item => getFullName(item).toLowerCase().includes(query)));
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Unable to search enquiries');
    } finally {
      setSearching(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMeritChange = (classType, value) => {
    setFormData(prev => ({
      ...prev,
      merit: { ...prev.merit, [classType]: value }
    }));
  };

  const handleBranchToggle = (branch) => {
    setSelectedBranches(prev => {
      if (prev.includes(branch)) {
        // Remove branch
        return prev.filter(b => b !== branch);
      } else {
        // Add branch - priority will be automatically assigned based on order
        return [...prev, branch];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const branchesData = selectedBranches.map((branch, index) => ({
        branch,
        priority: index + 1
      }));

      const updatedData = {
        ...formData,
        sscSeatNo: (formData.sscSeatNo || '').trim(),
        branchesInterested: branchesData
      };

      const enquiryId = formData.id || enquiry?.id;
      if (enquiryId) {
        const response = await enquiryService.updateEnquiry(enquiryId, updatedData);
        alert('Enquiry updated successfully!');
        if (onUpdate) {
          onUpdate(response);
        }
      } else {
        console.error('No enquiry ID found');
        setError('Cannot update: No enquiry ID found');
      }
    } catch (err) {
      console.error('Error updating enquiry:', err);
      setError(err.response?.data?.error || err.message || 'Failed to update enquiry');
      alert('Error: ' + (err.response?.data?.error || err.message || 'Failed to update enquiry'));
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      background: 'white',
      padding: '35px',
      borderRadius: '15px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      maxWidth: '900px',
      margin: '0 auto'
    },
    title: {
      color: '#2c3e50',
      marginBottom: '30px',
      fontSize: '2em',
      fontWeight: '600'
    },
    sectionTitle: {
      color: '#34495e',
      fontSize: '1.2em',
      fontWeight: '600',
      marginTop: '25px',
      marginBottom: '15px',
      paddingBottom: '10px',
      borderBottom: '2px solid #e0e0e0'
    },
    formGroup: {
      marginBottom: '20px'
    },
    formGroupRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      color: '#2c3e50',
      fontWeight: '500',
      fontSize: '0.95em'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '1px solid #bdc3c7',
      borderRadius: '8px',
      fontSize: '0.95em',
      fontFamily: 'inherit',
      boxSizing: 'border-box',
      transition: 'border-color 0.3s'
    },
    select: {
      width: '100%',
      padding: '12px',
      border: '1px solid #bdc3c7',
      borderRadius: '8px',
      fontSize: '0.95em',
      fontFamily: 'inherit',
      boxSizing: 'border-box',
      backgroundColor: 'white'
    },
    branchContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '15px',
      marginTop: '15px'
    },
    branchItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px',
      border: '1px solid #ecf0f1',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    },
    checkbox: {
      width: '18px',
      height: '18px',
      cursor: 'pointer',
      accentColor: '#f0f0f0'
    },
    priorityInput: {
      width: '60px',
      padding: '8px',
      border: '1px solid #bdc3c7',
      borderRadius: '6px',
      fontSize: '0.85em',
      marginLeft: 'auto'
    },
    buttonGroup: {
      display: 'flex',
      gap: '15px',
      marginTop: '35px',
      justifyContent: 'flex-end'
    },
    submitBtn: {
      padding: '12px 30px',
      background: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1em',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background 0.3s'
    },
    cancelBtn: {
      padding: '12px 30px',
      background: '#95a5a6',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1em',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background 0.3s'
    }
  };

  return (
    <div>
      <h2 style={styles.title}>✏️ Update Enquiry</h2>

      <div style={styles.container}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Search Enquiry by Name</label>
            <input
              type="text"
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              style={styles.input}
              placeholder="Enter student name"
            />
          </div>
          <button
            type="button"
            onClick={handleNameSearch}
            disabled={searching}
            style={styles.submitBtn}
          >
            {searching ? 'Searching...' : 'Search'}
          </button>
        </div>
        {searchMatches.length > 0 && (
          <div style={{ marginBottom: '20px', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8fafc' }}>
                <tr>{['Name', 'Seat No', 'Email', 'Mobile', 'Action'].map(header => <th key={header} style={{ textAlign: 'left', padding: '10px' }}>{header}</th>)}</tr>
              </thead>
              <tbody>
                {searchMatches.map(item => (
                  <tr key={item.id}>
                    <td style={{ padding: '10px', borderTop: '1px solid #eef2f7' }}>{getFullName(item)}</td>
                    <td style={{ padding: '10px', borderTop: '1px solid #eef2f7' }}>{item.sscSeatNo || '-'}</td>
                    <td style={{ padding: '10px', borderTop: '1px solid #eef2f7' }}>{item.email}</td>
                    <td style={{ padding: '10px', borderTop: '1px solid #eef2f7' }}>{item.personalMobileNumber}</td>
                    <td style={{ padding: '10px', borderTop: '1px solid #eef2f7' }}>
                      <button type="button" style={styles.submitBtn} onClick={() => { applyFetchedEnquiry(item); setSearchMatches([]); }}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {error && (
          <div style={{
            padding: '15px',
            marginBottom: '20px',
            background: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '8px',
            color: '#721c24'
          }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {/* Personal Information Section */}
          <h3 style={styles.sectionTitle}>👤 Personal Information</h3>
          <div style={styles.formGroupRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Enter first name"
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Middle Name</label>
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Enter middle name"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Enter last name"
                required
              />
            </div>
          </div>

          {/* Contact Information Section */}
          <h3 style={styles.sectionTitle}>📱 Contact Information</h3>
          <div style={styles.formGroupRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Personal Mobile Number *</label>
              <input
                type="tel"
                name="personalMobileNumber"
                value={formData.personalMobileNumber}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="10-digit mobile number"
                pattern="[0-9]{10}"
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Guardian Mobile Number *</label>
              <input
                type="tel"
                name="guardianMobileNumber"
                value={formData.guardianMobileNumber}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="10-digit mobile number"
                pattern="[0-9]{10}"
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Enter email address"
                required
              />
            </div>
          </div>

          {/* Academic Information Section */}
          <h3 style={styles.sectionTitle}>📚 Academic Information</h3>
          <div style={styles.formGroupRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Class 10 Merit/Percentage</label>
              <input
                type="number"
                value={formData.merit.class10}
                onChange={(e) => handleMeritChange('class10', e.target.value)}
                style={styles.input}
                placeholder="0-100"
                min="0"
                max="100"
                step="0.01"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Class 12 Merit/Percentage</label>
              <input
                type="number"
                value={formData.merit.class12}
                onChange={(e) => handleMeritChange('class12', e.target.value)}
                style={styles.input}
                placeholder="0-100"
                min="0"
                max="100"
                step="0.01"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>ITI Marks/Percentage</label>
              <input
                type="number"
                value={formData.merit.iti}
                onChange={(e) => handleMeritChange('iti', e.target.value)}
                style={styles.input}
                placeholder="0-100"
                min="0"
                max="100"
                step="0.01"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>SSC Seat No *</label>
              <input
                type="text"
                name="sscSeatNo"
                value={formData.sscSeatNo || ''}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Enter SSC seat number"
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Other Merit/Percentage</label>
              <input
                type="number"
                value={formData.merit.other}
                onChange={(e) => handleMeritChange('other', e.target.value)}
                onFocus={() => setShowOtherMeritDetails(true)}
                style={styles.input}
                placeholder="0-100"
                min="0"
                max="100"
                step="0.01"
              />
            </div>
            {(showOtherMeritDetails || formData.merit.other || formData.merit.otherDescription) && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Other Marks Of</label>
                <input
                  type="text"
                  value={formData.merit.otherDescription}
                  onChange={(e) => handleMeritChange('otherDescription', e.target.value)}
                  style={styles.input}
                  placeholder="E.g. Diploma, COE, entrance test"
                  required={Boolean(formData.merit.other)}
                />
              </div>
            )}
          </div>

          {/* Admission Section */}
          <h3 style={styles.sectionTitle}>🎓 Admission Details</h3>
          <div style={styles.formGroupRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Enquiry Date *</label>
              <input
                type="date"
                name="enquiryDate"
                value={formData.enquiryDate || ''}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Admission For *</label>
              <select
                name="admissionFor"
                value={formData.admissionFor}
                onChange={handleInputChange}
                style={styles.select}
                required
              >
                <option value="">Select admission type</option>
                {admissionTypeOptions.map(option => (
                  <option key={option.id || option.code} value={getOptionValue(option)}>{getOptionValue(option)}</option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                style={styles.select}
                required
              >
                <option value="">Select category</option>
                {categoryOptions.map(option => (
                  <option key={option.id || option.code} value={getOptionValue(option)}>{getOptionValue(option)}</option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                style={styles.select}
              >
                {allowedStatusOptions.map(option => (
                  <option key={option.id || option.code} value={getOptionValue(option)}>{getOptionValue(option)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location Section */}
          <h3 style={styles.sectionTitle}>📍 Location</h3>
          <div style={styles.formGroupRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Location *</label>
              <input
                type="search"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                style={{ ...styles.input, marginBottom: '8px' }}
                placeholder="Search location"
              />
              <select
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                style={styles.select}
                required
              >
                <option value="">Select location</option>
                {filteredLocationOptions.map(option => (
                  <option key={option.id || option.code} value={getOptionValue(option)}>{getOptionValue(option)}</option>
                ))}
              </select>
            </div>

            {formData.location === 'Other' && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Other Location *</label>
                <input
                  type="text"
                  name="otherLocation"
                  value={formData.otherLocation}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Enter your location"
                  required={formData.location === 'Other'}
                />
              </div>
            )}
          </div>

          {/* Branch Interested Section */}
          <h3 style={styles.sectionTitle}>🔧 Branches Interested (Select in Priority Order)</h3>
          <p style={{ color: '#666', fontSize: '0.95em', marginBottom: '15px' }}>
            First selected = Priority 1, Second = Priority 2, and so on...
          </p>
          <div style={styles.branchContainer}>
            {branchOptions.map(branch => {
              const branchName = branch.branchName || branch.name || branch.label;
              const priority = selectedBranches.indexOf(branchName) + 1;
              const isSelected = selectedBranches.includes(branchName);
              return (
                <div key={branch.id || branch.branchCode || branchName} style={styles.branchItem}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                    <input
                      type="checkbox"
                      id={`branch-${branchName}`}
                      checked={isSelected}
                      onChange={() => handleBranchToggle(branchName)}
                      style={styles.checkbox}
                    />
                    <label htmlFor={`branch-${branchName}`} style={{ margin: 0, fontWeight: '500', cursor: 'pointer' }}>
                      {branch.label || branchName}
                    </label>
                  </div>
                  {isSelected && (
                    <span style={{
                      padding: '6px 12px',
                      background: '#e8e8e8',
                      color: 'white',
                      borderRadius: '6px',
                      fontSize: '0.85em',
                      fontWeight: '600',
                      marginLeft: 'auto'
                    }}>
                      Priority {priority}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <h3 style={styles.sectionTitle}>Email and Provisional Admission</h3>
          <div style={styles.formGroupRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Send email after enquiry</label>
              <select
                name="emailEnabled"
                value={formData.emailEnabled ? 'yes' : 'no'}
                onChange={(e) => setFormData(prev => ({ ...prev, emailEnabled: e.target.value === 'yes' }))}
                style={styles.select}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
            {formData.emailEnabled && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Email Preset</label>
                <select
                  name="selectedEmailPresetId"
                  value={formData.selectedEmailPresetId || ''}
                  onChange={handleInputChange}
                  style={styles.select}
                  required={formData.emailEnabled}
                >
                  <option value="">Select preset</option>
                  {emailPresets.map(preset => (
                    <option key={preset.id} value={preset.id}>{preset.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div style={styles.formGroup}>
              <label style={styles.label}>Provisional Admission</label>
              <select
                name="provisionalAdmission"
                value={formData.provisionalAdmission ? 'yes' : 'no'}
                onChange={(e) => setFormData(prev => ({ ...prev, provisionalAdmission: e.target.value === 'yes' }))}
                style={styles.select}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
            {formData.provisionalAdmission && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Provisional Admission Date *</label>
                <input
                  type="date"
                  name="provisionalAdmissionDate"
                  value={formData.provisionalAdmissionDate || ''}
                  onChange={handleInputChange}
                  style={styles.input}
                  required={formData.provisionalAdmission}
                />
              </div>
            )}
          </div>

          {/* Reference Faculty Section */}
          <h3 style={styles.sectionTitle}>👨‍🏫 Reference Faculty</h3>
          <div style={styles.formGroup}>
            <label style={styles.label}>Reference Faculty Name</label>
            <input
              type="search"
              value={facultySearch}
              onChange={(e) => setFacultySearch(e.target.value)}
              onFocus={refreshFacultyOptions}
              style={{ ...styles.input, marginBottom: '8px' }}
              placeholder="Search faculty"
            />
            <select
              name="referenceFaculty"
              value={formData.referenceFaculty}
              onChange={handleInputChange}
              onFocus={refreshFacultyOptions}
              style={styles.select}
            >
              <option value="">Select faculty</option>
              {filteredFacultyOptions.map(faculty => (
                <option key={faculty.id || faculty.employeeId || faculty.email} value={faculty.name || faculty.email}>
                  {faculty.name || faculty.email}
                </option>
              ))}
            </select>
          </div>

          {/* Button Group */}
          <div style={styles.buttonGroup}>
            <button
              type="button"
              style={styles.cancelBtn}
              disabled={loading}
              onMouseOver={(e) => e.target.style.background = '#7f8c8d'}
              onMouseOut={(e) => e.target.style.background = '#95a5a6'}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={styles.submitBtn}
              disabled={loading}
              onMouseOver={(e) => !loading && (e.target.style.background = '#1d4ed8')}
              onMouseOut={(e) => !loading && (e.target.style.background = '#2563eb')}
            >
              {loading ? 'Updating...' : 'Update Enquiry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateEnquiry;
