import axios from 'axios';
import { menuConfig } from '../data/menuData';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
const API_INSTANCE = axios.create({
  baseURL: API_BASE_URL,
  headers: {}
});

/**
 * Login user with email and password
 */
export async function loginUser(email, password) {
  try {
    const response = await API_INSTANCE.post('/users/login', {
      email,
      password
    });
    localStorage.setItem('authToken', window.btoa(`${email}:${password}`));
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error || error.response?.data?.message || error.message;
    throw new Error(message);
  }
}



/**
 * Get menu items for a specific role
 */
export function getMenuForRole(role) {
  return menuConfig[role] || [];
}

/**
 * Get all available roles
 */
export function getAllRoles() {
  return Object.keys(menuConfig);
}

/**
 * Validate user role
 */
export function isValidRole(role) {
  return getAllRoles().includes(role);
}

const authServiceExports = {
  loginUser,
  getMenuForRole,
  getAllRoles,
  isValidRole
};

export default authServiceExports;
