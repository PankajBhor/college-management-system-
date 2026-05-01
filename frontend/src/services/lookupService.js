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

const toOptionValue = (option) => option?.label || option?.code || '';

export async function getLookupOptions(type) {
  const response = await API_INSTANCE.get(`/lookups/${type}`);
  return response.data || [];
}

export async function getAllLocations() {
  return getLookupOptions('locations');
}

export async function getAllCategories() {
  return getLookupOptions('categories');
}

export async function getAllAdmissionTypes() {
  return getLookupOptions('admission_types');
}

export async function getAllEnquiryStatuses() {
  return getLookupOptions('enquiry_statuses');
}

export async function getAllAdmissionRounds() {
  return getLookupOptions('admission_rounds');
}

export async function getAllGenders() {
  return getLookupOptions('genders');
}

export async function getAllBloodGroups() {
  return getLookupOptions('blood_groups');
}

export async function getAllYesNoOptions() {
  return getLookupOptions('yes_no');
}

export async function getAllEducationalQualifications() {
  return getLookupOptions('educational_qualifications');
}

export async function getAllBranches() {
  const response = await API_INSTANCE.get('/courses');
  return (response.data || []).map(course => ({
    id: course.id,
    branchCode: course.code,
    branchName: course.name,
    value: course.name,
    label: `${course.code}. ${course.name}`
  }));
}

export function getOptionValue(option) {
  return toOptionValue(option);
}

const lookupService = {
  getLookupOptions,
  getAllLocations,
  getAllCategories,
  getAllAdmissionTypes,
  getAllEnquiryStatuses,
  getAllAdmissionRounds,
  getAllGenders,
  getAllBloodGroups,
  getAllYesNoOptions,
  getAllEducationalQualifications,
  getAllBranches,
  getOptionValue
};

export default lookupService;
