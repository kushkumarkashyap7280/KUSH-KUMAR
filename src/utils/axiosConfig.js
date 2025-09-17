import axios from 'axios';

/**
 * Configure global axios interceptors to handle authentication for all API requests
 * This ensures all API calls include the authentication token if it exists
 */
export const setupAxiosInterceptors = () => {
  // Request interceptor - adds auth token to all requests
  axios.interceptors.request.use(
    (config) => {
      // Get token from localStorage
      const token = localStorage.getItem('authToken');
      
      // If token exists, add it to the Authorization header
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`
        };
      }
      
      // Debug log to check if token is being added
      console.log(`Request to ${config.url} with auth:`, !!token);
      
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - handle token expiration or auth errors
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle 401 errors globally (optional)
      if (error.response && error.response.status === 401) {
        // Could dispatch a logout action or redirect to login page
        console.warn('Authentication error:', error.response.data?.message || 'Unauthorized', error.config.url);
        
        // You could automatically redirect to login or handle differently
        // window.location.href = '/login';
      }
      
      return Promise.reject(error);
    }
  );

  console.log('Global axios interceptors configured');
};

/**
 * Apply authentication to a specific axios instance
 * Use this for each API instance in your project
 */
export const configureAxiosInstance = (axiosInstance) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`
        };
      }
      
      // Debug log for instance-specific requests
      console.log(`Instance request to ${config.url} with auth:`, !!token);
      
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  return axiosInstance;
};

/**
 * Helper function to add auth headers to a single request config
 * Useful for one-off requests not using the global interceptor
 */
export const addAuthHeaders = (config = {}) => {
  const token = localStorage.getItem('authToken');
  if (!token) return config;
  
  return {
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${token}`
    }
  };
};