import axios from 'axios';
import { getAuthHeader } from './authHeader';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';
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

export async function getAllFaculty() {
  try {
    const response = await API_INSTANCE.get('/reference-faculty');
    return response.data;
  } catch (error) {
    console.error('Error fetching faculty:', error.message);
    throw error;
  }
}

export async function getAllReferenceFaculty() {
  const response = await API_INSTANCE.get('/reference-faculty/all');
  return response.data || [];
}

export async function createReferenceFaculty(faculty) {
  const response = await API_INSTANCE.post('/reference-faculty', faculty);
  return response.data;
}

export async function updateReferenceFaculty(id, faculty) {
  const response = await API_INSTANCE.put(`/reference-faculty/${id}`, faculty);
  return response.data;
}

export async function deleteReferenceFaculty(id) {
  await API_INSTANCE.delete(`/reference-faculty/${id}`);
}
