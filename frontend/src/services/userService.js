import axios from 'axios';
import { getAuthHeader } from './authHeader';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
const API_INSTANCE = axios.create({ baseURL: API_BASE_URL });

API_INSTANCE.interceptors.request.use((config) => {
  const authHeader = getAuthHeader();
  if (authHeader) {
    config.headers.Authorization = authHeader;
  }
  return config;
});

export async function getUsers() {
  const response = await API_INSTANCE.get('/users');
  return response.data;
}

export async function createUser(user) {
  const response = await API_INSTANCE.post('/users', user);
  return response.data;
}

export async function updateUser(id, user) {
  const response = await API_INSTANCE.put(`/users/${id}`, user);
  return response.data;
}

export async function deleteUser(id) {
  await API_INSTANCE.delete(`/users/${id}`);
}

const userService = { getUsers, createUser, updateUser, deleteUser };
export default userService;
