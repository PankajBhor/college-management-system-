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

export async function getAllFaculty() {
  try {
    const response = await API_INSTANCE.get('/faculty');
    return response.data;
  } catch (error) {
    console.error('Error fetching faculty:', error.message);
    throw error;
  }
}
