import axios from "axios";

// Projects API

const projectsApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/projects`,
  withCredentials: true,
  headers: { Accept: "application/json" },
});

export const getPublicProjects = () => projectsApi.get("/public");
export const getPublicProjectById = (id) => projectsApi.get(`/public/${id}`);
export const listProjects = () => projectsApi.get("/");
export const getProjectById = (id) => projectsApi.get(`/${id}`);

export const createProject = (payload, config = {}) => {
  // payload: plain object (JSON) or FormData (when including files: thumbnail, images[])
  const isForm = typeof FormData !== "undefined" && payload instanceof FormData;
  const headers = {
    ...(config.headers || {}),
    ...(isForm ? { "Content-Type": "multipart/form-data" } : {}),
  };
  return projectsApi.post("/", payload, { ...config, headers });
};

export const updateProject = (id, payload, config = {}) => {
  // payload: plain object (JSON) or FormData
  const isForm = typeof FormData !== "undefined" && payload instanceof FormData;
  const headers = {
    ...(config.headers || {}),
    ...(isForm ? { "Content-Type": "multipart/form-data" } : {}),
  };
  return projectsApi.patch(`/${id}`, payload, { ...config, headers });
};

export const deleteProject = (id) => projectsApi.delete(`/${id}`);
