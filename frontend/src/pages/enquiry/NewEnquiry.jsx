import React, { useState, useEffect } from 'react';
import { facultyOptionsDummy } from '../../data/facultyOptionsDummy';
import {
  locationOptions,
  categoryOptions,
  branchOptions,
  admissionForOptions
} from '../../data/mockEnquiries';
import enquiryService from '../../services/enquiryService';
import { getAllFaculty } from '../../services/facultyService';
import logger from '../../services/loggerService';

const NewEnquiry = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    personalMobileNumber: '',
    guardianMobileNumber: '',
    email: '',
    merit: { class10: '', class12: '', other: '' },
    admissionFor: 'FY',
    location: '',
    otherLocation: '',
    category: '',
    branchesInterested: [],
    referenceFaculty: '',
    dteRegistrationDone: false
  });

  const [facultyOptions, setFacultyOptions] = useState([]);
  // Fetch faculty list for dropdown
  useEffect(() => {
    async function fetchFaculty() {
      const facultyList = await getAllFaculty();
      if (facultyList && facultyList.length > 0) {
        setFacultyOptions(facultyList);
      } else {
        setFacultyOptions(facultyOptionsDummy.map(name => ({ name })));
      }
    }
    fetchFaculty();
  }, []);
  const handleToggleDTE = () => {
    setFormData(prev => ({
      ...prev,
      dteRegistrationDone: !prev.dteRegistrationDone
    }));
  };

  const [selectedBranches, setSelectedBranches] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        enquiryDate: new Date().toISOString().split('T')[0],
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
        merit: { class10: '', class12: '', other: '' },
        admissionFor: 'FY',
        location: '',
        otherLocation: '',
        category: '',
        branchesInterested: [],
        referenceFaculty: ''
      });
      setSelectedBranches([]);
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
        {error && (
          <div style={styles.errorBox}>
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
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Other Merit/Percentage</label>
              <input
                type="number"
                value={formData.merit.other}
                onChange={(e) => handleMeritChange('other', e.target.value)}
                style={styles.input}
                placeholder="0-100"
                min="0"
                max="100"
              />
            </div>
          </div>

          {/* Admission Section */}
          <h3 style={styles.sectionTitle}>🎓 Admission Details</h3>
          <div style={styles.formGroupRow}>
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
                  <option key={option} value={option}>{option}</option>
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
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location Section */}
          <h3 style={styles.sectionTitle}>📍 Location</h3>
          <div style={styles.formGroupRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Location *</label>
              <select
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                style={styles.select}
                required
              >
                <option value="">Select location</option>
                {locationOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
                <option value="Other">Other (Specify Below)</option>
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
              const priority = selectedBranches.indexOf(branch) + 1;
              const isSelected = selectedBranches.includes(branch);
              return (
                <div key={branch} style={styles.branchItem}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                    <input
                      type="checkbox"
                      id={`branch-${branch}`}
                      checked={isSelected}
                      onChange={() => handleBranchToggle(branch)}
                      style={styles.checkbox}
                    />
                    <label htmlFor={`branch-${branch}`} style={{ margin: 0, fontWeight: '500', cursor: 'pointer' }}>
                      {branch}
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
            <select
              name="referenceFaculty"
              value={formData.referenceFaculty}
              onChange={handleInputChange}
              style={styles.select}
            >
              <option value="">Select faculty</option>
              {facultyOptions.map(faculty => (
                <option key={faculty.id || faculty.employeeId || faculty.email} value={faculty.name || faculty.email}>
                  {faculty.name || faculty.email}
                </option>
              ))}
            </select>
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
                  merit: { class10: '', class12: '', other: '' },
                  admissionFor: 'FY',
                  location: '',
                  otherLocation: '',
                  category: '',
                  branchesInterested: [],
                  referenceFaculty: '',
                  dteRegistrationDone: false
                });
                setSelectedBranches([]);
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
