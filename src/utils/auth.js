// auth.js - Frontend utility for handling authentication

/**
 * Get the authentication token from localStorage
 * @returns {string|null} The auth token or null if not found
 */
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Store the authentication token in localStorage
 * @param {string} token - The authentication token to store
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
  }
};

/**
 * Remove the authentication token from localStorage
 */
export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

/**
 * Check if the user is authenticated
 * @returns {boolean} True if the user has an auth token
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};

/**
 * Add auth token to request headers
 * @param {Object} config - The axios request config
 * @returns {Object} The updated config with auth headers
 */
export const addAuthHeader = (config = {}) => {
  const token = getAuthToken();
  if (!token) return config;
  
  return {
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${token}`
    }
  };
};

/**
 * Configure axios instance with auth interceptors
 * @param {Object} axiosInstance - The axios instance to configure
 * @returns {Object} The configured axios instance
 */
export const configureAxiosAuth = (axiosInstance) => {
  // Request interceptor to add token to headers
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`
        };
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  return axiosInstance;
};