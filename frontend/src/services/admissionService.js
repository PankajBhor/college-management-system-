import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
const API_INSTANCE = axios.create({
  baseURL: API_BASE_URL,
  // Don't set Content-Type - let axios auto-detect for FormData vs JSON
  headers: {}
});

/**
 * Add authorization token to requests
 */
API_INSTANCE.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ========== FY ADMISSION ENDPOINTS ==========

/**
 * Create a new FY admission with document uploads
 */
export async function createFYAdmission(admissionData, documents = {}) {
  try {
    const formData = new FormData();
    
    // Add admission data as form fields
    Object.keys(admissionData).forEach(key => {
      if (admissionData[key] !== null && admissionData[key] !== undefined && admissionData[key] !== '') {
        formData.append(key, admissionData[key]);
      }
    });
    
    // Add document files
    if (documents.domicileCertificate) formData.append('domicileCertificate', documents.domicileCertificate);
    if (documents.tenthMarkSheet) formData.append('tenthMarkSheet', documents.tenthMarkSheet);
    if (documents.twelfthMarkSheet) formData.append('twelfthMarkSheet', documents.twelfthMarkSheet);
    if (documents.leavingCertificate) formData.append('leavingCertificate', documents.leavingCertificate);
    if (documents.casteCertificate) formData.append('casteCertificate', documents.casteCertificate);
    if (documents.nonCreamyLayerCertificate) formData.append('nonCreamyLayerCertificate', documents.nonCreamyLayerCertificate);
    if (documents.incomeCertificate) formData.append('incomeCertificate', documents.incomeCertificate);
    if (documents.defenceCertificate) formData.append('defenceCertificate', documents.defenceCertificate);
    if (documents.aadhaarCard) formData.append('aadhaarCard', documents.aadhaarCard);
    if (documents.anyOther) formData.append('anyOther', documents.anyOther);

    // Use the existing API_INSTANCE - it already has auth interceptor
    // Let axios automatically handle Content-Type with boundary for FormData
    const response = await API_INSTANCE.post('/admissions/fy', formData);
    return response.data;
  } catch (error) {
    console.error('Error creating FY admission:', error);
    throw error;
  }
}

/**
 * Get FY admission by ID
 */
