import React, { useState, useEffect } from 'react';
import {
  getAllAdmissionTypes,
  getAllBranches,
  getAllEnquiryCategories,
  getAllLocations,
  getOptionValue
} from '../../services/lookupService';
import enquiryService from '../../services/enquiryService';
import { getEmailPresets } from '../../services/emailPresetService';
import { getAllFaculty } from '../../services/facultyService';
import logger from '../../services/loggerService';

const emptyMerit = { class10: '', class12: '', iti: '', other: '', otherDescription: '' };
const today = () => new Date().toISOString().split('T')[0];

const NewEnquiry = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    personalMobileNumber: '',
    guardianMobileNumber: '',
    email: '',
    merit: { ...emptyMerit },
    sscSeatNo: '',
    admissionFor: 'FY',
    location: '',
    otherLocation: '',
    category: '',
    branchesInterested: [],
    referenceFaculty: '',
    dteRegistrationDone: false,
    emailEnabled: false,
    selectedEmailPresetId: '',
    provisionalAdmission: false,
    enquiryDate: today(),
    provisionalAdmissionDate: ''
  });

  const [facultyOptions, setFacultyOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [admissionForOptions, setAdmissionForOptions] = useState([]);
  const [emailPresets, setEmailPresets] = useState([]);
  const [dropdownError, setDropdownError] = useState('');
  const [facultySearch, setFacultySearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');

  const refreshFacultyOptions = async () => {
    try {
      const faculties = await getAllFaculty();
      setFacultyOptions(faculties || []);
    } catch (error) {
      console.error('Error refreshing faculty data:', error);
    }
  };

  useEffect(() => {
    async function fetchDropdownData() {
      try {
        const [locations, categories, branches, admissionTypes, faculties, presets] = await Promise.all([
          getAllLocations(),
          getAllEnquiryCategories(),
          getAllBranches(),
          getAllAdmissionTypes(),
          getAllFaculty(),
          getEmailPresets('ENQUIRY').catch(() => [])
        ]);

        setLocationOptions(locations || []);
        setCategoryOptions(categories || []);
        setBranchOptions(branches || []);
        setAdmissionForOptions(admissionTypes || []);
        setFacultyOptions(faculties || []);
        setEmailPresets(presets || []);
        setDropdownError('');
      } catch (error) {
        console.error('Error fetching form dropdown data:', error);
        setDropdownError('Unable to load database dropdown data. Please check the backend connection.');
      }
    }
    fetchDropdownData();
  }, []);

  const [selectedBranches, setSelectedBranches] = useState([]);
  const [showOtherMeritDetails, setShowOtherMeritDetails] = useState(false);
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
        return prev.filter(b => b !== branch);
      } else {
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

      const enquiryData = {
        ...formData,
        branchesInterested: branchesData,
        sscSeatNo: formData.sscSeatNo.trim(),
        status: 'Pending'
      };

      console.log('Enquiry Data:', enquiryData);
      
      const response = await enquiryService.createEnquiry(enquiryData);
      logger.info('Enquiry submitted successfully', { enquiryData, response });
      
      alert('Enquiry submitted successfully!');
      
      setFormData({
        firstName: '',
        middleName: '',
        lastName: '',
        personalMobileNumber: '',
        guardianMobileNumber: '',
        email: '',
        merit: { ...emptyMerit },
        sscSeatNo: '',
        admissionFor: 'FY',
        location: '',
        otherLocation: '',
        category: '',
        branchesInterested: [],
        referenceFaculty: '',
        dteRegistrationDone: false,
        emailEnabled: false,
        selectedEmailPresetId: '',
        provisionalAdmission: false,
        enquiryDate: today(),
        provisionalAdmissionDate: ''
      });
      setSelectedBranches([]);
      setShowOtherMeritDetails(false);
    } catch (err) {
      console.error('Error submitting enquiry:', err);
      setError(err.response?.data?.error || err.message || 'Failed to submit enquiry');
      alert('Error: ' + (err.response?.data?.error || err.message || 'Failed to submit enquiry'));
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
    errorBox: {
      padding: '15px',
      marginBottom: '20px',
      background: '#f8d7da',
      border: '1px solid #f5c6cb',
      borderRadius: '8px',
      color: '#721c24'
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
    resetBtn: {
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
      <h2 style={styles.title}>📋 New Enquiry Form</h2>

      <div style={styles.container}>
        {(error || dropdownError) && (
          <div style={styles.errorBox}>
            {error || dropdownError}
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
                value={formData.sscSeatNo}
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
                value={formData.enquiryDate}
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
                {admissionForOptions.map(option => (
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

          {/* DTE Registration Section */}
          <h3 style={styles.sectionTitle}>🏢 DTE Registration</h3>
          <div style={styles.formGroup}>
            <label style={styles.label}>DTE Registration done or not</label>
            <div style={{ display: 'flex', gap: '15px', marginTop: '8px' }}>
              <button
                type="button"
                style={{
                  padding: '8px 24px',
                  background: formData.dteRegistrationDone ? '#2563eb' : '#e0e0e0',
                  color: formData.dteRegistrationDone ? 'white' : '#333',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  outline: formData.dteRegistrationDone ? '2px solid #2563eb' : 'none'
                }}
                onClick={() => setFormData(prev => ({ ...prev, dteRegistrationDone: true }))}
              >
                Yes
              </button>
              <button
                type="button"
                style={{
                  padding: '8px 24px',
                  background: !formData.dteRegistrationDone ? '#2563eb' : '#e0e0e0',
                  color: !formData.dteRegistrationDone ? 'white' : '#333',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  outline: !formData.dteRegistrationDone ? '2px solid #2563eb' : 'none'
                }}
                onClick={() => setFormData(prev => ({ ...prev, dteRegistrationDone: false }))}
              >
                No
              </button>
            </div>
          </div>

          {/* Reference Faculty Section */}
          <h3 style={styles.sectionTitle}>👨‍🏫 Reference Faculty</h3>
          <div style={styles.formGroup}>
            <label style={styles.label}>Reference Faculty</label>
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
                  value={formData.selectedEmailPresetId}
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
                  value={formData.provisionalAdmissionDate}
                  onChange={handleInputChange}
                  style={styles.input}
                  required={formData.provisionalAdmission}
                />
              </div>
            )}
          </div>

          {/* Button Group */}
          <div style={styles.buttonGroup}>
            <button
              type="reset"
              onClick={() => {
                setFormData({
                  firstName: '',
                  middleName: '',
                  lastName: '',
                  personalMobileNumber: '',
                  guardianMobileNumber: '',
                  email: '',
                  merit: { ...emptyMerit },
                  sscSeatNo: '',
                  admissionFor: 'FY',
                  location: '',
                  otherLocation: '',
                  category: '',
                  branchesInterested: [],
                  referenceFaculty: '',
                  dteRegistrationDone: false,
                  emailEnabled: false,
                  selectedEmailPresetId: '',
                  provisionalAdmission: false,
                  enquiryDate: today(),
                  provisionalAdmissionDate: ''
                });
                setSelectedBranches([]);
                setShowOtherMeritDetails(false);
                setError('');
              }}
              style={styles.resetBtn}
              disabled={loading}
              onMouseOver={(e) => !loading && (e.target.style.background = '#7f8c8d')}
              onMouseOut={(e) => !loading && (e.target.style.background = '#95a5a6')}
            >
              Reset
            </button>
            <button
              type="submit"
              style={styles.submitBtn}
              disabled={loading}
              onMouseOver={(e) => !loading && (e.target.style.background = '#1d4ed8')}
              onMouseOut={(e) => !loading && (e.target.style.background = '#2563eb')}
            >
              {loading ? 'Submitting...' : 'Submit Enquiry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewEnquiry;

