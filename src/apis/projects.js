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

export const createProject = (payload) => {
  // payload: plain object (JSON) or FormData (when including files: thumbnail, images[])
  return projectsApi.post("/", payload);
};

export const updateProject = (id, payload) => {
  // payload: plain object (JSON) or FormData
  return projectsApi.patch(`/${id}`, payload);
};

export const deleteProject = (id) => projectsApi.delete(`/${id}`);
