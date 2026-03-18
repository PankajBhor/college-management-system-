import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

/**
 * Centralized API client with request/response interceptors
 * Handles authentication, errors, and retries
 */
class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  setupInterceptors() {
    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle errors and refresh token
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle 401 Unauthorized - redirect to login
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(new Error('Session expired. Please login again.'));
        }

        // Handle other errors
        const message = error.response?.data?.message || error.message || 'An error occurred';
        console.error('Response error:', message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * GET request
   */
  get(url, config = {}) {
    return this.client.get(url, config);
  }

  /**
   * POST request
   */
  post(url, data = {}, config = {}) {
    return this.client.post(url, data, config);
  }

  /**
   * PUT request
   */
  put(url, data = {}, config = {}) {
    return this.client.put(url, data, config);
  }

  /**
   * PATCH request
   */
  patch(url, data = {}, config = {}) {
    return this.client.patch(url, data, config);
  }

  /**
   * DELETE request
   */
  delete(url, config = {}) {
    return this.client.delete(url, config);
  }

  /**
   * Set authorization token
   */
  setAuthToken(token) {
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('authToken', token);
    } else {
      delete this.client.defaults.headers.common['Authorization'];
      localStorage.removeItem('authToken');
    }
  }

  /**
   * Get auth token
   */
  getAuthToken() {
    return localStorage.getItem('authToken');
  }
}

// Export singleton instance
export default new ApiClient();
