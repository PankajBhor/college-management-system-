import axios from 'axios';
import { getAuthHeader } from './authHeader';
import { parseBranchPreferences } from '../utils/branchPreferences';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';
const API_INSTANCE = axios.create({
  baseURL: API_BASE_URL,
  headers: {}
});

const defaultMerit = {
  class10: '',
  class12: '',
  iti: '',
  other: '',
  otherDescription: ''
};

export const normalizeMerit = (meritDetails, merit = null) => {
  if (merit && typeof merit === 'object') {
    return { ...defaultMerit, ...merit };
  }

  if (!meritDetails) {
    return { ...defaultMerit };
  }

  if (typeof meritDetails === 'object') {
    return { ...defaultMerit, ...meritDetails };
  }

  try {
    return { ...defaultMerit, ...JSON.parse(meritDetails) };
  } catch {
    return { ...defaultMerit };
  }
};

export const normalizeEnquiry = (enquiry) => {
  if (!enquiry) return enquiry;
  const branches = parseBranchPreferences(enquiry);
  const priorityFields = branches.reduce((fields, item) => {
    if (item.priority > 0) fields[`branchPriority${item.priority}`] = item.branch;
    return fields;
  }, {});
  return {
    ...enquiry,
    ...priorityFields,
    merit: normalizeMerit(enquiry.meritDetails, enquiry.merit)
  };
};

const normalizeEnquiryPayload = (enquiryData) => ({
  firstName: enquiryData.firstName,
  middleName: enquiryData.middleName,
  lastName: enquiryData.lastName,
  personalMobileNumber: enquiryData.personalMobileNumber,
  guardianMobileNumber: enquiryData.guardianMobileNumber,
  email: enquiryData.email,
  meritDetails: JSON.stringify(normalizeMerit(enquiryData.meritDetails, enquiryData.merit)),
  admissionFor: enquiryData.admissionFor,
  location: enquiryData.location,
  otherLocation: enquiryData.otherLocation,
  category: enquiryData.category,
  branchesInterested: JSON.stringify(enquiryData.branchesInterested),
  referenceFaculty: enquiryData.referenceFaculty,
  sscSeatNo: enquiryData.sscSeatNo,
  dteRegistrationDone: enquiryData.dteRegistrationDone,
  emailEnabled: Boolean(enquiryData.emailEnabled),
  selectedEmailPresetId: enquiryData.selectedEmailPresetId || null,
  provisionalAdmission: Boolean(enquiryData.provisionalAdmission),
  provisionalAdmissionDate: enquiryData.provisionalAdmission ? enquiryData.provisionalAdmissionDate || null : null,
  status: enquiryData.status || 'Pending',
  enquiryDate: enquiryData.enquiryDate
});

API_INSTANCE.interceptors.request.use((config) => {
  const authHeader = getAuthHeader();
  if (authHeader) {
    config.headers.Authorization = authHeader;
  }
  return config;
});

/**
 * Get all enquiries with pagination support
 */
export async function getAllEnquiries(page = 0, size = 10, sortBy = 'id', direction = 'DESC') {
  try {
    const response = await API_INSTANCE.get('/enquiries', {
      params: {
        page,
        size,
        sortBy,
        direction
      }
    });
    const data = response.data;
    if (data?.content) {
      return { ...data, content: data.content.map(normalizeEnquiry) };
    }
    if (Array.isArray(data)) {
      return data.map(normalizeEnquiry);
    }
    return data;
  } catch (error) {
    console.error('Error fetching enquiries:', error.message);
    throw error;
  }
}

/**
 * Get single enquiry by ID
 */
export async function getEnquiryById(id) {
  try {
    const response = await API_INSTANCE.get(`/enquiries/${id}`);
    return normalizeEnquiry(response.data);
  } catch (error) {
    console.error('Error fetching enquiry:', error.message);
    throw error;
  }
}

/**
 * Create new enquiry
 */
export async function createEnquiry(enquiryData) {
  try {
    const apiData = normalizeEnquiryPayload(enquiryData);

    const response = await API_INSTANCE.post('/enquiries', apiData);
    return normalizeEnquiry(response.data);
  } catch (error) {
    console.error('Error creating enquiry:', error.message);
    throw error;
  }
}

/**
 * Update enquiry
 */
export async function updateEnquiry(id, enquiryData) {
  try {
    const apiData = normalizeEnquiryPayload(enquiryData);

    const response = await API_INSTANCE.put(`/enquiries/${id}`, apiData);
    return normalizeEnquiry(response.data);
  } catch (error) {
    console.error('Error updating enquiry:', error.message);
    throw error;
  }
}

/**
 * Delete enquiry
 */
