import axios from 'axios';
import { getAuthHeader } from './authHeader';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';
const API_INSTANCE = axios.create({ baseURL: API_BASE_URL });

API_INSTANCE.interceptors.request.use((config) => {
  const authHeader = getAuthHeader();
  if (authHeader) {
    config.headers.Authorization = authHeader;
  }
  return config;
});

export async function getHomePageContent() {
  const response = await API_INSTANCE.get('/home-page');
  return response.data;
}

export async function updateHomePageContent(content) {
  const response = await API_INSTANCE.put('/home-page', content);
  return response.data;
}

const homePageService = { getHomePageContent, updateHomePageContent };
export default homePageService;
