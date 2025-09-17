// auth.js - Frontend utility for handling authentication

// Add auth token to request headers
export const addAuthHeader = (config = {}) => {
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

// Configure axios instance with auth interceptors
export const configureAxiosAuth = (axiosInstance) => {
  // Request interceptor to add token to headers
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
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