import axios from 'axios';
import { menuConfig, testUsers, backdoorUsers } from '../data/menuData';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
const API_INSTANCE = axios.create({
  baseURL: API_BASE_URL,
  headers: {}
});

// Test password for all test accounts
const TEST_PASSWORD = 'password';

/**
 * Login user with email and password
 * Tries real backend first, falls back to mock data
 */
export async function loginUser(email, password) {
  try {
    // Try real API first
    const response = await API_INSTANCE.post('/users/login', {
      email,
      password
    });
    return response.data;
  } catch (error) {
    // Fallback to mock data for development
    const testUser = testUsers[email.toLowerCase()];
    if (testUser && password === TEST_PASSWORD) {
      return {
        id: Math.random(),
        email,
        password: undefined, // Don't send password back
        ...testUser
      };
    }
    throw new Error(testUser ? 'Wrong password!' : 'Email not found!');
  }
}

/**
 * Get all test user accounts
 * Used for backdoor login support
 */
export function getTestUsers() {
  return testUsers;
}

/**
 * Get backdoor user for quick testing
 * @param {string} key - backdoor key (principal, office, enquiry, faculty, hod)
 */
export function getBackdoorUser(key) {
  return backdoorUsers[key.toLowerCase()];
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
  getTestUsers,
  getBackdoorUser,
  getMenuForRole,
  getAllRoles,
  isValidRole
};

export default authServiceExports;
