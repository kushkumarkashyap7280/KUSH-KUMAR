import axios from "axios";

// Contacts (Public Form) API

const contactsApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/contacts`,
  withCredentials: true,
  headers: { Accept: "application/json" },
});

export const createContact = (payload) => {
  // payload: plain object (JSON)
  // { name, email (required), topic, message, type, meta }
  return contactsApi.post("/", payload);
};

export const listContacts = (params = {}) => contactsApi.get("/", { params }); // admin-protected

export const deleteContact = (id) => contactsApi.delete(`/${id}`);
