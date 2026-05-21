import axios from 'axios';
import { getAuthHeader } from './authHeader';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';
const API_INSTANCE = axios.create({ baseURL: API_BASE_URL });

API_INSTANCE.interceptors.request.use((config) => {
  const authHeader = getAuthHeader();
  if (authHeader) config.headers.Authorization = authHeader;
  return config;
});

export async function createCourse(course) {
  const response = await API_INSTANCE.post('/courses', course);
  return response.data;
}

export async function deleteCourse(id) {
  const response = await API_INSTANCE.delete(`/courses/${id}`);
  return response.data;
}

const courseService = { createCourse, deleteCourse };
export default courseService;
