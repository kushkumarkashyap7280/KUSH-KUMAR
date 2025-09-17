import axios from "axios";
import { setAuthToken, removeAuthToken } from "../utils/auth";

// Admin API
// Note: For file uploads (signup/update with avatar/resume), pass a FormData instance.

export const adminApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/admin`,
  withCredentials: true, // Essential for sending and receiving cookies
  headers: { Accept: "application/json" },
});

export const adminLogin = async ({ email, password }) => {
  const response = await adminApi.post("/login", { email, password });
  // Store token in localStorage as backup auth method
  if (response.data?.data?.token) {
    setAuthToken(response.data.data.token);
  }
  return response;
};

export const adminLogout = async () => {
  await adminApi.post("/logout");
  // Clear the token from localStorage on logout
  removeAuthToken();
};

export const adminUpdate = async (payload, config = {}) => {
  // Accepts either JSON object or FormData; allow progress and extra config
  const isForm = typeof FormData !== "undefined" && payload instanceof FormData;
  const headers = {
    ...(config.headers || {}),
    ...(isForm ? { "Content-Type": "multipart/form-data" } : {}),
  };
  return adminApi.patch("/update", payload, { ...config, headers });
};

export const ifAdminLoggedIn = async () => {
  try {
    // Try using the cookie-based authentication first
    return await adminApi.get("/me");
  } catch (error) {
    // If cookie auth fails, the global axios interceptor will automatically
    // add the token header for subsequent requests if the token exists
    // We don't need to manually add the token here anymore
    throw error;
  }
};

// Public admin profile by configured email
export const getAdminStatus = async () => {
  return adminApi.get("/status");
};

// Public resume URL
export const getPublicResume = async () => {
  return adminApi.get("/resume");
};
