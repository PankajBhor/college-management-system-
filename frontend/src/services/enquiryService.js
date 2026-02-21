import axios from 'axios';
import { mockEnquiries } from '../data/mockEnquiries';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
const API_INSTANCE = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// In-memory storage for enquiries during development
let enquiriesStore = [...mockEnquiries];

/**
 * Get all enquiries
 */
export async function getAllEnquiries() {
  try {
    // Try real API first
    const response = await API_INSTANCE.get('/enquiries');
    return response.data;
  } catch (error) {
    // Fallback to mock data
    return enquiriesStore;
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
    return enquiriesStore.find(e => e.id === id);
  }
}

/**
 * Create new enquiry
 */
export async function createEnquiry(enquiryData) {
  try {
    const response = await API_INSTANCE.post('/enquiries', enquiryData);
    return response.data;
  } catch (error) {
    // Fallback - create in mock store
    const newEnquiry = {
      id: Math.max(...enquiriesStore.map(e => e.id), 0) + 1,
      ...enquiryData,
      enquiryDate: new Date().toISOString().split('T')[0]
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
    const response = await API_INSTANCE.put(`/enquiries/${id}`, enquiryData);
    return response.data;
  } catch (error) {
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
 * Search enquiries by status
 */
export async function searchEnquiries(status) {
  const allEnquiries = await getAllEnquiries();
  return allEnquiries.filter(e => e.status === status);
}

const enquiryServiceExports = {
  getAllEnquiries,
  getEnquiryById,
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  searchEnquiries
};

export default enquiryServiceExports;
