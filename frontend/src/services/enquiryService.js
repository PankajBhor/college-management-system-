import axios from 'axios';
import { getAuthHeader } from './authHeader';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
const API_INSTANCE = axios.create({
  baseURL: API_BASE_URL,
  headers: {}
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
    return response.data;
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
    return response.data;
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
    // Convert form data to API format
    const apiData = {
      firstName: enquiryData.firstName,
      middleName: enquiryData.middleName,
      lastName: enquiryData.lastName,
      personalMobileNumber: enquiryData.personalMobileNumber,
      guardianMobileNumber: enquiryData.guardianMobileNumber,
      email: enquiryData.email,
      meritDetails: JSON.stringify(enquiryData.merit),
      admissionFor: enquiryData.admissionFor,
      location: enquiryData.location,
      otherLocation: enquiryData.otherLocation,
      category: enquiryData.category,
      branchesInterested: JSON.stringify(enquiryData.branchesInterested),
      referenceFaculty: enquiryData.referenceFaculty,
      dteRegistrationDone: enquiryData.dteRegistrationDone,
      status: enquiryData.status || 'Pending',
      enquiryDate: enquiryData.enquiryDate
    };

    const response = await API_INSTANCE.post('/enquiries', apiData);
    return response.data;
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
    // Convert form data to API format
    const apiData = {
      firstName: enquiryData.firstName,
      middleName: enquiryData.middleName,
      lastName: enquiryData.lastName,
      personalMobileNumber: enquiryData.personalMobileNumber,
      guardianMobileNumber: enquiryData.guardianMobileNumber,
      email: enquiryData.email,
      meritDetails: JSON.stringify(enquiryData.merit),
      admissionFor: enquiryData.admissionFor,
      location: enquiryData.location,
      otherLocation: enquiryData.otherLocation,
      category: enquiryData.category,
      branchesInterested: JSON.stringify(enquiryData.branchesInterested),
      referenceFaculty: enquiryData.referenceFaculty,
      dteRegistrationDone: enquiryData.dteRegistrationDone,
      status: enquiryData.status,
      enquiryDate: enquiryData.enquiryDate
    };

    const response = await API_INSTANCE.put(`/enquiries/${id}`, apiData);
    return response.data;
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
    return response.data;
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
    return response.data;
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
    return response.data;
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
    return response.data;
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
    return response.data;
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
    return response.data;
  } catch (error) {
    console.error('Error fetching enquiry by SSC seat number:', error.message);
    throw error;
  }
}

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
  getEnquiryBySscSeatNo
};

export default enquiryServiceExports;
