import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
const API_INSTANCE = axios.create({
  baseURL: API_BASE_URL,
  headers: {}
});

export async function getAllFaculty() {
  try {
    const response = await API_INSTANCE.get('/faculty');
    return response.data;
  } catch (error) {
    console.warn('API call failed for faculty:', error.message);
    return [];
  }
}
