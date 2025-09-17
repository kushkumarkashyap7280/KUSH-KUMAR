import axios from "axios";
import { configureAxiosInstance } from "../utils/axiosConfig";

// Contacts (Public Form) API
const contactsApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/contacts`,
  withCredentials: true,
  headers: { Accept: "application/json" },
});

// Apply auth interceptor to this specific instance
configureAxiosInstance(contactsApi);

export const createContact = (payload) => {
  // payload: plain object (JSON)
  // { name, email (required), topic, message, type, meta }
  return contactsApi.post("/", payload);
};

export const listContacts = (params = {}) => {
  // Get token directly for this critical request
  const token = localStorage.getItem('authToken');
  return contactsApi.get("/", { 
    params,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined
  });
};

export const deleteContact = (id) => contactsApi.delete(`/${id}`);
