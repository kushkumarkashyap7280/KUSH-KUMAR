import axios from "axios";

// Admin API
// Note: For file uploads (signup/update with avatar/resume), pass a FormData instance.

const adminApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/admin`,
  withCredentials: true,
  headers: { Accept: "application/json" },
});

export const adminLogin = async ({ email, password }) => {
  return adminApi.post("/login", { email, password });
};

export const adminLogout = async () => {
  return adminApi.post("/logout");
};

export const adminUpdate = async (payload) => {
  // Accepts either JSON object or FormData
  return adminApi.patch("/update", payload);
};

export const ifAdminLoggedIn = async () => {
  return adminApi.get("/me");
};

// Public admin profile by configured email
export const getAdminStatus = async () => {
  return adminApi.get("/status");
};

// Public resume URL
export const getPublicResume = async () => {
  return adminApi.get("/resume");
};