export async function deleteEnquiry(id) {
  try {
    await API_INSTANCE.delete(`/enquiries/${id}`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting enquiry:', error.message);
    throw error;
  }
}

/**
 * Update enquiry status
 */
export async function updateStatus(id, status) {
  try {
    const response = await API_INSTANCE.patch(`/enquiries/${id}/status`, { status });
    return normalizeEnquiry(response.data);
  } catch (error) {
    console.error('Error updating enquiry status:', error.message);
    throw error;
  }
}

/**
 * Search enquiries by status with pagination
 */
export async function searchEnquiries(status, page = 0, size = 10) {
  try {
    const response = await API_INSTANCE.get(`/enquiries/by-status/${status}`, {
      params: {
        page,
        size,
        sortBy: 'id',
        direction: 'DESC'
      }
    });
    const data = response.data;
    if (data?.content) {
      return { ...data, content: data.content.map(normalizeEnquiry) };
    }
    if (Array.isArray(data)) {
      return data.map(normalizeEnquiry);
    }
    return data;
  } catch (error) {
    console.error('Error searching enquiries by status:', error.message);
    throw error;
  }
}

/**
 * Get enquiries by category with pagination
 */
export async function getEnquiriesByCategory(category, page = 0, size = 10) {
  try {
    const response = await API_INSTANCE.get(`/enquiries/by-category/${category}`, {
      params: {
        page,
        size,
        sortBy: 'id',
        direction: 'DESC'
      }
    });
    const data = response.data;
    if (data?.content) {
      return { ...data, content: data.content.map(normalizeEnquiry) };
    }
    if (Array.isArray(data)) {
      return data.map(normalizeEnquiry);
    }
    return data;
  } catch (error) {
    console.error('Error fetching enquiries by category:', error.message);
    throw error;
  }
}

/**
 * Get enquiries by admission type with pagination
 */
export async function getEnquiriesByAdmission(admissionFor, page = 0, size = 10) {
  try {
    const response = await API_INSTANCE.get(`/enquiries/by-admission/${admissionFor}`, {
      params: {
        page,
        size,
        sortBy: 'id',
        direction: 'DESC'
      }
    });
    const data = response.data;
    if (data?.content) {
      return { ...data, content: data.content.map(normalizeEnquiry) };
    }
    if (Array.isArray(data)) {
      return data.map(normalizeEnquiry);
    }
    return data;
  } catch (error) {
    console.error('Error fetching enquiries by admission:', error.message);
    throw error;
  }
}

/**
 * Get enquiries by location with pagination
 */
export async function getEnquiriesByLocation(location, page = 0, size = 10) {
  try {
    const response = await API_INSTANCE.get(`/enquiries/by-location/${location}`, {
      params: {
        page,
        size,
        sortBy: 'id',
        direction: 'DESC'
      }
    });
    const data = response.data;
    if (data?.content) {
      return { ...data, content: data.content.map(normalizeEnquiry) };
    }
    if (Array.isArray(data)) {
      return data.map(normalizeEnquiry);
    }
    return data;
  } catch (error) {
    console.error('Error fetching enquiries by location:', error.message);
    throw error;
  }
}

/**
 * Get enquiry by SSC Seat No
 */
export async function getEnquiryBySscSeatNo(sscSeatNo) {
  try {
    const response = await API_INSTANCE.get(`/enquiries/by-seat/${sscSeatNo}`);
    return normalizeEnquiry(response.data);
  } catch (error) {
    console.error('Error fetching enquiry by SSC seat number:', error.message);
    throw error;
  }
}

export async function getProvisionalEnquiries() {
  try {
    const response = await API_INSTANCE.get('/enquiries/provisional');
    return Array.isArray(response.data) ? response.data.map(normalizeEnquiry) : response.data;
  } catch (error) {
    console.error('Error fetching provisional enquiries:', error.message);
    throw error;
  }
}

export async function bulkUploadEnquiries(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await API_INSTANCE.post('/enquiries/bulk-upload', formData);
    return response.data;
  } catch (error) {
    console.error('Error uploading enquiries:', error.message);
    throw error;
  }
}

export async function downloadEnquiryBulkUploadTemplate() {
  try {
    const response = await API_INSTANCE.get('/enquiries/bulk-upload/template', {
      responseType: 'blob'
    });
    downloadBlob(response.data, 'enquiry-bulk-upload-template.xlsx');
  } catch (error) {
    console.error('Error downloading enquiry template:', error.message);
    throw error;
  }
}

const downloadBlob = (blob, fileName) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

const enquiryServiceExports = {
  getAllEnquiries,
  getEnquiryById,
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  updateStatus,
  searchEnquiries,
  getEnquiriesByCategory,
  getEnquiriesByAdmission,
  getEnquiriesByLocation,
  getEnquiryBySscSeatNo,
  getProvisionalEnquiries,
  bulkUploadEnquiries,
  downloadEnquiryBulkUploadTemplate
};

export default enquiryServiceExports;
