
import axios from 'axios';
import { mockEnquiries } from '../data/mockEnquiries';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
const API_INSTANCE = axios.create({
  baseURL: API_BASE_URL,
  headers: {}
});

// In-memory storage for enquiries during development
let enquiriesStore = [...mockEnquiries];

/**
 * Get all enquiries with pagination support
 */
export async function getAllEnquiries(page = 0, size = 10, sortBy = 'id', direction = 'DESC') {
  try {
    // Try real API first
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
    console.warn('API call failed, using mock data:', error.message);
    // Fallback to mock data - paginate manually
    const start = page * size;
    const end = start + size;
    return {
      content: enquiriesStore.slice(start, end),
      pageNumber: page,
      pageSize: size,
      totalElements: enquiriesStore.length,
      totalPages: Math.ceil(enquiriesStore.length / size),
      isFirst: page === 0,
      isLast: end >= enquiriesStore.length,
      hasNext: end < enquiriesStore.length,
      hasPrevious: page > 0
    };
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
    console.warn('API call failed, using mock data:', error.message);
    return enquiriesStore.find(e => e.id === id);
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
    console.warn('API call failed, using mock store:', error.message);
    // Fallback - create in mock store
    const newEnquiry = {
      id: Math.max(...enquiriesStore.map(e => e.id), 0) + 1,
      ...enquiryData,
      enquiryDate: new Date().toISOString().split('T')[0],
      status: enquiryData.status || 'Pending'
    };
    enquiriesStore.push(newEnquiry);
    return newEnquiry;
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
    console.warn('API call failed, using mock store:', error.message);
    // Fallback - update in mock store
    const index = enquiriesStore.findIndex(e => e.id === id);
    if (index !== -1) {
      enquiriesStore[index] = { ...enquiriesStore[index], ...enquiryData };
      return enquiriesStore[index];
    }
    throw new Error('Enquiry not found');
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
    console.warn('API call failed, using mock store:', error.message);
    // Fallback - delete from mock store
    const index = enquiriesStore.findIndex(e => e.id === id);
    if (index !== -1) {
      enquiriesStore.splice(index, 1);
      return { success: true };
    }
    throw new Error('Enquiry not found');
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
    console.warn('API call failed, using mock store:', error.message);
    // Fallback - update in mock store
    const index = enquiriesStore.findIndex(e => e.id === id);
    if (index !== -1) {
      enquiriesStore[index].status = status;
      enquiriesStore[index].updatedAt = new Date().toISOString();
      return enquiriesStore[index];
    }
    throw new Error('Enquiry not found');
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
    console.warn('API call failed, using mock store:', error.message);
    // Fallback - filter and paginate in mock store
    const filtered = enquiriesStore.filter(e => e.status === status);
    const start = page * size;
    const end = start + size;
    return {
      content: filtered.slice(start, end),
      pageNumber: page,
      pageSize: size,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
      isFirst: page === 0,
      isLast: end >= filtered.length,
      hasNext: end < filtered.length,
      hasPrevious: page > 0
    };
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
    console.warn('API call failed, using mock store:', error.message);
    // Fallback - filter and paginate in mock store
    const filtered = enquiriesStore.filter(e => e.category === category);
    const start = page * size;
    const end = start + size;
    return {
      content: filtered.slice(start, end),
      pageNumber: page,
      pageSize: size,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
      isFirst: page === 0,
      isLast: end >= filtered.length,
      hasNext: end < filtered.length,
      hasPrevious: page > 0
    };
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
    console.warn('API call failed, using mock store:', error.message);
    // Fallback - filter and paginate in mock store
    const filtered = enquiriesStore.filter(e => e.admissionFor === admissionFor);
    const start = page * size;
    const end = start + size;
    return {
      content: filtered.slice(start, end),
      pageNumber: page,
      pageSize: size,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
      isFirst: page === 0,
      isLast: end >= filtered.length,
      hasNext: end < filtered.length,
      hasPrevious: page > 0
    };
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
    console.warn('API call failed, using mock store:', error.message);
    // Fallback - filter and paginate in mock store
    const filtered = enquiriesStore.filter(e => e.location === location);
    const start = page * size;
    const end = start + size;
    return {
      content: filtered.slice(start, end),
      pageNumber: page,
      pageSize: size,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
      isFirst: page === 0,
      isLast: end >= filtered.length,
      hasNext: end < filtered.length,
      hasPrevious: page > 0
    };
  }
}

/**
 * Get enquiry by SSC Seat No
 */
export async function getEnquiryBySscSeatNo(sscSeatNo) {
  try {
    // Try real API first
    const response = await API_INSTANCE.get(`/enquiries/by-seat/${sscSeatNo}`);
    return response.data;
  } catch (error) {
    console.warn('API call failed, using mock store:', error.message);
    // Fallback - search in mock store
    return enquiriesStore.find(e => e.sscSeatNo && e.sscSeatNo.toUpperCase() === sscSeatNo.toUpperCase());
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
