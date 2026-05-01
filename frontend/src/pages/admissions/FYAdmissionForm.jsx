import React, { useState, useEffect } from 'react';
import './FYAdmissionForm.css';
import { admissionService } from '../../services/admissionService';
import {
  getAllAdmissionRounds,
  getAllBloodGroups,
  getAllBranches,
  getAllCategories,
  getAllGenders,
  getAllYesNoOptions,
  getOptionValue
} from '../../services/lookupService';

const FYAdmissionForm = ({ prefilledEnquiry }) => {
  const [branchOptions, setBranchOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [bloodGroupOptions, setBloodGroupOptions] = useState([]);
  const [yesNoOptions, setYesNoOptions] = useState([]);
  const [admissionRoundOptions, setAdmissionRoundOptions] = useState([]);
  const [branchMap, setBranchMap] = useState({});

  // Fetch branches from database on component mount
  useEffect(() => {
    async function fetchBranches() {
      try {
        const [branches, categories, genders, bloodGroups, yesNo, admissionRounds] = await Promise.all([
          getAllBranches(),
          getAllCategories(),
          getAllGenders(),
          getAllBloodGroups(),
          getAllYesNoOptions(),
          getAllAdmissionRounds()
        ]);
        setBranchOptions(branches || []);
        setCategoryOptions(categories || []);
        setGenderOptions(genders || []);
        setBloodGroupOptions(bloodGroups || []);
        setYesNoOptions(yesNo || []);
        setAdmissionRoundOptions(admissionRounds || []);
        
        // Create map for branch name to display format
        const map = {};
        branches?.forEach(branch => {
          map[branch.branchName] = `${branch.branchCode}. ${branch.branchName}`;
        });
        setBranchMap(map);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    }
    fetchBranches();
  }, []);

  // Helper function to get program name from branch name (uses database-driven map)
  const mapBranchToProgram = (branchName) => {
    return branchMap[branchName] || '';
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
      'villageCity',
      'mobileNo',
      'studentEmail',
      'program',
      'category',
      'marksObtained'
    ]);
  };

  const prefilledFields = getPrefilledFields();

  // Helper function to determine if field should have highlight class
  const shouldHighlightField = (fieldName) => {
    return prefilledFields.has(fieldName) && (formData[fieldName]);
  };

  const [formData, setFormData] = useState(() => {
    if (prefilledEnquiry) {
      // Get first branch preference if available
      let branches = prefilledEnquiry.branchesInterested;
      let firstBranch = '';
      if (typeof branches === 'string') {
        try {
          branches = JSON.parse(branches);
        } catch {
          branches = [];
        }
      }
      if (Array.isArray(branches) && branches.length > 0) {
        firstBranch = mapBranchToProgram(branches[0].branch);
      }

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
        villageCity: getLocationCity(prefilledEnquiry),
        tal: '',
        dist: '',
        pinCode: '',
        occupation: '',
        mobileNo: prefilledEnquiry.personalMobileNumber || '',
        studentEmail: prefilledEnquiry.email || '',
        gender: '',
        dateOfBirth: '',
        bloodGroup: '',
        aadhaarNo: '',
        schoolName: '',
        yop: '',
        marksObtained: prefilledEnquiry.merit?.class10 || '',
        totalMarks: '',
        englishMarks: '',
        mathMarks: '',
        scienceMarks: '',
        bestOfFiveMarks: '',
        program: firstBranch,
        category: prefilledEnquiry.category || '',
        caste: '',
        annualIncome: '',
        physicallyHandicapped: 'No',
        admissionType: 'CAP-1'
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
      villageCity: '',
      tal: '',
      dist: '',
      pinCode: '',
      occupation: '',
      mobileNo: '',
      studentEmail: '',
      gender: '',
      dateOfBirth: '',
      bloodGroup: '',
      aadhaarNo: '',
      schoolName: '',
      yop: '',
      marksObtained: '',
      totalMarks: '',
      englishMarks: '',
      mathMarks: '',
      scienceMarks: '',
      bestOfFiveMarks: '',
      program: '',
      category: '',
      caste: '',
      annualIncome: '',
      physicallyHandicapped: 'No',
      admissionType: 'CAP-1'
    };
  });

  const [documents, setDocuments] = useState({
    domicileCertificate: null,
    tenthMarkSheet: null,
    twelfthMarkSheet: null,
    leavingCertificate: null,
    casteCertificate: null,
    nonCreamyLayerCertificate: null,
    incomeCertificate: null,
    defenceCertificate: null,
    aadhaarCard: null,
    anyOther: null
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const fyDocuments = [
    { key: 'domicileCertificate', label: 'Domicile / Nationality Certificate' },
    { key: 'tenthMarkSheet', label: '10th Mark sheet' },
    { key: 'twelfthMarkSheet', label: '12th/ITI Mark sheet' },
    { key: 'leavingCertificate', label: 'Leaving Certificate' },
    { key: 'casteCertificate', label: 'Caste Certificate (if required)' },
    { key: 'nonCreamyLayerCertificate', label: 'Non Creamy Layer certificate' },
    { key: 'incomeCertificate', label: 'Income Certificate' },
    { key: 'defenceCertificate', label: 'Defence Certificate' },
    { key: 'aadhaarCard', label: 'Aadhaar Card' },
    { key: 'anyOther', label: 'Any Other' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.applicantFirstName.trim()) newErrors.applicantFirstName = 'First name is required';
    if (!formData.applicantLastName.trim()) newErrors.applicantLastName = 'Last name is required';
    if (!formData.villageCity.trim()) newErrors.villageCity = 'Village/City is required';
    if (!formData.mobileNo.match(/^[0-9]{10}$/)) newErrors.mobileNo = 'Mobile number must be 10 digits';
    if (!formData.studentEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.studentEmail = 'Invalid email';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.program) newErrors.program = 'Program selection is required';
    if (!formData.admissionType) newErrors.admissionType = 'Admission type is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fill all required fields correctly');
      return;
    }

    setLoading(true);
    try {
      await admissionService.createFYAdmission(formData, documents);
      setSubmitted(true);
      alert('FY Admission form submitted successfully!');
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
          <p>Your FY Admission application has been received.</p>
          <p>Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fy-admission-form">
      <h1>First Year (FY) Diploma Admission Form</h1>
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
          <legend>Address Information (Parents Address)</legend>
          
          <div className="form-row">
            <div className="form-group">
              <label>Village/City <span className="required">*</span></label>
              <input
                type="text"
                name="villageCity"
                value={formData.villageCity}
                onChange={handleInputChange}
                placeholder="Enter village/city"
                className={`${errors.villageCity ? 'input-error' : ''} ${shouldHighlightField('villageCity') ? 'field-prefilled' : ''}`.trim()}
              />
              {errors.villageCity && <span className="error-text">{errors.villageCity}</span>}
            </div>

            <div className="form-group">
              <label>Tal (Taluka)</label>
              <input
                type="text"
                name="tal"
                value={formData.tal}
                onChange={handleInputChange}
                placeholder="Enter taluka"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Dist (District)</label>
              <input
                type="text"
                name="dist"
                value={formData.dist}
                onChange={handleInputChange}
                placeholder="Enter district"
              />
            </div>

            <div className="form-group">
              <label>Pin Code</label>
              <input
                type="text"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleInputChange}
                placeholder="Enter pin code"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Occupation</label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
                placeholder="Enter occupation"
              />
            </div>

            <div className="form-group">
              <label>Annual Income (Rs.)</label>
              <input
                type="number"
                name="annualIncome"
                value={formData.annualIncome}
                onChange={handleInputChange}
                placeholder="Enter annual income"
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

        {/* Education Details Section */}
        <fieldset className="form-section">
          <legend>Previous Examination Details (SSC)</legend>
          
          <div className="form-row">
            <div className="form-group">
              <label>School Name</label>
              <input
                type="text"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleInputChange}
                placeholder="Enter school name"
              />
            </div>

            <div className="form-group">
              <label>Year of Passing</label>
              <input
                type="number"
                name="yop"
                value={formData.yop}
                onChange={handleInputChange}
                placeholder="Enter year"
              />
            </div>

            <div className="form-group">
              <label>Total Marks</label>
              <input
                type="number"
                step="0.01"
                name="totalMarks"
                value={formData.totalMarks}
                onChange={handleInputChange}
                placeholder="Enter total marks"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Marks Obtained</label>
              <input
                type="number"
                step="0.01"
                name="marksObtained"
                value={formData.marksObtained}
                onChange={handleInputChange}
                placeholder="Enter marks"
                className={shouldHighlightField('marksObtained') ? 'field-prefilled' : ''}
              />
            </div>

            <div className="form-group">
              <label>English Marks</label>
              <input
                type="number"
                step="0.01"
                name="englishMarks"
                value={formData.englishMarks}
                onChange={handleInputChange}
                placeholder="Enter English marks"
              />
            </div>

            <div className="form-group">
              <label>Mathematics Marks</label>
              <input
                type="number"
                step="0.01"
                name="mathMarks"
                value={formData.mathMarks}
                onChange={handleInputChange}
                placeholder="Enter Mathematics marks"
              />
            </div>
          </div>

          <div className="form-row">
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

            <div className="form-group">
              <label>Best of Five Percentage (%)</label>
              <input
                type="number"
                step="0.01"
                name="bestOfFiveMarks"
                value={formData.bestOfFiveMarks}
                onChange={handleInputChange}
                placeholder="Enter percentage (0-100)"
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
          </div>

          <div className="form-row">
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

        {/* Document Upload Section */}
        <fieldset className="form-section documents-section fy-documents">
          <legend>Required Documents for First Year Admission (10 Documents)</legend>
          
          <div className="documents-upload-grid">
            {fyDocuments.map((doc, index) => (
              <div key={doc.key} className="document-upload-item">
                <label className="document-label">
                  <span className="doc-number">{index + 1}.</span>
                  <span className="doc-name">{doc.label}</span>
                </label>
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    id={`fy-${doc.key}`}
                    onChange={(e) => handleDocumentUpload(e, doc.key)}
                    className="file-input"
                  />
                  <label htmlFor={`fy-${doc.key}`} className="file-label">
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
              In lieu of JCEI's Jaihind Polytechnic Kuran, Tal. Junnar, Dist. Pune considering the 
              application of Mr./Mrs. {formData.applicantFirstName} {formData.applicantLastName} for admission to Diploma in 
              _____________ (Program), I hereby agree & undertaking that at the test (Tuition Fee + Development Fee) 
              & other charges & / or Fees decide by the Maharashtra State board of Technical Education, 
              Fees Fixation Committee are more than the Interim Fees for the current academic year, 
              then I will pay the difference on the Institute on demand. I shall also pay the fees & 
              other charges decided by State Government/DTE/ Fees Fixation Committee for the subsequent 
              academic years from time to time.
            </p>
          </div>

          <div className="undertaking-text">
            <h3>Academic Year Undertaking (2025-2026):</h3>
            <ul>
              <li>I Mr/Mrs {formData.applicantFirstName} {formData.applicantLastName} students of 2nd year Diploma in CIVIL Engg/Tech. will attend all theory lectures & practicals.</li>
              <li>I will appear for all the program tests & will pass with minimum 50% marks.</li>
              <li>I will not involve in any sort of common off.</li>
              <li>I will follow all the rules & regulations laid down by the DTE, MSBTE & Institute from time to time.</li>
              <li>I am aware that if in case my attendance falls below 75%, I will be detained as per MSBTE norms.</li>
              <li>If I fail to abide by my one of the above, I know that I will not be allowed to appear for the MSBTE examination of the semester & I know that it will cause loss of one year of my academic education.</li>
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

export default FYAdmissionForm;
