// Manually add auth token to requests
// Helper function to use in components directly

/**
 * Manual authorization helper for API requests
 * 
 * This function directly adds the Authorization header to the config
 * of any axios request, bypassing interceptors if they're not working.
 * 
 * @param {Object} config - The axios request config object
 * @returns {Object} The modified config with auth header
 */
export const withAuth = (config = {}) => {
  const token = localStorage.getItem('authToken');
  if (!token) return config;
  
  // Make sure headers exists
  const headers = config.headers || {};
  
  // Add Authorization header with token
  return {
    ...config,
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`
    }
  };
};

/**
 * Manually create Authorization header for direct use
 * 
 * @returns {Object|null} Headers object with Authorization or null if no token
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (!token) return null;
  
  return {
    Authorization: `Bearer ${token}`
  };
};