export async function getFYAdmissionById(id) {
  try {
    const response = await API_INSTANCE.get(`/admissions/fy/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching FY admission:', error);
    throw error;
  }
}

/**
 * Get all FY admissions
 */
export async function getAllFYAdmissions() {
  try {
    const response = await API_INSTANCE.get('/admissions/fy');
    return response.data;
  } catch (error) {
    console.error('Error fetching FY admissions:', error);
    throw error;
  }
}

/**
 * Get FY admissions by status
 */
export async function getFYAdmissionsByStatus(status) {
  try {
    const response = await API_INSTANCE.get(`/admissions/fy/status/${status}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching FY admissions by status:', error);
    throw error;
  }
}

/**
 * Get FY admissions by admission type
 */
export async function getFYAdmissionsByType(admissionType) {
  try {
    const response = await API_INSTANCE.get(`/admissions/fy/admission-type/${admissionType}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching FY admissions by type:', error);
    throw error;
  }
}

/**
 * Update FY admission
 */
export async function updateFYAdmission(id, admissionData) {
  try {
    const response = await API_INSTANCE.put(`/admissions/fy/${id}`, admissionData);
    return response.data;
  } catch (error) {
    console.error('Error updating FY admission:', error);
    throw error;
  }
}

/**
 * Delete FY admission
 */
export async function deleteFYAdmission(id) {
  try {
    await API_INSTANCE.delete(`/admissions/fy/${id}`);
    return { message: 'FY Admission deleted successfully' };
  } catch (error) {
    console.error('Error deleting FY admission:', error);
    throw error;
  }
}

// ========== DSY ADMISSION ENDPOINTS ==========

/**
 * Create a new DSY admission
 */
export async function createDSYAdmission(admissionData, documents = {}) {
  try {
    const formData = new FormData();
    
    // Add admission data as form fields
    Object.keys(admissionData).forEach(key => {
      if (admissionData[key] !== null && admissionData[key] !== undefined && admissionData[key] !== '') {
        formData.append(key, admissionData[key]);
      }
    });
    
    // Add document files
    if (documents.domicileCertificate) formData.append('domicileCertificate', documents.domicileCertificate);
    if (documents.sscMarkSheet) formData.append('sscMarkSheet', documents.sscMarkSheet);
    if (documents.hscMarkSheet) formData.append('hscMarkSheet', documents.hscMarkSheet);
    if (documents.casteCertificate) formData.append('casteCertificate', documents.casteCertificate);
    if (documents.nonCreamyLayerCertificate) formData.append('nonCreamyLayerCertificate', documents.nonCreamyLayerCertificate);
    if (documents.aadhaarCard) formData.append('aadhaarCard', documents.aadhaarCard);

    // Use the existing API_INSTANCE - it already has auth interceptor
    // Let axios automatically handle Content-Type with boundary for FormData
    const response = await API_INSTANCE.post('/admissions/dsy', formData);
    return response.data;
  } catch (error) {
    console.error('Error creating DSY admission:', error);
    throw error;
  }
}

/**
 * Get DSY admission by ID
 */
export async function getDSYAdmissionById(id) {
  try {
    const response = await API_INSTANCE.get(`/admissions/dsy/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching DSY admission:', error);
    throw error;
  }
}

/**
 * Get all DSY admissions
 */
export async function getAllDSYAdmissions() {
  try {
    const response = await API_INSTANCE.get('/admissions/dsy');
    return response.data;
  } catch (error) {
    console.error('Error fetching DSY admissions:', error);
    throw error;
  }
}

/**
 * Get DSY admissions by status
 */
export async function getDSYAdmissionsByStatus(status) {
  try {
    const response = await API_INSTANCE.get(`/admissions/dsy/status/${status}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching DSY admissions by status:', error);
    throw error;
  }
}

/**
 * Get DSY admissions by admission type
 */
export async function getDSYAdmissionsByType(admissionType) {
  try {
    const response = await API_INSTANCE.get(`/admissions/dsy/admission-type/${admissionType}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching DSY admissions by type:', error);
    throw error;
  }
}

/**
 * Update DSY admission
 */
export async function updateDSYAdmission(id, admissionData) {
  try {
    const response = await API_INSTANCE.put(`/admissions/dsy/${id}`, admissionData);
    return response.data;
  } catch (error) {
    console.error('Error updating DSY admission:', error);
    throw error;
  }
}

/**
 * Delete DSY admission
 */
export async function deleteDSYAdmission(id) {
  try {
    await API_INSTANCE.delete(`/admissions/dsy/${id}`);
    return { message: 'DSY Admission deleted successfully' };
  } catch (error) {
    console.error('Error deleting DSY admission:', error);
    throw error;
  }
}

// ========== DOCUMENT CHECKLIST ENDPOINTS ==========

/**
 * Get documents by admission type
 */
export async function getDocuments(admissionType) {
  try {
    const response = await API_INSTANCE.get(`/documents/${admissionType}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
}

/**
 * Initialize default documents
 */
export async function initializeDocuments() {
  try {
    const response = await API_INSTANCE.post('/documents/initialize');
    return response.data;
  } catch (error) {
    console.error('Error initializing documents:', error);
    throw error;
  }
}

// Export all as object for easier usage
export const admissionService = {
  // FY Admissions
  createFYAdmission,
  getFYAdmissionById,
  getAllFYAdmissions,
  getFYAdmissionsByStatus,
  getFYAdmissionsByType,
  updateFYAdmission,
  deleteFYAdmission,
  
  // DSY Admissions
  createDSYAdmission,
  getDSYAdmissionById,
  getAllDSYAdmissions,
  getDSYAdmissionsByStatus,
  getDSYAdmissionsByType,
  updateDSYAdmission,
  deleteDSYAdmission,
  
  // Documents
  getDocuments,
  initializeDocuments
};
