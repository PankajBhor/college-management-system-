import React, { useState, useEffect } from 'react';
import './DSYAdmissionForm.css';
import { admissionService } from '../../services/admissionService';
import {
  getAllAdmissionRounds,
  getAllBloodGroups,
  getAllBranches,
  getAllCategories,
  getAllEducationalQualifications,
  getAllGenders,
  getAllYesNoOptions,
  getOptionValue
} from '../../services/lookupService';

const DSYAdmissionForm = ({ prefilledEnquiry }) => {
  const [branchOptions, setBranchOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [bloodGroupOptions, setBloodGroupOptions] = useState([]);
  const [yesNoOptions, setYesNoOptions] = useState([]);
  const [admissionRoundOptions, setAdmissionRoundOptions] = useState([]);
  const [qualificationOptions, setQualificationOptions] = useState([]);
  const [branchToCodeMap, setBranchToCodeMap] = useState({});
  const [codeToDisplayMap, setCodeToDisplayMap] = useState({});

  // Fetch branches from database on component mount
  useEffect(() => {
    async function fetchBranches() {
      try {
        const [branches, categories, genders, bloodGroups, yesNo, admissionRounds, qualifications] = await Promise.all([
          getAllBranches(),
          getAllCategories(),
          getAllGenders(),
          getAllBloodGroups(),
          getAllYesNoOptions(),
          getAllAdmissionRounds(),
          getAllEducationalQualifications()
        ]);
        setBranchOptions(branches || []);
        setCategoryOptions(categories || []);
        setGenderOptions(genders || []);
        setBloodGroupOptions(bloodGroups || []);
        setYesNoOptions(yesNo || []);
        setAdmissionRoundOptions(admissionRounds || []);
        setQualificationOptions(qualifications || []);
        
        // Create maps for branch conversions
        const btc = {};
        const ctd = {};
        branches?.forEach(branch => {
          btc[branch.branchName] = branch.branchCode;
          ctd[branch.branchCode] = `${branch.branchCode}. ${branch.branchName}`;
        });
        setBranchToCodeMap(btc);
        setCodeToDisplayMap(ctd);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    }
    fetchBranches();
  }, []);

  // Helper function to convert branch name to program code (uses database)
  const mapBranchToProgramNumber = (branchName) => {
    return branchToCodeMap[branchName] || '';
  };

  // Helper function to get program display name from code (uses database)
  const getProgramNameFromNumber = (code) => {
    return codeToDisplayMap[code] || '';
  };

  // Helper function to get location (handle "Other" case)
  const getLocationCity = (enquiry) => {
    if (!enquiry) return '';
    if (enquiry.location === 'Other') {
      return enquiry.otherLocation || '';
    }
    return enquiry.location || '';
  };

  // Helper function to determine which fields are pre-filled
  const getPrefilledFields = () => {
    if (!prefilledEnquiry) return new Set();
    return new Set([
      'applicantFirstName',
      'applicantMiddleName',
      'applicantLastName',
      'localAddress',
      'mobileNo',
      'studentEmail',
      'program',
      'category',
      'preference1',
      'preference2',
      'preference3',
      'preference4'
    ]);
  };

  const prefilledFields = getPrefilledFields();

  // Helper function to determine if field should have highlight class
  const shouldHighlightField = (fieldName) => {
    return prefilledFields.has(fieldName) && (formData[fieldName]);
  };

  const [formData, setFormData] = useState(() => {
    if (prefilledEnquiry) {
      // Get branch preferences from enquiry
      let branches = prefilledEnquiry.branchesInterested;
      let preference1 = '';
      let preference2 = '';
      let preference3 = '';
      let preference4 = '';

      if (typeof branches === 'string') {
        try {
          branches = JSON.parse(branches);
        } catch {
          branches = [];
        }
      }

      if (Array.isArray(branches)) {
        if (branches.length > 0) {
          preference1 = mapBranchToProgramNumber(branches[0].branch);
        }
        if (branches.length > 1) {
          preference2 = mapBranchToProgramNumber(branches[1].branch);
        }
        if (branches.length > 2) {
          preference3 = mapBranchToProgramNumber(branches[2].branch);
        }
        if (branches.length > 3) {
          preference4 = mapBranchToProgramNumber(branches[3].branch);
        }
      }

      // Use first branch as main program
      const mainProgram = preference1 ? getProgramNameFromNumber(preference1) : '';

      return {
        applicantFirstName: prefilledEnquiry.firstName || '',
        applicantMiddleName: prefilledEnquiry.middleName || '',
        applicantLastName: prefilledEnquiry.lastName || '',
        fatherFirstName: '',
        fatherMiddleName: '',
        fatherLastName: '',
        motherFirstName: '',
        motherMiddleName: '',
        motherLastName: '',
        localAddress: getLocationCity(prefilledEnquiry),
        localTal: '',
        localDist: '',
        localPinCode: '',
        permanentAddress: getLocationCity(prefilledEnquiry),
        permanentTal: '',
        permanentDist: '',
        permanentPinCode: '',
        occupation: '',
        annualIncome: '',
        mobileNo: prefilledEnquiry.personalMobileNumber || '',
        studentEmail: prefilledEnquiry.email || '',
        gender: '',
        dateOfBirth: '',
        bloodGroup: '',
        aadhaarNo: '',
        educationalQualification: '',
        instituteName: '',
        previousProgramCode: '',
        previousCGPA: '',
        scienceMarks: '',
        program: mainProgram,
        category: prefilledEnquiry.category || '',
        caste: '',
        physicallyHandicapped: 'No',
        admissionType: 'CAP-1',
        preference1: preference1,
        preference2: preference2,
        preference3: preference3,
        preference4: preference4
      };
    }

    return {
      applicantFirstName: '',
      applicantMiddleName: '',
      applicantLastName: '',
      fatherFirstName: '',
      fatherMiddleName: '',
      fatherLastName: '',
      motherFirstName: '',
      motherMiddleName: '',
      motherLastName: '',
      localAddress: '',
      localTal: '',
      localDist: '',
      localPinCode: '',
      permanentAddress: '',
      permanentTal: '',
      permanentDist: '',
      permanentPinCode: '',
      occupation: '',
      annualIncome: '',
      mobileNo: '',
      studentEmail: '',
      gender: '',
      dateOfBirth: '',
      bloodGroup: '',
      aadhaarNo: '',
      educationalQualification: '',
      instituteName: '',
      previousProgramCode: '',
      previousCGPA: '',
      scienceMarks: '',
      program: '',
      category: '',
      caste: '',
      physicallyHandicapped: 'No',
      admissionType: 'CAP-1',
      preference1: '',
      preference2: '',
      preference3: '',
      preference4: ''
    };
  });

  const [documents, setDocuments] = useState({
    domicileCertificate: null,
    sscMarkSheet: null,
    hscMarkSheet: null,
    casteCertificate: null,
    nonCreamyLayerCertificate: null,
    aadhaarCard: null
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const dsyDocuments = [
    { key: 'domicileCertificate', label: 'Domicile / Nationality Certificate' },
    { key: 'sscMarkSheet', label: 'SSC Mark sheet' },
    { key: 'hscMarkSheet', label: 'HSC/ITI/COE Mark sheet' },
    { key: 'casteCertificate', label: 'Caste Certificate' },
    { key: 'nonCreamyLayerCertificate', label: 'Non Creamy Layer Certificate' },
    { key: 'aadhaarCard', label: 'Xerox copy of Aadhaar Card' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.applicantFirstName.trim()) newErrors.applicantFirstName = 'First name is required';
    if (!formData.applicantLastName.trim()) newErrors.applicantLastName = 'Last name is required';
    if (!formData.localAddress.trim()) newErrors.localAddress = 'Local address is required';
    if (!formData.permanentAddress.trim()) newErrors.permanentAddress = 'Permanent address is required';
    if (!formData.mobileNo.match(/^[0-9]{10}$/)) newErrors.mobileNo = 'Mobile number must be 10 digits';
    if (!formData.studentEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.studentEmail = 'Invalid email';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.program) newErrors.program = 'Program selection is required';
    if (!formData.admissionType) newErrors.admissionType = 'Admission type is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDocumentUpload = (e, documentKey) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['application/pdf', 'image/png', 'image/jpeg'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload PDF, PNG, JPEG, or JPG files only');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size should not exceed 5MB');
        return;
      }
      setDocuments(prev => ({
        ...prev,
        [documentKey]: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fill all required fields correctly');
      return;
    }

    setLoading(true);
    try {
      await admissionService.createDSYAdmission(formData, documents);
      setSubmitted(true);
      alert('DSY Admission form submitted successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      alert('Error submitting form: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="submission-success">
        <div className="success-card">
          <h2>✓ Form Submitted Successfully</h2>
          <p>Your DSY Admission application has been received.</p>
          <p>Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dsy-admission-form">
      <h1>Direct Second Year (DSY) Diploma Admission Form</h1>
      <p className="form-subtitle">Jaihind Comprehensive Educational Institute - Jaihind Polytechnic Kuran</p>

      <form onSubmit={handleSubmit}>
        {/* Personal Information Section */}
        <fieldset className="form-section">
          <legend>Personal Information</legend>
          
          <div className="form-row">
            <div className="form-group">
              <label>Applicant First Name <span className="required">*</span></label>
              <input
                type="text"
                name="applicantFirstName"
                value={formData.applicantFirstName}
                onChange={handleInputChange}
                placeholder="Enter first name"
                className={`${errors.applicantFirstName ? 'input-error' : ''} ${shouldHighlightField('applicantFirstName') ? 'field-prefilled' : ''}`.trim()}
              />
              {errors.applicantFirstName && <span className="error-text">{errors.applicantFirstName}</span>}
            </div>

            <div className="form-group">
              <label>Applicant Middle Name</label>
              <input
                type="text"
                name="applicantMiddleName"
                value={formData.applicantMiddleName}
                onChange={handleInputChange}
                placeholder="Enter middle name"
                className={shouldHighlightField('applicantMiddleName') ? 'field-prefilled' : ''}
              />
            </div>

            <div className="form-group">
              <label>Applicant Last Name <span className="required">*</span></label>
              <input
                type="text"
                name="applicantLastName"
                value={formData.applicantLastName}
                onChange={handleInputChange}
                placeholder="Enter last name"
                className={`${errors.applicantLastName ? 'input-error' : ''} ${shouldHighlightField('applicantLastName') ? 'field-prefilled' : ''}`.trim()}
              />
              {errors.applicantLastName && <span className="error-text">{errors.applicantLastName}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Father's First Name</label>
              <input
                type="text"
                name="fatherFirstName"
                value={formData.fatherFirstName}
                onChange={handleInputChange}
                placeholder="Enter first name"
              />
            </div>

            <div className="form-group">
              <label>Father's Middle Name</label>
              <input
                type="text"
                name="fatherMiddleName"
                value={formData.fatherMiddleName}
                onChange={handleInputChange}
                placeholder="Enter middle name"
              />
            </div>

            <div className="form-group">
              <label>Father's Last Name</label>
              <input
                type="text"
                name="fatherLastName"
                value={formData.fatherLastName}
                onChange={handleInputChange}
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Mother's First Name</label>
              <input
                type="text"
                name="motherFirstName"
                value={formData.motherFirstName}
                onChange={handleInputChange}
                placeholder="Enter first name"
              />
            </div>

            <div className="form-group">
              <label>Mother's Middle Name</label>
              <input
                type="text"
                name="motherMiddleName"
                value={formData.motherMiddleName}
                onChange={handleInputChange}
                placeholder="Enter middle name"
              />
            </div>

            <div className="form-group">
              <label>Mother's Last Name</label>
              <input
                type="text"
                name="motherLastName"
                value={formData.motherLastName}
                onChange={handleInputChange}
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Gender <span className="required">*</span></label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={errors.gender ? 'input-error' : ''}
              >
                <option value="">Select Gender</option>
                {genderOptions.map(option => {
                  const value = getOptionValue(option);
                  return <option key={option.id || option.code || value} value={value}>{value}</option>;
                })}
              </select>
              {errors.gender && <span className="error-text">{errors.gender}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date of Birth <span className="required">*</span></label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className={errors.dateOfBirth ? 'input-error' : ''}
              />
              {errors.dateOfBirth && <span className="error-text">{errors.dateOfBirth}</span>}
            </div>

            <div className="form-group">
              <label>Blood Group</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleInputChange}
              >
                <option value="">Select Blood Group</option>
                {bloodGroupOptions.map(option => {
                  const value = getOptionValue(option);
                  return <option key={option.id || option.code || value} value={value}>{value}</option>;
                })}
              </select>
            </div>
          </div>
        </fieldset>

        {/* Address Information Section */}
        <fieldset className="form-section">
          <legend>Local Address</legend>
          
          <div className="form-row">
            <div className="form-group full-width">
              <label>Local Address <span className="required">*</span></label>
              <input
                type="text"
                name="localAddress"
                value={formData.localAddress}
                onChange={handleInputChange}
                placeholder="Enter local address"
                className={`${errors.localAddress ? 'input-error' : ''} ${shouldHighlightField('localAddress') ? 'field-prefilled' : ''}`.trim()}
              />
              {errors.localAddress && <span className="error-text">{errors.localAddress}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tal (Taluka)</label>
              <input
                type="text"
                name="localTal"
                value={formData.localTal}
                onChange={handleInputChange}
                placeholder="Enter taluka"
              />
            </div>

            <div className="form-group">
              <label>Dist (District)</label>
              <input
                type="text"
                name="localDist"
                value={formData.localDist}
                onChange={handleInputChange}
                placeholder="Enter district"
              />
            </div>

            <div className="form-group">
              <label>Pin Code</label>
              <input
                type="text"
                name="localPinCode"
                value={formData.localPinCode}
                onChange={handleInputChange}
                placeholder="Enter pin code"
              />
            </div>
          </div>
        </fieldset>

        {/* Permanent Address Section */}
        <fieldset className="form-section">
          <legend>Permanent Address</legend>
          
          <div className="form-row">
            <div className="form-group full-width">
              <label>Permanent Address <span className="required">*</span></label>
              <input
                type="text"
                name="permanentAddress"
                value={formData.permanentAddress}
                onChange={handleInputChange}
                placeholder="Enter permanent address"
                className={errors.permanentAddress ? 'input-error' : ''}
              />
              {errors.permanentAddress && <span className="error-text">{errors.permanentAddress}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tal (Taluka)</label>
              <input
                type="text"
                name="permanentTal"
                value={formData.permanentTal}
                onChange={handleInputChange}
                placeholder="Enter taluka"
              />
            </div>

            <div className="form-group">
              <label>Dist (District)</label>
              <input
                type="text"
                name="permanentDist"
                value={formData.permanentDist}
                onChange={handleInputChange}
                placeholder="Enter district"
              />
            </div>

            <div className="form-group">
              <label>Pin Code</label>
              <input
                type="text"
                name="permanentPinCode"
                value={formData.permanentPinCode}
                onChange={handleInputChange}
                placeholder="Enter pin code"
              />
            </div>
          </div>
        </fieldset>

        {/* Contact Information Section */}
        <fieldset className="form-section">
          <legend>Contact Information</legend>
          
          <div className="form-row">
            <div className="form-group">
              <label>Mobile Number <span className="required">*</span></label>
              <input
                type="tel"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleInputChange}
                placeholder="Enter 10-digit mobile number"
                className={`${errors.mobileNo ? 'input-error' : ''} ${shouldHighlightField('mobileNo') ? 'field-prefilled' : ''}`.trim()}
              />
              {errors.mobileNo && <span className="error-text">{errors.mobileNo}</span>}
            </div>

            <div className="form-group">
              <label>Email <span className="required">*</span></label>
              <input
                type="email"
                name="studentEmail"
                value={formData.studentEmail}
                onChange={handleInputChange}
                placeholder="Enter email address"
                className={`${errors.studentEmail ? 'input-error' : ''} ${shouldHighlightField('studentEmail') ? 'field-prefilled' : ''}`.trim()}
              />
              {errors.studentEmail && <span className="error-text">{errors.studentEmail}</span>}
            </div>
          </div>
        </fieldset>

        {/* Identification Section */}
        <fieldset className="form-section">
          <legend>Identification</legend>
          
          <div className="form-row">
            <div className="form-group">
              <label>Aadhaar Number (UID) <span className="required">*</span></label>
              <input
                type="text"
                name="aadhaarNo"
                value={formData.aadhaarNo}
                onChange={handleInputChange}
                placeholder="Enter Aadhaar number"
                required
              />
            </div>
          </div>
        </fieldset>

        {/* Educational Qualification Section */}
        <fieldset className="form-section">
          <legend>Educational Qualification</legend>
          
          <div className="form-row">
            <div className="form-group">
              <label>Educational Qualification</label>
              <select
                name="educationalQualification"
                value={formData.educationalQualification}
                onChange={handleInputChange}
              >
                <option value="">Select Qualification</option>
                {qualificationOptions.map(option => {
                  const value = getOptionValue(option);
                  return <option key={option.id || option.code || value} value={value}>{value}</option>;
                })}
              </select>
            </div>

            <div className="form-group">
              <label>Institute Name</label>
              <input
                type="text"
                name="instituteName"
                value={formData.instituteName}
                onChange={handleInputChange}
                placeholder="Enter institute name"
              />
            </div>

            <div className="form-group">
              <label>Previous Program Code</label>
              <input
                type="text"
                name="previousProgramCode"
                value={formData.previousProgramCode}
                onChange={handleInputChange}
                placeholder="Enter program code"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Previous CGPA</label>
              <input
                type="number"
                step="0.01"
                name="previousCGPA"
                value={formData.previousCGPA}
                onChange={handleInputChange}
                placeholder="Enter CGPA"
              />
            </div>

            <div className="form-group">
              <label>Science Marks</label>
              <input
                type="number"
                step="0.01"
                name="scienceMarks"
                value={formData.scienceMarks}
                onChange={handleInputChange}
                placeholder="Enter Science marks"
              />
            </div>
          </div>
        </fieldset>

        {/* Program and Category Section */}
        <fieldset className="form-section">
          <legend>Program and Category</legend>
          
          <div className="form-row">
            <div className="form-group">
              <label>Select Program <span className="required">*</span></label>
              <select
                name="program"
                value={formData.program}
                onChange={handleInputChange}
                className={`${errors.program ? 'input-error' : ''} ${shouldHighlightField('program') ? 'field-prefilled' : ''}`.trim()}
              >
                <option value="">Select Program</option>
                {branchOptions.map(branch => (
                  <option key={branch.id || branch.branchCode} value={branch.label}>{branch.label}</option>
                ))}
              </select>
              {errors.program && <span className="error-text">{errors.program}</span>}
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={shouldHighlightField('category') ? 'field-prefilled' : ''}
              >
                <option value="">Select Category</option>
                {categoryOptions.map(option => {
                  const value = getOptionValue(option);
                  return <option key={option.id || option.code || value} value={value}>{value}</option>;
                })}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Caste</label>
              <input
                type="text"
                name="caste"
                value={formData.caste}
                onChange={handleInputChange}
                placeholder="Enter caste"
              />
            </div>

            <div className="form-group">
              <label>Annual Income (Rs.)</label>
              <input
                type="text"
                name="annualIncome"
                value={formData.annualIncome}
                onChange={handleInputChange}
                placeholder="Enter annual income"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Physically Handicapped</label>
              <select
                name="physicallyHandicapped"
                value={formData.physicallyHandicapped}
                onChange={handleInputChange}
              >
                {yesNoOptions.map(option => {
                  const value = getOptionValue(option);
                  return <option key={option.id || option.code || value} value={value}>{value}</option>;
                })}
              </select>
            </div>

            <div className="form-group">
              <label>Admission Type <span className="required">*</span></label>
              <select
                name="admissionType"
                value={formData.admissionType}
                onChange={handleInputChange}
                className={errors.admissionType ? 'input-error' : ''}
              >
                <option value="">Select Admission Type</option>
                {admissionRoundOptions.map(option => {
                  const value = getOptionValue(option);
                  return <option key={option.id || option.code || value} value={value}>{value}</option>;
                })}
              </select>
              {errors.admissionType && <span className="error-text">{errors.admissionType}</span>}
            </div>
          </div>
        </fieldset>

        {/* Program Preferences Section */}
        <fieldset className="form-section">
          <legend>Program Preferences (In Order of Preference)</legend>
          
          <div className="form-row">
            <div className="form-group">
              <label>Preference 1</label>
              <select
                name="preference1"
                value={formData.preference1}
                onChange={handleInputChange}
                className={shouldHighlightField('preference1') ? 'field-prefilled' : ''}
              >
                <option value="">Select Preference</option>
                {branchOptions.map(branch => (
                  <option key={branch.id || branch.branchCode} value={branch.branchCode}>{branch.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Preference 2</label>
              <select
                name="preference2"
                value={formData.preference2}
                onChange={handleInputChange}
                className={shouldHighlightField('preference2') ? 'field-prefilled' : ''}
              >
                <option value="">Select Preference</option>
                {branchOptions.map(branch => (
                  <option key={branch.id || branch.branchCode} value={branch.branchCode}>{branch.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Preference 3</label>
              <select
                name="preference3"
                value={formData.preference3}
                onChange={handleInputChange}
                className={shouldHighlightField('preference3') ? 'field-prefilled' : ''}
              >
                <option value="">Select Preference</option>
                {branchOptions.map(branch => (
                  <option key={branch.id || branch.branchCode} value={branch.branchCode}>{branch.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Preference 4</label>
              <select
                name="preference4"
                value={formData.preference4}
                onChange={handleInputChange}
                className={shouldHighlightField('preference4') ? 'field-prefilled' : ''}
              >
                <option value="">Select Preference</option>
                {branchOptions.map(branch => (
                  <option key={branch.id || branch.branchCode} value={branch.branchCode}>{branch.label}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        {/* Document Upload Section */}
        <fieldset className="form-section documents-section dsy-documents">
          <legend>Required Documents for Direct Second Year Admission (6 Documents)</legend>
          
          <div className="documents-upload-grid">
            {dsyDocuments.map((doc, index) => (
              <div key={doc.key} className="document-upload-item">
                <label className="document-label">
                  <span className="doc-number">{index + 1}.</span>
                  <span className="doc-name">{doc.label}</span>
                </label>
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    id={`dsy-${doc.key}`}
                    onChange={(e) => handleDocumentUpload(e, doc.key)}
                    className="file-input"
                  />
                  <label htmlFor={`dsy-${doc.key}`} className="file-label">
                    {documents[doc.key] ? (
                      <span className="file-selected">✓ {documents[doc.key].name}</span>
                    ) : (
                      <span className="file-placeholder">Choose PDF File</span>
                    )}
                  </label>
                </div>
              </div>
            ))}
          </div>
          
          <div className="documents-notes">
            <p><strong>Note:</strong> All documents must be in PDF, PNG, JPEG, or JPG format. Maximum file size: 5MB each.</p>
          </div>
        </fieldset>

        {/* Undertaking Section */}
        <fieldset className="form-section undertaking">
          <legend>Undertakings</legend>
          
          <div className="undertaking-text">
            <h3>Legal Guardian Undertaking:</h3>
            <p>
              In lieu of JCEI's Jaihind Polytechnic Kuran considering the application of {formData.applicantFirstName} {formData.applicantLastName} 
              for admission to Direct Second Year Diploma Program, I hereby agree & undertaking that at the 
              test (Tuition Fee + Development Fee) & other charges & / or Fees decide by the Maharashtra 
              State board of Technical Education, Fees Fixation Committee are more than the Interim Fees 
              for the current academic year, then I will pay the difference on the Institute on demand. 
              I shall also pay the fees & other charges decided by State Government/DTE/ Fees Fixation 
              Committee for the subsequent academic years from time to time.
            </p>
          </div>

          <div className="undertaking-text">
            <h3>Academic Year Undertaking (2025-2026):</h3>
            <ul>
              <li>I Mr/Mrs {formData.applicantFirstName} {formData.applicantLastName} students of 2nd year admission will attend all theory lectures & practicals.</li>
              <li>I will appear for all the program tests & will pass with minimum 50% marks.</li>
              <li>I will not involve in any sort of common off.</li>
              <li>I will follow all the rules & regulations laid down by the DTE, MSBTE & Institute from time to time.</li>
              <li>I am aware that if in case my attendance falls below 75%, I will be detained as per MSBTE norms.</li>
              <li>If I fail to abide by my one of the above, I know that I will not be allowed to appear for the MSBTE examination of the semester & I know that it will cause loss of my academic program.</li>
            </ul>
          </div>

          <div className="undertaking-text">
            <h3>Anti-Ragging Undertaking:</h3>
            <p>
              Mr./Mrs {formData.applicantFirstName} {formData.applicantLastName} Program ________, hereby undertake that if any incident 
              of ragging by me comes to the notice of the Institute authority, I shall be given liberty 
              to explain & if my explanation is not found satisfactory, the Principal or the Anti-Ragging 
              Committee my expel me from the Institute.
            </p>
          </div>
        </fieldset>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-success"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
          <button
            type="reset"
            className="btn btn-secondary"
            onClick={() => setFormData({...formData})}
          >
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default DSYAdmissionForm;
